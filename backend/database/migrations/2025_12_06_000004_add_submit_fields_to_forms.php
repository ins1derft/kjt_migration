<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('forms', function (Blueprint $table) {
            $table->string('submit_label')->nullable()->after('title');
            $table->string('success_message')->nullable()->after('submit_label');
        });

        if (Schema::hasColumn('forms', 'config')) {
            $forms = \Illuminate\Support\Facades\DB::table('forms')
                ->select('id', 'config')
                ->whereNotNull('config')
                ->get();

            foreach ($forms as $form) {
                $config = json_decode($form->config ?? '[]', true);
                if (!is_array($config)) {
                    continue;
                }
                \Illuminate\Support\Facades\DB::table('forms')
                    ->where('id', $form->id)
                    ->update([
                        'submit_label' => $config['submit_label'] ?? null,
                        'success_message' => $config['success_message'] ?? null,
                    ]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('forms', function (Blueprint $table) {
            $table->dropColumn(['submit_label', 'success_message']);
        });
    }
};
