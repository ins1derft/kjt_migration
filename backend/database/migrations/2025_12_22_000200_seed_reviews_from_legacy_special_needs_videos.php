<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('reviews')->truncate();

        $now = now();

        DB::table('reviews')->insert([
            [
                'name' => 'Saskatchewan',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('A representative from Saskatchewan, Canada conveyed his admiration for our interactive technology and stated the importance of education in rural areas.') . '</p>',
                'avatar' => null,
                'video_id' => '55Inc96meUc',
                'source_url' => 'https://www.youtube.com/watch?v=55Inc96meUc',
                'position' => 0,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'An executive director from West Virginia',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('An executive director from West Virginia expressed her enthusiasm and eagerness for a collaboration and the utilization of these products in her county.') . '</p>',
                'avatar' => null,
                'video_id' => 'hJMS1RMi0ts',
                'source_url' => 'https://www.youtube.com/watch?v=hJMS1RMi0ts',
                'position' => 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'One principle from Greenville',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('One principle from Greenville, TN demonstrates why Kids Jump Tech often conducts business with schools. In support of all children\'s education and overall well-being, we are committed to provide the best service for you and your students.') . '</p>',
                'avatar' => null,
                'video_id' => 'CnYvuoOPVuU',
                'source_url' => 'https://www.youtube.com/watch?v=CnYvuoOPVuU',
                'position' => 2,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Review',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('Made for a wide range of abilities and age groups, our interactive technology can do more than just display vibrant colors and digital animals; It provides the perfect hands-on activities for all students.') . '</p>',
                'avatar' => null,
                'video_id' => 'ZfaLgAP2RAg',
                'source_url' => 'https://www.youtube.com/watch?v=ZfaLgAP2RAg',
                'position' => 3,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Review',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('Whether it\'s your standard classroom setting or your own living room, our products encourage physical activity and learning.') . '</p>',
                'avatar' => null,
                'video_id' => 'CJpDKnG99Sg',
                'source_url' => 'https://www.youtube.com/watch?v=CJpDKnG99Sg',
                'position' => 4,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Review',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('Often used for indoor recess or a quick brain break, this technology is sure to be the most memorable part of the day. With the games and activities we provide, you will soon be known as ‘the cool teacher') . '</p>',
                'avatar' => null,
                'video_id' => '0xq3xc2cr_k',
                'source_url' => 'https://www.youtube.com/watch?v=0xq3xc2cr_k',
                'position' => 5,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Review',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('A principal from the FETC conference stopped by our booth and conveyed his initial impression of our interactive technology.') . '</p>',
                'avatar' => null,
                'video_id' => 'C-2TTWu7y7k',
                'source_url' => 'https://www.youtube.com/watch?v=C-2TTWu7y7k',
                'position' => 6,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Review',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('Using advanced technology, Kids Jump Tech’s AR sandbox ensures all students, including those with special needs, can enjoy learning and have fun.') . '</p>',
                'avatar' => null,
                'video_id' => 'XYwEtLFb5So',
                'source_url' => 'https://www.youtube.com/watch?v=XYwEtLFb5So',
                'position' => 7,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Review',
                'review_date' => null,
                'rating' => 5,
                'text' => '<p>' . e('With a world so absorbed with touch screens, kinesthetic engagement for children is often neglected. With our interactive products, students can now bring their artwork to life and learn through movement.') . '</p>',
                'avatar' => null,
                'video_id' => 'YAa0yvKFl9A',
                'source_url' => 'https://www.youtube.com/watch?v=YAa0yvKFl9A',
                'position' => 8,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('reviews')
            ->whereIn('video_id', [
                '55Inc96meUc',
                'hJMS1RMi0ts',
                'CnYvuoOPVuU',
                'ZfaLgAP2RAg',
                'CJpDKnG99Sg',
                '0xq3xc2cr_k',
                'C-2TTWu7y7k',
                'XYwEtLFb5So',
                'YAa0yvKFl9A',
            ])
            ->delete();
    }
};

