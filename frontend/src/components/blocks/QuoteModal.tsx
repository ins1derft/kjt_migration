'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { apiUrl, type FormConfig, type FormField } from '@/lib/api';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'loading' | 'ready' | 'submitting' | 'success' | 'error';

type ProductData = {
  id?: number | string | null;
  name: string;
  image?: string | null;
  price?: string | number | null;
};

export type QuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductData | null;
  title?: string;
  submitLabel?: string;
  formCode?: string | null;
  formTitle?: string | null;
  formConfig?: FormConfig | null;
};

const CustomCheckbox = ({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value?: string;
}) => (
  <label className="group flex cursor-pointer items-center gap-3 select-none">
    <input type="checkbox" name={name} value={value ?? 'yes'} className="peer sr-only" />
    <div
      className={cn(
        'flex h-[24px] w-[24px] items-center justify-center rounded-[4px] border-2 transition-all duration-200',
        'border-form-checkbox bg-white peer-checked:border-form-success peer-checked:bg-form-success group-hover:border-form-focus'
      )}
    >
      <Check
        size={16}
        strokeWidth={4}
        color="white"
        className="text-white"
      />
    </div>
    <span className="font-sans text-[16px] font-semibold text-form-text">{label}</span>
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
        'flex items-start gap-3 rounded-[10px] border px-4 py-3 text-[14px] font-semibold',
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

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  product,
  title = 'Get a quote',
  submitLabel = 'Get a Quote',
  formCode,
  formTitle,
  formConfig,
}) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resolvedTitle, setResolvedTitle] = useState<string>(formTitle ?? title);
  const [resolvedSubmitLabel, setResolvedSubmitLabel] = useState<string>(submitLabel);
  const [successMessage, setSuccessMessage] = useState<string>('Thank you! We will contact you shortly.');
  const [phoneValues, setPhoneValues] = useState<Record<string, string | undefined>>({});

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

    if (!isOpen) {
      setStatus('idle');
      setError(null);
      return;
    }

    const configFields = formConfig?.fields ?? [];
    setResolvedTitle(formTitle ?? formConfig?.title ?? title);
    setResolvedSubmitLabel(formConfig?.submit_label ?? submitLabel);
    setSuccessMessage(formConfig?.success_message ?? defaultSuccess);

    if (!effectiveCode) {
      setFields([]);
      setStatus('error');
      setError('The form is not linked to this page.');
      return;
    }

    if (!configFields.length) {
      setFields([]);
      setStatus('error');
      setError('Form configuration is missing.');
      return;
    }

    setFields(configFields);
    setError(null);
    setStatus('ready');
  }, [formCode, formConfig, formTitle, isOpen, submitLabel, title]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPhoneValues({});
    }
  }, [isOpen]);

  const effectiveFormCode = formCode ?? formConfig?.code ?? null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!effectiveFormCode) {
      setError('The form is not available for submission.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setError(null);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);

    const payload: Record<string, unknown> = {
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      utm,
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

    if (product) {
      payload['product_variant_id'] = product.id ?? null;
      payload['product_variant_name'] = product.name ?? null;
      payload['product_variant_price'] = product.price ?? null;
      payload['product_variant_image'] = product.image ?? null;
    }

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
    } catch (e) {
      console.error(e);
      setStatus('error');
      setError('Something went wrong. Please try again later.');
    }
  };

  if (!isOpen) return null;

  const renderField = (field: FormField) => {
    const label = field.label ?? field.name;
    const required = Boolean(field.required);
    const placeholder = required ? `${label}*` : label;

    switch (field.type) {
      case 'textarea':
        return (
          <label key={field.name} className="flex flex-col gap-2 text-[15px] text-form-text">
            <textarea
              name={field.name}
              rows={4}
              required={required}
              placeholder={placeholder}
              className="w-full resize-none rounded-[6px] border border-form-border bg-form-bg px-4 py-3 text-[16px] text-form-text placeholder-form-placeholder shadow-inner focus:border-form-focus focus:outline-none focus:ring-[3px] focus:ring-form-ring"
            />
          </label>
        );
      case 'select':
        return (
          <div key={field.name} className="flex flex-col gap-2 text-[15px] text-form-text">
            <div className="relative">
              <select
                name={field.name}
                required={required}
                defaultValue=""
                className="h-[56px] w-full appearance-none rounded-[6px] border border-form-border bg-form-bg px-4 text-[16px] text-form-placeholder focus:border-form-focus focus:outline-none focus:ring-[3px] focus:ring-form-ring"
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
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-form-text" />
            </div>
          </div>
        );
      case 'checkbox':
        if (field.options) {
          return (
            <div key={field.name} className="flex flex-col gap-3 text-[15px] text-form-text">
              <span className="font-semibold">{label}</span>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {Object.entries(field.options).map(([value, text]) => (
                  <CustomCheckbox key={value} label={text} name={field.name} value={value} />
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={field.name} className="flex flex-col gap-2 text-[15px] text-form-text">
            <span className="font-semibold">{label}</span>
            <CustomCheckbox label={label} name={field.name} value="yes" />
          </div>
        );
      case 'phone':
        return (
          <label key={field.name} className="flex flex-col gap-2 text-[15px] text-form-text">
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
              className="phone-input"
              countrySelectProps={{ 'aria-label': 'Country code' }}
            />
          </label>
        );
      default:
        return (
          <label key={field.name} className="flex flex-col gap-2 text-[15px] text-form-text">
            <input
              name={field.name}
              required={required}
              type={field.type === 'email' ? 'email' : 'text'}
              placeholder={placeholder}
              autoComplete={field.type === 'email' ? 'email' : 'on'}
              className="h-[56px] w-full rounded-[6px] border border-form-border bg-form-bg px-4 text-[16px] text-form-text placeholder-form-placeholder shadow-inner focus:border-form-focus focus:outline-none focus:ring-[3px] focus:ring-form-ring"
            />
          </label>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/35 backdrop-blur-[2px] p-4 md:items-center">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[520px] rounded-[18px] bg-white shadow-modal overflow-hidden">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 text-form-focus transition-colors hover:text-[#1F3C70]"
        >
          <X size={28} strokeWidth={2} />
        </button>

        <div className="max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-80px)] overflow-y-auto px-6 pb-6 pt-10 md:px-8 md:pb-8 md:pt-12">
          {product ? (
            <div className="mb-8 mt-2 flex items-center gap-6 rounded-[12px] bg-form-bg p-4">
              <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-[8px] border border-form-border bg-white p-2">
                <img src={product.image ?? '/file.svg'} alt={product.name} className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[20px] font-normal leading-[1.3] text-form-text">{product.name}</h3>
                {product.price && (
                  <div className="text-[18px] font-bold text-form-text">
                    {typeof product.price === 'number'
                      ? `$${product.price}`
                      : product.price?.toString().startsWith('$')
                        ? product.price
                        : `$${product.price}`}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-8 mt-4 text-center">
              <h2 className="rounded-[12px] bg-form-bg py-4 font-heading text-[28px] font-bold text-form-text">
                {resolvedTitle}
              </h2>
            </div>
          )}

          {status === 'loading' && (
            <p className="text-sm text-form-text">Loading the form...</p>
          )}

          {status !== 'loading' && fields.length === 0 && (
            <p className="text-sm text-form-text">
              {error ?? 'The form will be available soon. Please try reloading the page.'}
            </p>
          )}

          {fields.length > 0 && (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {status === 'success' && successMessage && (
                <StatusBanner variant="success" message={successMessage} />
              )}

              {status === 'error' && error && <StatusBanner variant="error" message={error} />}

              {fields.map((field) => renderField(field))}

              <div className="text-[12px] leading-[1.6] text-form-text">
                By submitting this form, I agree to the <a href="#" className="text-form-focus hover:underline">Terms And Condition</a> and <a href="#" className="text-form-focus hover:underline">Privacy Policy</a>. And I agree to opt-in to receive all calls, text messages and emails received from High Project Group Incorporated and all associating companies: Kids Jump Tech and Smart & Active.
                <br />
                <br />
                You may opt-out by replying &quot;STOP&quot; at any time. Message and data rates may apply.
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={cn(
                    'min-w-[200px] self-start rounded-[50px] bg-gradient-modal px-[40px] py-[16px] font-heading text-[18px] font-bold text-white shadow-modal-btn transition-all duration-300',
                    status === 'submitting' ? 'opacity-70' : 'hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,77,141,0.35)]'
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
  );
};

export default QuoteModal;
