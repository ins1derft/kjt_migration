import type { QuoteFormBlock } from '@/lib/blocks/types';
import { fetchJson } from '@/lib/api';
import QuoteFormClient, { FormField } from './QuoteForm.client';

type FormConfigResponse = {
  code: string;
  title?: string | null;
  fields: FormField[];
};

export default async function QuoteForm({ title, body, form_code }: QuoteFormBlock['fields']) {
  let config: FormConfigResponse | null = null;

  try {
    config = await fetchJson<FormConfigResponse>(`/forms/${form_code}`, { cache: 'no-store' });
  } catch (error) {
    console.error(`QuoteForm: failed to load form config for ${form_code}`, error);
  }

  const fields = config?.fields ?? [];
  if (!fields.length) return null;

  return (
    <QuoteFormClient
      title={title ?? config?.title ?? undefined}
      body={body}
      form_code={form_code}
      fields={fields}
    />
  );
}
