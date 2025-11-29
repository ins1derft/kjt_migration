<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class FormController extends Controller
{
    public function show(string $code)
    {
        $form = Form::query()->where('code', $code)->first();

        if (!$form) {
            return response()->json(['fields' => []]);
        }

        $config = $form->config ?? [];

        $fields = collect($config['fields'] ?? [])
            ->filter(fn ($field) => is_array($field) && !empty($field['name']))
            ->values();

        return response()->json([
            'code' => $form->code,
            'title' => $form->title,
            'fields' => $fields->values(),
        ]);
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

        $fields = collect($config['fields'] ?? [])
            ->filter(fn ($field) => is_array($field) && !empty($field['name']))
            ->values();

        if ($fields->isEmpty()) {
            $fields = collect([
                ['name' => 'email', 'type' => 'email', 'required' => true],
            ]);
        }

        $rules = $this->buildValidationRules($fields);

        $validated = $request->validate($rules);

        $payload = $fields->mapWithKeys(function ($field) use ($validated, $request) {
            $name = $field['name'];
            return [$name => $validated[$name] ?? $request->input($name)];
        })->toArray();

        Lead::query()->create([
            'form_code' => $form?->code ?? $code,
            'payload' => $payload,
            'source_url' => $validated['source_url'] ?? $request->input('source_url'),
            'utm' => $validated['utm'] ?? $request->input('utm'),
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
                default:
                    $fieldRules[] = 'string';
                    break;
            }

            $rules[$name] = $fieldRules;
        }

        return $rules;
    }
}
