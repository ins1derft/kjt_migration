<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GoogleReviewsTest extends TestCase
{
    public function test_google_reviews_endpoint_returns_normalized_payload(): void
    {
        Http::fake([
            'https://server.onlinereviews.tech/api/v0.0.9/seats/*/reviews/widgets*' => Http::response([
                'avg' => [
                    ['_id' => 'google', 'avg' => 5.0],
                ],
                'count' => 104,
                'cursor' => 'next-cursor',
                'reviews' => [
                    [
                        'id' => 'review-1',
                        'name' => 'Jack Pennoyer',
                        'date' => '2025-02-13T15:34:52',
                        'rating_value' => 5.0,
                        'review_text' => "Line 1\nLine 2",
                        'profile_picture' => 'http://example.com/avatar.jpg',
                        'url' => 'https://maps.google.com/maps?cid=123',
                        'widget_allow' => true,
                    ],
                    [
                        'id' => 'review-2',
                        'name' => '',
                        'date' => '2025-02-13T15:34:52',
                        'rating_value' => 5.0,
                        'review_text' => '',
                        'profile_picture' => null,
                        'url' => null,
                        'widget_allow' => true,
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/google-reviews?limit=12');

        $response->assertOk();
        $response->assertJsonStructure([
            'data',
            'meta' => ['average', 'count', 'cursor', 'source'],
        ]);

        $payload = $response->json();

        $this->assertEquals(5.0, $payload['meta']['average']);
        $this->assertSame(104, $payload['meta']['count']);
        $this->assertSame('next-cursor', $payload['meta']['cursor']);
        $this->assertSame('google', $payload['meta']['source']);

        $this->assertCount(1, $payload['data']);
        $this->assertSame('review-1', $payload['data'][0]['id']);
        $this->assertSame('Jack Pennoyer', $payload['data'][0]['name']);
        $this->assertSame('2025-02-13', $payload['data'][0]['review_date']);
        $this->assertSame('2025-02-13T15:34:52', $payload['data'][0]['date']);
        $this->assertEquals(5.0, $payload['data'][0]['rating']);
        $this->assertSame("Line 1\nLine 2", $payload['data'][0]['text']);
        $this->assertSame('https://example.com/avatar.jpg', $payload['data'][0]['avatar']);
        $this->assertSame('https://maps.google.com/maps?cid=123', $payload['data'][0]['source_url']);
    }
}
