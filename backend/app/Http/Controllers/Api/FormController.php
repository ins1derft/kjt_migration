<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class FormController extends Controller
{
    public function show(Request $request, string $code)
    {
        $form = Form::query()
            ->with(['fields' => fn ($q) => $q->orderBy('position')->with('options')])
            ->where('code', $code)
            ->first();

        if (!$form) {
            return response()->json(['fields' => []]);
        }

        $fields = $form->fields?->map(function ($field) {
            return [
                'name' => $field->name,
                'label' => $field->label,
                'type' => $field->type,
                'required' => (bool) $field->required,
                'placeholder' => $field->placeholder,
                'options' => $field->options?->mapWithKeys(
                    fn ($opt) => [$opt->value => $opt->label]
                )->toArray() ?? [],
            ];
        })->values() ?? collect();

        $payload = [
            'code' => $form->code,
            'title' => $form->title,
            'fields' => $fields->values(),
            'submit_label' => $form->submit_label,
            'success_message' => $form->success_message,
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
        $form = Form::query()
            ->with(['fields' => fn ($q) => $q->orderBy('position')->with('options')])
            ->where('code', $code)
            ->first();

        $fields = $form?->fields?->map(function ($field) {
            return [
                'name' => $field->name,
                'label' => $field->label,
                'type' => $field->type,
                'required' => (bool) $field->required,
                'placeholder' => $field->placeholder,
                'options' => $field->options?->mapWithKeys(
                    fn ($opt) => [$opt->value => $opt->label]
                )->toArray() ?? [],
            ];
        })->values() ?? collect();

        if ($fields->isEmpty()) {
            $fields = collect([
                ['name' => 'email', 'label' => 'Email', 'type' => 'email', 'required' => true],
            ]);
        }

        $rules = $this->buildValidationRules($fields);

        $validated = $request->validate([
            ...$rules,
            'product_variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
        ]);

        $payload = $fields->mapWithKeys(function ($field) use ($validated, $request) {
            $name = $field['name'];
            return [$name => $validated[$name] ?? $request->input($name)];
        })->toArray();

        Lead::query()->create([
            'form_code' => $form?->code ?? $code,
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
