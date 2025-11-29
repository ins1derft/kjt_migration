'use client';

import { useMemo, useState, type FormEvent } from 'react';
import type { QuoteFormBlock } from '@/lib/blocks/types';
import { apiUrl } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'loading' | 'success' | 'error';

export type FormField =
  | { name: string; label?: string; type?: 'text' | 'email' | 'phone'; required?: boolean }
  | { name: string; label?: string; type: 'textarea'; required?: boolean }
  | { name: string; label?: string; type: 'select'; options?: Record<string, string>; required?: boolean }
  | { name: string; label?: string; type: 'checkbox'; required?: boolean; options?: Record<string, string> };

export type QuoteFormClientProps = QuoteFormBlock['fields'] & {
  fields: FormField[];
};

export default function QuoteFormClient({ title, body, form_code, fields }: QuoteFormClientProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const utm = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const searchParams = new URLSearchParams(window.location.search);
    const entries: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_')) entries[key] = value;
    });
    return Object.keys(entries).length ? entries : undefined;
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: Record<string, unknown> = {
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      utm,
    };

    fields.forEach((field) => {
      if (field.type === 'checkbox' && field.options) {
        payload[field.name] = formData.getAll(field.name);
        return;
      }
      const value = formData.get(field.name);
      if (field.type === 'checkbox') {
        payload[field.name] = Boolean(value);
      } else {
        payload[field.name] = value ?? '';
      }
    });

    try {
      const res = await fetch(apiUrl(`/forms/${form_code}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      setStatus('success');
      form.reset();
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  if (!fields.length) return null;

  return (
    <section className="section-shell">
      <Card className="max-w-3xl">
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {body && <p className="text-sm text-muted-foreground">{body}</p>}
        </CardHeader>
        <CardContent>
          <form className="grid gap-3" onSubmit={onSubmit}>
            {fields.map((field) => {
              const label = field.label ?? field.name;
              const required = Boolean(field.required);
              const commonLabel = (
                <label className="text-sm font-semibold text-foreground" htmlFor={field.name}>
                  {label}
                  {required && <span className="text-red-600"> *</span>}
                </label>
              );

              switch (field.type) {
                case 'textarea':
                  return (
                    <div key={field.name} className="space-y-1">
                      {commonLabel}
                      <Textarea id={field.name} name={field.name} required={required} placeholder={label} rows={4} />
                    </div>
                  );
                case 'select':
                  return (
                    <div key={field.name} className="space-y-1">
                      {commonLabel}
                      <select
                        id={field.name}
                        name={field.name}
                        required={required}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select {label.toLowerCase()}
                        </option>
                        {field.options &&
                          Object.entries(field.options).map(([value, text]) => (
                            <option key={value} value={value}>
                              {text}
                            </option>
                          ))}
                      </select>
                    </div>
                  );
                case 'checkbox':
                  if (field.options) {
                    return (
                      <div key={field.name} className="space-y-2">
                        {commonLabel}
                        <div className="grid gap-2 sm:grid-cols-2">
                          {Object.entries(field.options).map(([value, text]) => (
                            <label key={value} className="inline-flex items-center gap-2 text-sm text-foreground">
                              <input
                                type="checkbox"
                                name={field.name}
                                value={value}
                                className="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
                              {text}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <label key={field.name} className="inline-flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        name={field.name}
                        className="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      {label}
                    </label>
                  );
                default:
                  return (
                    <div key={field.name} className="space-y-1">
                      {commonLabel}
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                        required={required}
                        placeholder={label}
                        autoComplete={field.type === 'email' ? 'email' : 'on'}
                      />
                    </div>
                  );
              }
            })}

            <div className={cn('flex items-center gap-3 flex-wrap')}>
              <Button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send request'}
              </Button>
              {status === 'success' && (
                <span className="text-sm text-green-600">Thanks! We will get back to you shortly.</span>
              )}
              {status === 'error' && <span className="text-sm text-destructive">{error}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
