<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('label');
            $table->string('type');
            $table->boolean('required')->default(false);
            $table->string('placeholder')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('form_field_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_field_id')->constrained()->cascadeOnDelete();
            $table->string('value');
            $table->string('label');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        if (Schema::hasTable('forms')) {
            $forms = \Illuminate\Support\Facades\DB::table('forms')
                ->select('id', 'config')
                ->whereNotNull('config')
                ->get();

            foreach ($forms as $form) {
                $config = json_decode($form->config ?? '[]', true);
                if (!is_array($config)) {
                    continue;
                }
                $fields = $config['fields'] ?? [];
                foreach (array_values($fields) as $index => $field) {
                    $fieldId = \Illuminate\Support\Facades\DB::table('form_fields')->insertGetId([
                        'form_id' => $form->id,
                        'name' => $field['name'] ?? 'field_' . $index,
                        'label' => $field['label'] ?? '',
                        'type' => $field['type'] ?? 'text',
                        'required' => (bool) ($field['required'] ?? false),
                        'placeholder' => $field['placeholder'] ?? null,
                        'position' => $index,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $options = $field['options'] ?? [];
                    if (is_array($options)) {
                        foreach (array_values($options) as $optIndex => $option) {
                            \Illuminate\Support\Facades\DB::table('form_field_options')->insert([
                                'form_field_id' => $fieldId,
                                'value' => is_array($option) ? ($option['value'] ?? '') : (string) $optIndex,
                                'label' => is_array($option) ? ($option['label'] ?? '') : (string) $option,
                                'position' => $optIndex,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('form_field_options');
        Schema::dropIfExists('form_fields');
    }
};
