'use client';

import { useEffect } from 'react';

// Prevent runtime crashes from Performance.measure when start/end marks produce negative durations.
// Observed on draft marketing pages where React dev instrumentation measures "\u200bPage".
export default function PerformanceGuard() {
  useEffect(() => {
    const perf = typeof window !== 'undefined' ? window.performance : undefined;
    if (!perf || typeof perf.measure !== 'function') return;

    const originalMeasure = perf.measure.bind(perf);

    perf.measure = function patchedMeasure(
      name: string,
      startOrOptions?: PerformanceMeasureOptions | string,
      end?: string
    ) {
      try {
        return originalMeasure(name, startOrOptions as PerformanceMeasureOptions | string | undefined, end);
      } catch (error) {
        if (error instanceof Error && error.message.includes('negative time stamp')) {
          // swallow only the known bad measurement; avoid breaking the page
          return undefined;
        }
        throw error;
      }
    } as typeof perf.measure;

    return () => {
      perf.measure = originalMeasure;
    };
  }, []);

  return null;
}
