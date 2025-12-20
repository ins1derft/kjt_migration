<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class FormController extends Controller
{
    public function show(Request $request, string $code)
    {
        $form = Form::query()->where('code', $code)->first();

        if (!$form) {
            return response()->json(['fields' => []]);
        }

        $config = $form->config ?? [];

        $steps = $this->normalizeSteps($config['steps'] ?? []);
        $fields = $this->normalizeFields($config['fields'] ?? []);
        $flattenedStepFields = $steps->flatMap(fn (array $step) => $step['fields'] ?? []);

        if ($fields->isEmpty() && $flattenedStepFields->isNotEmpty()) {
            $fields = $flattenedStepFields->values();
        }

        $payload = [
            'code' => $form->code,
            'title' => $form->title,
            'topic' => $form->topic,
            'fields' => $fields->values(),
            'steps' => $steps->values(),
            'submit_label' => $config['submit_label'] ?? null,
            'success_message' => $config['success_message'] ?? null,
            'disclaimer' => $config['disclaimer'] ?? null,
        ];

        if ($fieldsQuery = $request->query('fields')) {
            $keys = array_filter(array_map('trim', explode(',', $fieldsQuery)));
            if (!empty($keys)) {
                $payload = Arr::only($payload, $keys);
            }
        }

        return response()->json($payload);
    }

    public function submit(Request $request, string $code)
    {
        $form = Form::query()->where('code', $code)->first();

        $config = $form?->config ?? [
            'fields' => [
                ['name' => 'name', 'label' => 'Name', 'type' => 'text', 'required' => false],
                ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true],
                ['name' => 'message', 'label' => 'Message', 'type' => 'textarea', 'required' => false],
            ],
        ];

        $steps = $this->normalizeSteps($config['steps'] ?? []);
        $fields = $steps->isNotEmpty()
            ? $steps->flatMap(fn (array $step) => $step['fields'] ?? [])->values()
            : $this->normalizeFields($config['fields'] ?? []);

        if ($fields->isEmpty()) {
            $fields = collect([
                ['name' => 'email', 'type' => 'email', 'required' => true],
            ]);
        }

        $rules = $this->buildValidationRules($fields);

        $validated = $request->validate([
            ...$rules,
            'product_variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'topic' => ['nullable', 'string', 'max:255'],
        ]);

        $payload = $fields->mapWithKeys(function ($field) use ($validated, $request, $form, $code) {
            $name = $field['name'];
            $type = $field['type'] ?? 'text';

            if ($type === 'file') {
                if ($request->hasFile($name)) {
                    $file = $request->file($name);
                    if ($file instanceof UploadedFile) {
                        $path = $file->storePublicly('forms/' . ($form?->code ?? $code), 'public');
                        return [
                            $name => [
                                'path' => $path,
                                'original_name' => $file->getClientOriginalName(),
                                'mime_type' => $file->getClientMimeType(),
                                'size' => $file->getSize(),
                            ],
                        ];
                    }
                }

                return [$name => null];
            }

            return [$name => $validated[$name] ?? $request->input($name)];
        })->toArray();

        $topic = $validated['topic']
            ?? $request->input('topic')
            ?? $form?->topic
            ?? $form?->title;

        if ($topic !== null && !array_key_exists('topic', $payload)) {
            $payload['topic'] = $topic;
        }

        Lead::query()->create([
            'form_code' => $form?->code ?? $code,
            'topic' => $topic,
            'product_variant_id' => $validated['product_variant_id'] ?? $request->input('product_variant_id'),
            'payload' => $payload,
            'source_url' => $validated['source_url'] ?? $request->input('source_url'),
            'utm' => $validated['utm'] ?? $request->input('utm'),
            'submitted_at' => Carbon::now(),
        ]);

        return response()->json(['success' => true], 201);
    }

    /**
     * @param Collection<int, array<string, mixed>> $fields
     * @return array<string, array<int, string>>
     */
    protected function buildValidationRules(Collection $fields): array
    {
        $rules = [
            'source_url' => ['nullable', 'url'],
            'utm' => ['nullable', 'array'],
        ];

        foreach ($fields as $field) {
            $name = $field['name'];
            $type = $field['type'] ?? 'text';
            $required = (bool) ($field['required'] ?? false);

            $fieldRules = [$required ? 'required' : 'nullable'];

            $options = $field['options'] ?? [];

            switch ($type) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'date':
                    $fieldRules[] = 'date_format:Y-m-d';
                    break;
                case 'checkbox':
                    if (!empty($options) && is_array($options)) {
                        $fieldRules[] = 'array';
                        $fieldRules[] = 'nullable';
                        $rules[$name . '.*'] = ['in:' . implode(',', array_keys($options))];
                    } else {
                        $fieldRules[] = 'boolean';
                    }
                    break;
                case 'select':
                    if (is_array($options) && !empty($options)) {
                        $values = array_keys($options);
                        $fieldRules[] = 'in:' . implode(',', $values);
                    } else {
                        $fieldRules[] = 'string';
                    }
                    break;
                case 'radio':
                    if (is_array($options) && !empty($options)) {
                        $values = array_keys($options);
                        $fieldRules[] = 'in:' . implode(',', $values);
                    } else {
                        $fieldRules[] = 'string';
                    }
                    break;
                case 'file':
                    $fieldRules[] = 'file';
                    $fieldRules[] = 'mimes:pdf,doc,docx,txt,rtf,odt,jpg,jpeg,png,webp';
                    $fieldRules[] = 'max:10240';
                    break;
                default:
                    $fieldRules[] = 'string';
                    break;
            }

            $rules[$name] = $fieldRules;
        }

        return $rules;
    }

    /**
     * @param array<int, mixed> $fields
     * @return Collection<int, array<string, mixed>>
     */
    protected function normalizeFields(array $fields): Collection
    {
        return collect($fields)
            ->filter(fn ($field) => is_array($field) && !empty($field['name']))
            ->values();
    }

    /**
     * @param array<int, mixed> $steps
     * @return Collection<int, array<string, mixed>>
     */
    protected function normalizeSteps(array $steps): Collection
    {
        return collect($steps)
            ->filter(fn ($step) => is_array($step))
            ->map(function (array $step) {
                $fields = $this->normalizeFields($step['fields'] ?? []);
                $title = is_string($step['title'] ?? null) ? $step['title'] : null;
                return [
                    'title' => $title,
                    'next_label' => is_string($step['next_label'] ?? null) ? $step['next_label'] : null,
                    'prev_label' => is_string($step['prev_label'] ?? null) ? $step['prev_label'] : null,
                    'fields' => $fields->values()->all(),
                ];
            })
            ->filter(fn (array $step) => !empty($step['fields']) || !empty($step['title']))
            ->values();
    }
}
