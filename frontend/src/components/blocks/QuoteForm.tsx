'use client';

import { useState, type FormEvent } from 'react';
import styles from './blocks.module.css';
import type { QuoteFormBlock } from '@/lib/blocks/types';
import { apiBase } from '@/lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function QuoteForm({ title, body, form_code }: QuoteFormBlock['fields']) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: formData.get('name') ?? '',
      email: formData.get('email') ?? '',
      message: formData.get('message') ?? '',
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    try {
      const res = await fetch(`${apiBase}/forms/${form_code}`, {
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
      event.currentTarget.reset();
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.formCard}>
        {title && <h3>{title}</h3>}
        {body && <p>{body}</p>}

        <form className={styles.formGrid} onSubmit={onSubmit}>
          <input
            className={styles.input}
            name="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
          />
          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder="Your email"
            autoComplete="email"
            required
          />
          <textarea
            className={styles.textarea}
            name="message"
            placeholder="Project details / questions"
            rows={4}
          />
          <button className={styles.button} type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending…' : 'Send request'}
          </button>
          {status === 'success' && <div className={styles.feedback}>Thanks! We will get back to you shortly.</div>}
          {status === 'error' && <div className={`${styles.feedback} ${styles.error}`}>{error}</div>}
        </form>
      </div>
    </section>
  );
}
