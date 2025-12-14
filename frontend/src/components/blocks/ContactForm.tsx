'use client';

import React, { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { apiUrl, getForm, type FormConfig, type FormField } from '@/lib/api';
import { cn } from '@/lib/utils';
import RichText from '../RichText';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

type Status = 'idle' | 'loading' | 'ready' | 'submitting' | 'success' | 'error';

export type ContactFormProps = {
  title?: string | null;
  description?: string | null;
  formCode?: string | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
  formConfig?: FormConfig | null;
};

const defaultDisclaimer =
  'By submitting this form, I agree to the Terms And Condition and Privacy Policy. And I agree to opt-in to receive all calls, text messages and emails received from High Project Group Incorporated and all associating companies: Kids Jump Tech and Smart & Active. You may opt-out by replying "STOP" at any time. Message and data rates may apply.';

const OptionBox = ({
  label,
  name,
  value,
  rounded = false,
}: {
  label: string;
  name: string;
  value?: string;
  rounded?: boolean;
}) => (
  <label className="group flex cursor-pointer items-center gap-[12px] select-none">
    <input type="checkbox" name={name} value={value ?? 'yes'} className="peer sr-only" />
    <span
      className={cn(
        'flex h-[35px] w-[35px] items-center justify-center border border-[#C6CBDF] bg-white transition-colors duration-200',
        rounded ? 'rounded-full' : 'rounded-[5px]',
        'peer-checked:border-brand-sky peer-checked:bg-brand-sky peer-focus-visible:ring-2 peer-focus-visible:ring-form-ring group-hover:border-form-focus',
        'peer-checked:[&>svg]:opacity-100'
      )}
    >
      <Check
        size={18}
        strokeWidth={3}
        color="#ffffff"
        className="opacity-0"
      />
    </span>
    <span className="font-heading text-[16px] font-bold leading-[1.4] text-table-text">{label}</span>
  </label>
);

const StatusBanner = ({
  variant,
  message,
}: {
  variant: 'success' | 'error';
  message: string;
}) => {
  const isSuccess = variant === 'success';

  return (
    <div
      className={cn(
        'lg:col-span-3 flex items-start gap-3 rounded-[10px] border px-4 py-3 text-[14px] font-semibold',
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-red-200 bg-red-50 text-red-900'
      )}
    >
      {isSuccess ? (
        <Check className="mt-0.5 h-5 w-5" strokeWidth={3} />
      ) : (
        <X className="mt-0.5 h-5 w-5" strokeWidth={3} />
      )}
      <span className="leading-[1.45]">{message}</span>
    </div>
  );
};

const ContactForm: React.FC<ContactFormProps> = ({
  title,
  description,
  formCode,
  padding,
  backgroundClass,
  backgroundColor,
  formConfig,
}) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resolvedTitle, setResolvedTitle] = useState<string>(title ?? '');
  const [resolvedSubmitLabel, setResolvedSubmitLabel] = useState<string>('Submit');
  const [successMessage, setSuccessMessage] = useState<string>('Thank you! We will contact you shortly.');
  const [phoneValues, setPhoneValues] = useState<Record<string, string | undefined>>({});

  const hasCustomPadding = Boolean(
    (typeof padding === 'string' && padding.trim()) ||
      (padding && typeof padding === 'object' && ('top' in padding || 'bottom' in padding))
  );

  const sectionPadding = resolveSectionPadding(
    padding,
    hasCustomPadding
      ? ''
      : 'pt-[90px] pb-[110px] md:pt-[96px] md:pb-[130px] xl:pt-[110px] xl:pb-[150px]'
  );
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-white');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const utm = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const searchParams = new URLSearchParams(window.location.search);
    const entries: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_')) entries[key] = value;
    });
    return Object.keys(entries).length ? entries : undefined;
  }, []);

  useEffect(() => {
    const effectiveCode = formCode ?? formConfig?.code ?? null;
    const defaultSuccess = 'Thank you! We will contact you shortly.';

    if (!effectiveCode) {
      setStatus('error');
      setError('The form is not linked to this page.');
      setFields([]);
      return;
    }

    setResolvedTitle(title ?? formConfig?.title ?? '');
    setResolvedSubmitLabel(formConfig?.submit_label ?? 'Submit');
    setSuccessMessage(formConfig?.success_message ?? defaultSuccess);

    const configFields = formConfig?.fields ?? [];
    if (configFields.length > 0) {
      setFields(configFields);
      setStatus('ready');
      setError(null);
      return;
    }

    let cancelled = false;
    const loadConfig = async () => {
      try {
        setStatus('loading');
        const remote = await getForm(effectiveCode, { fields: [] });
        if (cancelled) return;

        const fetched = remote?.fields ?? [];
        setResolvedTitle(title ?? remote?.title ?? '');
        setResolvedSubmitLabel(remote?.submit_label ?? 'Submit');
        setSuccessMessage(remote?.success_message ?? defaultSuccess);

        if (!fetched.length) {
          setStatus('error');
          setError('Form configuration is missing.');
          setFields([]);
          return;
        }

        setFields(fetched);
        setStatus('ready');
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load form config', err);
        setStatus('error');
        setError('Form configuration is missing.');
        setFields([]);
      } finally {
        if (!cancelled) {
          setStatus('ready');
        }
      }
    };

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [formCode, formConfig, title]);

  useEffect(() => {
    if (status !== 'success') return;
    const timeout = setTimeout(() => setStatus('ready'), 3600);
    return () => clearTimeout(timeout);
  }, [status]);

  const effectiveFormCode = formCode ?? formConfig?.code ?? null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!effectiveFormCode) {
      setStatus('error');
      setError('The form is not available for submission.');
      return;
    }

    setStatus('submitting');
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const topicValue = title ?? formConfig?.title ?? resolvedTitle ?? '';

    const payload: Record<string, unknown> = {
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      utm,
      topic: topicValue,
    };

    fields.forEach((field) => {
      if (field.type === 'phone') {
        payload[field.name] = phoneValues[field.name] ?? '';
        return;
      }

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
      const res = await fetch(apiUrl(`/forms/${effectiveFormCode}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Form submit failed', text || res.status);
        throw new Error('We could not submit the form. Please try again.');
      }

      setStatus('success');
      formEl.reset();
      setPhoneValues({});
    } catch (e) {
      console.error(e);
      setStatus('error');
      setError('Something went wrong. Please try again later.');
    }
  };

  const renderField = (field: FormField) => {
    const label = field.label ?? field.name;
    const required = Boolean(field.required);
    const placeholder = required ? `${label}*` : label;
    const baseLabelClass = 'font-heading text-[18px] font-extrabold leading-[1.4] text-brand-dark';
    const inputClass =
      'h-[50px] w-full rounded-[5px] border border-[#C6CBDF] bg-white px-[16px] text-[16px] font-heading font-medium leading-[1.4] text-brand-dark placeholder:text-table-text/50 placeholder:font-medium focus:border-form-focus focus:outline-none focus:ring-[3px] focus:ring-form-ring';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="lg:col-span-3 flex flex-col gap-[10px]">
            <span className={baseLabelClass}>{label}</span>
            <textarea
              name={field.name}
              rows={4}
              required={required}
              placeholder={placeholder}
              className={cn(
                'min-h-[100px] resize-none rounded-[5px] border border-[#C6CBDF] bg-white px-[16px] py-[12px]',
                'text-[16px] font-heading font-medium leading-[1.4] text-brand-dark placeholder:text-table-text/50 placeholder:font-medium focus:border-form-focus focus:outline-none focus:ring-[3px] focus:ring-form-ring'
              )}
            />
          </div>
        );
      case 'select':
        return (
          <div key={field.name} className="lg:col-span-3 flex flex-col gap-[10px]">
            <span className={baseLabelClass}>{label}</span>
            <div className="relative">
              <select
                name={field.name}
                required={required}
                defaultValue=""
              className={cn(
                inputClass,
                'appearance-none pr-12 text-[16px] font-heading font-medium leading-[1.4]'
              )}
            >
                <option value="" disabled>
                  {placeholder}
                </option>
                {field.options &&
                  Object.entries(field.options).map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-table-text/70" />
            </div>
          </div>
        );
      case 'checkbox':
        if (field.options) {
    const optionEntries = Object.entries(field.options);
    const useRounded = optionEntries.length <= 3;
    return (
      <div key={field.name} className="lg:col-span-3 flex flex-col gap-[12px]">
        <span className={baseLabelClass}>{label}</span>
              <div
                className={cn(
                  'grid gap-y-[14px]',
                  'md:grid-cols-2 md:gap-x-[24px]',
                  'lg:grid-cols-3',
                  'xl:grid-cols-4 xl:gap-x-[32px]'
                )}
              >
                {optionEntries.map(([value, text]) => (
                  <OptionBox key={value} label={text} name={field.name} value={value} rounded={useRounded} />
                ))}
              </div>
            </div>
          );
        }

        return (
      <div key={field.name} className="lg:col-span-1 flex flex-col gap-[10px]">
        <span className={baseLabelClass}>{label}</span>
        <OptionBox label={label} name={field.name} value="yes" />
      </div>
    );
      case 'phone':
        return (
          <div key={field.name} className="lg:col-span-1 flex flex-col gap-[10px]">
            <span className={baseLabelClass}>{label}</span>
            <PhoneInput
              international
              defaultCountry="US"
              name={field.name}
              placeholder={placeholder}
              autoComplete="tel"
              required={required}
              value={phoneValues[field.name]}
              onChange={(value) =>
                setPhoneValues((prev) => ({
                  ...prev,
                  [field.name]: value ?? '',
                }))
              }
              className="phone-input-compact"
              countrySelectProps={{ 'aria-label': 'Country code' }}
            />
          </div>
        );
      default:
        return (
          <div key={field.name} className="lg:col-span-1 flex flex-col gap-[10px]">
            <span className={baseLabelClass}>{label}</span>
            <input
              name={field.name}
              required={required}
              type={field.type === 'email' ? 'email' : 'text'}
              placeholder={placeholder}
              autoComplete={field.type === 'email' ? 'email' : 'on'}
              className={inputClass}
            />
          </div>
        );
    }
  };

  const hasTextHeader = Boolean(title || description);

  return (
    <section className={cn(sectionPadding, sectionBg)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 md:px-6 2xl:px-0">
        {hasTextHeader ? (
          <div className="w-full max-w-[974px]">
            {title ? (
              <h2 className="font-heading font-bold text-brand-dark text-[38px] leading-none md:text-[44px]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <RichText
                html={description}
                className="mt-[12px] font-sans text-[16px] leading-[22.4px] text-brand-dark/70 md:text-[20px] md:leading-[28px] prose-p:my-0 prose-ul:my-0 prose-ol:my-0"
              />
            ) : null}
          </div>
        ) : null}

        <div className={cn('mt-[30px] md:mt-[32px]', hasTextHeader ? '' : 'mt-0')}>
          <div className="w-full rounded-[10px] bg-brand-gray px-[15px] py-[24px] shadow-[0px_2px_20.6px_rgba(0,0,0,0.05)] md:px-[30px] md:py-[30px]">
            {status === 'loading' && (
              <p className="text-[14px] text-brand-dark/70">Loading the form...</p>
            )}

            {status !== 'loading' && fields.length === 0 && (
              <p className="text-[14px] text-brand-dark/70">
                {error ?? 'The form will be available soon. Please try reloading the page.'}
              </p>
            )}

            {fields.length > 0 && (
              <form
                className="grid grid-cols-1 gap-y-[24px] md:gap-y-[28px] lg:grid-cols-3 lg:gap-x-[24px] xl:gap-x-[75px]"
                onSubmit={handleSubmit}
              >
                {status === 'success' && successMessage && (
                  <StatusBanner variant="success" message={successMessage} />
                )}

                {status === 'error' && error && <StatusBanner variant="error" message={error} />}

                {fields.map((field) => renderField(field))}

                {(formConfig?.disclaimer ?? defaultDisclaimer) && (
                  <RichText
                    html={formConfig?.disclaimer ?? defaultDisclaimer}
                    className="lg:col-span-3 text-left text-[16px] leading-[1.6] text-brand-dark/70 [&_a]:underline [&_a]:text-brand-dark prose-p:my-[6px]"
                  />
                )}

                <div className="lg:col-span-3 mt-[10px] flex">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={cn(
                      'flex h-[53px] min-w-[158px] items-center justify-center rounded-[100px] bg-brand-dark px-[32px] font-heading text-[16px] font-bold text-white leading-none transition-opacity duration-150',
                      status === 'submitting' ? 'opacity-70' : 'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30'
                    )}
                  >
                    {status === 'submitting' ? 'Sending…' : resolvedSubmitLabel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
