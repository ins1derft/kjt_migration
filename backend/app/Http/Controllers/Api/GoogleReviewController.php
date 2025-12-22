<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GoogleReviewController extends Controller
{
    public function index(Request $request)
    {
        $apiBase = rtrim((string) config('services.onlinereviews.api_base'), '/');
        $seatId = (string) config('services.onlinereviews.seat_id');

        if ($apiBase === '' || $seatId === '') {
            abort(503, 'Online reviews provider is not configured');
        }

        $limit = (int) $request->query('limit', 12);
        $limit = $limit > 0 ? min($limit, 24) : 12;

        $cursor = $request->query('cursor');
        $cursor = is_string($cursor) && $cursor !== '' ? $cursor : null;

        $cacheKey = 'google_reviews:' . md5(json_encode([
            'seat' => $seatId,
            'limit' => $limit,
            'cursor' => $cursor,
        ]));

        $payload = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($apiBase, $seatId, $limit, $cursor) {
            $query = [
                'review_type' => 'Review,Feedback',
                'limit' => $limit,
            ];

            if ($cursor !== null) {
                $query['cursor'] = $cursor;
            }

            return Http::acceptJson()
                ->timeout(10)
                ->retry(2, 200)
                ->get("{$apiBase}/seats/{$seatId}/reviews/widgets", $query)
                ->throw()
                ->json();
        });

        $avgList = is_array($payload) ? ($payload['avg'] ?? null) : null;
        $average = null;

        if (is_array($avgList)) {
            foreach ($avgList as $avgItem) {
                if (!is_array($avgItem)) continue;
                if (($avgItem['_id'] ?? null) === 'google') {
                    $average = is_numeric($avgItem['avg'] ?? null) ? (float) $avgItem['avg'] : null;
                    break;
                }
            }

            if ($average === null && count($avgList) > 0) {
                $sum = 0.0;
                $count = 0;
                foreach ($avgList as $avgItem) {
                    if (!is_array($avgItem)) continue;
                    if (!is_numeric($avgItem['avg'] ?? null)) continue;
                    $sum += (float) $avgItem['avg'];
                    $count += 1;
                }
                if ($count > 0) {
                    $average = $sum / $count;
                }
            }
        }

        $totalCount = is_array($payload) && is_numeric($payload['count'] ?? null) ? (int) $payload['count'] : 0;
        $nextCursor = is_array($payload) && is_string($payload['cursor'] ?? null) ? (string) $payload['cursor'] : null;

        $rawReviews = is_array($payload) ? ($payload['reviews'] ?? null) : null;
        $reviews = [];

        if (is_array($rawReviews)) {
            foreach ($rawReviews as $review) {
                if (!is_array($review)) continue;
                if (($review['widget_allow'] ?? true) === false) continue;

                $name = trim((string) ($review['name'] ?? ''));
                $text = trim((string) ($review['review_text'] ?? ''));
                if ($name === '' || $text === '') continue;

                $avatar = $review['profile_picture'] ?? null;
                if (is_string($avatar) && str_starts_with($avatar, 'http://')) {
                    $avatar = 'https://' . substr($avatar, strlen('http://'));
                }

                $date = is_string($review['date'] ?? null) ? (string) $review['date'] : null;
                $reviewDate = null;
                if ($date) {
                    $reviewDate = substr($date, 0, 10);
                }

                $reviews[] = [
                    'id' => is_string($review['id'] ?? null) ? $review['id'] : null,
                    'name' => $name,
                    'review_date' => $reviewDate,
                    'date' => $date,
                    'rating' => is_numeric($review['rating_value'] ?? null) ? (float) $review['rating_value'] : 5,
                    'text' => $text,
                    'avatar' => is_string($avatar) ? $avatar : null,
                    'source_url' => is_string($review['url'] ?? null) ? $review['url'] : null,
                ];
            }
        }

        return response()->json([
            'data' => $reviews,
            'meta' => [
                'average' => $average ?? 5.0,
                'count' => $totalCount,
                'cursor' => $nextCursor,
                'source' => 'google',
            ],
        ]);
    }
}

