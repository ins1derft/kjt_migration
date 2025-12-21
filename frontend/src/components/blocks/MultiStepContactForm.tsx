'use client';

import React, { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import { Check, ChevronDown, X } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import { apiUrl, getForm, type FormConfig, type FormField, type FormStep } from '@/lib/api';
import { cn } from '@/lib/utils';
import RichText from '../RichText';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  resolveSectionBackground,
  resolveSectionBackgroundStyle,
  resolveSectionPadding,
  type SectionPadding,
} from '@/lib/blocks/padding';

type Status = 'idle' | 'loading' | 'ready' | 'submitting' | 'success' | 'error';

export type MultiStepContactFormProps = {
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
  defaultChecked,
}: {
  label: string;
  name: string;
  value?: string;
  rounded?: boolean;
  defaultChecked?: boolean;
}) => (
  <label className="group flex cursor-pointer items-center gap-[12px] select-none">
    <input
      type="checkbox"
      name={name}
      value={value ?? 'yes'}
      defaultChecked={defaultChecked}
      className="peer sr-only"
    />
    <span
      className={cn(
        'flex h-[35px] w-[35px] items-center justify-center border border-[#C6CBDF] bg-white transition-colors duration-200',
        rounded ? 'rounded-full' : 'rounded-[5px]',
        'peer-checked:border-brand-sky peer-checked:bg-brand-sky peer-focus-visible:ring-2 peer-focus-visible:ring-form-ring group-hover:border-form-focus',
        'peer-checked:[&>svg]:opacity-100'
      )}
    >
      <Check size={18} strokeWidth={3} color="#ffffff" className="opacity-0" />
    </span>
    <span className="font-heading text-[16px] font-bold leading-[1.4] text-table-text">{label}</span>
  </label>
);

const RadioOption = ({
  label,
  name,
  value,
  required = false,
  defaultChecked,
}: {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  defaultChecked?: boolean;
}) => (
  <label className="group flex cursor-pointer items-center gap-[12px] select-none">
    <input
      type="radio"
      name={name}
      value={value ?? 'yes'}
      required={required}
      defaultChecked={defaultChecked}
      className="peer sr-only"
    />
    <span
      className={cn(
        'flex h-[35px] w-[35px] items-center justify-center rounded-full border border-[#C6CBDF] bg-white transition-colors duration-200',
        'peer-checked:border-brand-sky peer-focus-visible:ring-2 peer-focus-visible:ring-form-ring group-hover:border-form-focus',
        'peer-checked:[&>span]:opacity-100'
      )}
    >
      <span className="h-[12px] w-[12px] rounded-full bg-brand-sky opacity-0 transition-opacity duration-200" />
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

const normalizeFields = (raw: unknown): FormField[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter((field) => typeof field === 'object' && field && 'name' in field) as FormField[];
};

const normalizeSteps = (raw: unknown): FormStep[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((step) => {
      if (!step || typeof step !== 'object') return null;
      const value = step as Record<string, unknown>;
      const fields = normalizeFields(value.fields);
      const title = typeof value.title === 'string' ? value.title : null;
      if (!fields.length && !title) return null;
      return {
        title,
        next_label: typeof value.next_label === 'string' ? value.next_label : null,
        prev_label: typeof value.prev_label === 'string' ? value.prev_label : null,
        fields,
      } as FormStep;
    })
    .filter(Boolean) as FormStep[];
};

const formatStepTitle = (title: string, stepIndex: number) => {
  const trimmed = title.trim();
  if (!trimmed) return '';
  if (/^\d+\./.test(trimmed)) return trimmed;
  return `${stepIndex + 1}. ${trimmed}`;
};

const MultiStepContactForm: React.FC<MultiStepContactFormProps> = ({
  formCode,
  padding,
  backgroundClass,
  backgroundColor,
  formConfig,
}) => {
  const [steps, setSteps] = useState<FormStep[]>([]);
  const [standaloneFields, setStandaloneFields] = useState<FormField[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resolvedTitle, setResolvedTitle] = useState<string>('');
  const [resolvedSubmitLabel, setResolvedSubmitLabel] = useState<string>('Submit');
  const [successMessage, setSuccessMessage] = useState<string>('Thank you! We will contact you shortly.');
  const [phoneValues, setPhoneValues] = useState<Record<string, string | undefined>>({});
  const [dateValues, setDateValues] = useState<Record<string, Date | undefined>>({});
  const [datePickerOpen, setDatePickerOpen] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [savedValues, setSavedValues] = useState<Record<string, FormDataEntryValue | boolean | string[] | null>>({});
  const [fileValues, setFileValues] = useState<Record<string, File | null>>({});
  const formRef = useRef<HTMLFormElement | null>(null);
  const isStepTransitioning = useRef(false);

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
  const sectionBg = resolveSectionBackground(backgroundClass, 'bg-brand-gray');
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
      setSteps([]);
      setStandaloneFields([]);
      return;
    }

    setResolvedTitle(formConfig?.title ?? '');
    setResolvedSubmitLabel(formConfig?.submit_label ?? 'Submit');
    setSuccessMessage(formConfig?.success_message ?? defaultSuccess);

    const configSteps = normalizeSteps(formConfig?.steps ?? []);
    const configFields = normalizeFields(formConfig?.fields ?? []);

    if (configSteps.length) {
      setSteps(configSteps);
      setStandaloneFields(configFields.length ? configFields : configSteps.flatMap((step) => step.fields));
      setStatus('ready');
      setError(null);
      setCurrentStep(0);
      return;
    }

    if (configFields.length) {
      setSteps([{ title: formConfig?.title ?? null, fields: configFields }]);
      setStandaloneFields(configFields);
      setStatus('ready');
      setError(null);
      setCurrentStep(0);
      return;
    }

    let cancelled = false;
    const loadConfig = async () => {
      try {
        setStatus('loading');
        const remote = await getForm(effectiveCode, { fields: [] });
        if (cancelled) return;

        const fetchedSteps = normalizeSteps(remote?.steps ?? []);
        const fetchedFields = normalizeFields(remote?.fields ?? []);

        setResolvedTitle(remote?.title ?? '');
        setResolvedSubmitLabel(remote?.submit_label ?? 'Submit');
        setSuccessMessage(remote?.success_message ?? defaultSuccess);

        if (fetchedSteps.length) {
          setSteps(fetchedSteps);
          setStandaloneFields(fetchedFields.length ? fetchedFields : fetchedSteps.flatMap((step) => step.fields));
          setStatus('ready');
          setError(null);
          setCurrentStep(0);
          return;
        }

        if (!fetchedFields.length) {
          setStatus('error');
          setError('Form configuration is missing.');
          setSteps([]);
          setStandaloneFields([]);
          return;
        }

        setSteps([{ title: remote?.title ?? null, fields: fetchedFields }]);
        setStandaloneFields(fetchedFields);
        setStatus('ready');
        setError(null);
        setCurrentStep(0);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load form config', err);
        setStatus('error');
        setError('Form configuration is missing.');
        setSteps([]);
        setStandaloneFields([]);
      }
    };

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [formCode, formConfig]);

  useEffect(() => {
    if (status !== 'success') return;
    const timeout = setTimeout(() => setStatus('ready'), 3600);
    return () => clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    if (currentStep < steps.length) return;
    setCurrentStep(0);
  }, [currentStep, steps.length]);

  useEffect(() => {
    isStepTransitioning.current = false;
  }, [currentStep]);

  const effectiveFormCode = formCode ?? formConfig?.code ?? null;
  const resolvedSteps = useMemo(() => {
    if (steps.length) return steps;
    if (standaloneFields.length) {
      return [{ title: resolvedTitle || null, fields: standaloneFields }] as FormStep[];
    }
    return [] as FormStep[];
  }, [steps, standaloneFields, resolvedTitle]);
  const totalSteps = resolvedSteps.length;
  const activeStep = resolvedSteps[Math.min(currentStep, Math.max(totalSteps - 1, 0))];
  const activeFields = activeStep?.fields ?? [];
  const allFields = useMemo(() => resolvedSteps.flatMap((step) => step.fields), [resolvedSteps]);
  const hasFileFields = useMemo(() => allFields.some((field) => field.type === 'file'), [allFields]);

  const progressPercent = totalSteps > 0 ? Math.min(100, ((currentStep + 1) / totalSteps) * 100) : 0;
  const stepTitle = activeStep?.title ? formatStepTitle(activeStep.title, currentStep) : '';
  const showProgress = totalSteps > 1;

  const persistStepValues = (formEl: HTMLFormElement, stepFields: FormField[]) => {
    const formData = new FormData(formEl);

    setSavedValues((prev) => {
      const next = { ...prev };

      stepFields.forEach((field) => {
        if (field.type === 'phone') {
          next[field.name] = phoneValues[field.name] ?? '';
          return;
        }

        if (field.type === 'date') {
          next[field.name] = dateValues[field.name] ? format(dateValues[field.name] as Date, 'yyyy-MM-dd') : null;
          return;
        }

        if (field.type === 'checkbox' && field.options) {
          next[field.name] = formData.getAll(field.name).map((entry) => String(entry));
          return;
        }

        const value = formData.get(field.name);

        if (field.type === 'checkbox') {
          next[field.name] = Boolean(value);
          return;
        }

        next[field.name] = value ?? '';
      });

      return next;
    });

    setFileValues((prev) => {
      const next = { ...prev };
      stepFields.forEach((field) => {
        if (field.type !== 'file') return;
        const file = formData.get(field.name);
        if (file instanceof File && file.size > 0) {
          next[field.name] = file;
        }
      });
      return next;
    });
  };

  const handleNext = () => {
    const formEl = formRef.current;
    if (!formEl) return;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }
    persistStepValues(formEl, activeFields);
    isStepTransitioning.current = true;
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    const formEl = formRef.current;
    if (formEl) {
      persistStepValues(formEl, activeFields);
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < totalSteps - 1) {
      return;
    }

    if (isStepTransitioning.current) {
      isStepTransitioning.current = false;
      return;
    }

    if (!effectiveFormCode) {
      setStatus('error');
      setError('The form is not available for submission.');
      return;
    }

    const formEl = event.currentTarget;
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    persistStepValues(formEl, activeFields);

    setStatus('submitting');
    setError(null);

    const topicValue = resolvedTitle || formConfig?.title || '';

    const payload: Record<string, unknown> = {
      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      utm,
      topic: topicValue,
    };

    const baseFormData = new FormData(formEl);

    allFields.forEach((field) => {
      const saved = savedValues[field.name];

      if (field.type === 'phone') {
        const storedValue = phoneValues[field.name];
        const rawValue = baseFormData.get(field.name);
        const fallbackValue = typeof rawValue === 'string' ? rawValue : '';
        const resolvedValue =
          typeof storedValue === 'string' && storedValue.trim().length > 0
            ? storedValue
            : fallbackValue;
        payload[field.name] = resolvedValue;
        return;
      }

      if (field.type === 'date') {
        const selectedDate = dateValues[field.name];
        payload[field.name] = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : saved ?? null;
        return;
      }

      if (field.type === 'checkbox' && field.options) {
        const checkboxValues = Array.isArray(saved) ? saved : baseFormData.getAll(field.name);
        payload[field.name] = checkboxValues;
        return;
      }

      if (field.type === 'checkbox') {
        payload[field.name] = typeof saved === 'boolean' ? saved : Boolean(baseFormData.get(field.name));
        return;
      }

      const value = saved ?? baseFormData.get(field.name) ?? '';
      payload[field.name] = value;
    });

    try {
      const headers = new Headers({ Accept: 'application/json' });
      let body: BodyInit;

      if (!hasFileFields) {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(payload);
      } else {
        const data = new FormData();
        if (payload.source_url) data.append('source_url', String(payload.source_url));
        if (payload.topic) data.append('topic', String(payload.topic));
        if (utm) {
          Object.entries(utm).forEach(([key, value]) => {
            data.append(`utm[${key}]`, value);
          });
        }

        allFields.forEach((field) => {
          const name = field.name;
          const saved = savedValues[name];

          if (field.type === 'phone') {
            const storedValue = phoneValues[name];
            const rawValue = baseFormData.get(name);
            const fallbackValue = typeof rawValue === 'string' ? rawValue : '';
            const resolvedValue =
              typeof storedValue === 'string' && storedValue.trim().length > 0
                ? storedValue
                : fallbackValue;
            data.append(name, resolvedValue);
            return;
          }

          if (field.type === 'date') {
            const selectedDate = dateValues[name];
            const fallback = typeof saved === 'string' ? saved : '';
            data.append(name, selectedDate ? format(selectedDate, 'yyyy-MM-dd') : fallback);
            return;
          }

          if (field.type === 'checkbox' && field.options) {
            const values = Array.isArray(saved)
              ? saved
              : baseFormData.getAll(name).map((entry) => String(entry));
            values.forEach((value) => data.append(`${name}[]`, value));
            return;
          }

          if (field.type === 'checkbox') {
            const checked =
              typeof saved === 'boolean' ? saved : Boolean(baseFormData.get(name));
            data.append(name, checked ? '1' : '0');
            return;
          }

          if (field.type === 'file') {
            const currentFile = baseFormData.get(name);
            const fallbackFile = fileValues[name];
            const resolvedFile =
              currentFile instanceof File && currentFile.size > 0 ? currentFile : fallbackFile;
            if (resolvedFile instanceof File && resolvedFile.size > 0) {
              data.append(name, resolvedFile);
            }
            return;
          }

          const value = saved ?? baseFormData.get(name) ?? '';
          data.append(name, value ? String(value) : '');
        });

        body = data;
      }

      const res = await fetch(apiUrl(`/forms/${effectiveFormCode}`), {
        method: 'POST',
        headers,
        body,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Form submit failed', text || res.status);
        throw new Error('We could not submit the form. Please try again.');
      }

      setStatus('success');
      formEl.reset();
      setSavedValues({});
      setFileValues({});
      setPhoneValues({});
      setDateValues({});
      setDatePickerOpen({});
      setCurrentStep(0);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setError('Something went wrong. Please try again later.');
    }
  };

  const renderField = (field: FormField) => {
    const label = field.label ?? field.name;
    const required = Boolean(field.required);
    const placeholder = field.placeholder ?? (required ? `${label}*` : label);
    const baseLabelClass = 'font-heading text-[18px] font-extrabold leading-[1.4] text-brand-dark';
    const alignedLabelClass =
      field.type === 'text' ||
      field.type === 'email' ||
      field.type === 'phone' ||
      field.type === 'date' ||
      field.type === 'select'
        ? 'flex min-h-[50px] items-end'
        : 'flex items-center';
    const inputClass =
      'h-[50px] w-full rounded-[5px] border border-[#C6CBDF] bg-brand-gray px-[16px] text-[16px] font-heading font-bold leading-[1.4] text-brand-dark placeholder:text-table-text/50 placeholder:font-bold focus:border-form-focus focus:outline-none focus:ring-[3px] focus:ring-form-ring';
    const isSingleField = activeFields.length === 1;
    const isWideType =
      field.type === 'textarea' ||
      field.type === 'checkbox' ||
      field.type === 'radio' ||
      field.type === 'file';
    const wrapperClass = cn(
      'flex flex-col gap-[10px]',
      isWideType || isSingleField ? 'lg:col-span-3' : 'lg:col-span-1'
    );
    const saved = savedValues[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
            <textarea
              name={field.name}
              rows={4}
              required={required}
              placeholder={placeholder}
              defaultValue={typeof saved === 'string' ? saved : undefined}
              className={cn(
                'min-h-[100px] resize-none rounded-[5px] border border-[#C6CBDF] bg-brand-gray px-[16px] py-[12px]',
                'text-[16px] font-heading font-bold leading-[1.4] text-brand-dark placeholder:text-table-text/50 placeholder:font-bold focus:border-form-focus focus:outline-none focus:ring-[3px] focus:ring-form-ring'
              )}
            />
          </div>
        );
      case 'select':
        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
            <div className="relative">
              <select
                name={field.name}
                required={required}
                defaultValue={typeof saved === 'string' ? saved : ''}
                className={cn(
                  inputClass,
                  'appearance-none pr-12 text-[16px] font-heading font-bold leading-[1.4]'
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
          const selectedValues = Array.isArray(saved) ? saved : [];
          const useRounded = optionEntries.length <= 3;
          return (
            <div key={field.name} className={cn(wrapperClass, 'gap-[12px]')}>
              <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
              <div
                className={cn(
                  'grid gap-y-[14px]',
                  'md:grid-cols-2 md:gap-x-[24px]',
                  'lg:grid-cols-3',
                  'xl:grid-cols-4 xl:gap-x-[32px]'
                )}
              >
                {optionEntries.map(([value, text]) => (
                  <OptionBox
                    key={value}
                    label={text}
                    name={field.name}
                    value={value}
                    rounded={useRounded}
                    defaultChecked={selectedValues.includes(value)}
                  />
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
            <OptionBox
              label={label}
              name={field.name}
              value="yes"
              defaultChecked={Boolean(saved)}
            />
          </div>
        );
      case 'radio':
        if (field.options) {
          const optionEntries = Object.entries(field.options);
          return (
            <div key={field.name} className={cn(wrapperClass, 'gap-[12px]')}>
              <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
              <div className="flex flex-col gap-[12px]">
                {optionEntries.map(([value, text], index) => (
                  <RadioOption
                    key={value}
                    label={text}
                    name={field.name}
                    value={value}
                    required={required && index === 0}
                    defaultChecked={saved === value}
                  />
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
            <RadioOption
              label={label}
              name={field.name}
              value="yes"
              required={required}
              defaultChecked={Boolean(saved)}
            />
          </div>
        );
      case 'phone':
        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
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
      case 'date': {
        const selectedDate = dateValues[field.name];
        const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '';
        const isOpen = datePickerOpen[field.name] ?? false;

        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
            <Popover
              open={isOpen}
              onOpenChange={(nextOpen) =>
                setDatePickerOpen((prev) => ({
                  ...prev,
                  [field.name]: nextOpen,
                }))
              }
            >
              <div className="relative">
                <PopoverTrigger asChild>
                  <input
                    name={field.name}
                    required={required}
                    type="text"
                    readOnly
                    value={displayValue}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={cn(inputClass, 'cursor-pointer pr-12')}
                  />
                </PopoverTrigger>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-table-text/70" />
              </div>
              <PopoverContent
                align="start"
                className="w-auto rounded-[12px] border border-[#C6CBDF] bg-white p-2 shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  required={required}
                  captionLayout="dropdown"
                  initialFocus
                  onSelect={(date: Date | undefined) => {
                    setDateValues((prev) => ({
                      ...prev,
                      [field.name]: date,
                    }));
                    setDatePickerOpen((prev) => ({
                      ...prev,
                      [field.name]: false,
                    }));
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      }
      case 'file': {
        const selectedFile = fileValues[field.name];
        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
            <input
              id={`file-${field.name}`}
              name={field.name}
              required={required}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.jpg,.jpeg,.png,.webp"
              aria-label={label}
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                setFileValues((prev) => ({ ...prev, [field.name]: file }));
              }}
            />
            <label
              htmlFor={`file-${field.name}`}
              className={cn(
                'flex h-[50px] w-full items-center gap-3 rounded-[5px] border border-[#C6CBDF] bg-brand-gray px-3'
              )}
            >
              <span className="rounded-[5px] bg-brand-dark px-4 py-2.5 text-sm font-heading font-bold text-white leading-none transition-opacity duration-150">
                Choose file
              </span>
              <span
                className={cn(
                  'text-base font-heading font-bold leading-[1.4] truncate',
                  selectedFile ? 'text-brand-dark' : 'text-table-text/50'
                )}
              >
                {selectedFile ? selectedFile.name : 'No file selected'}
              </span>
            </label>
          </div>
        );
      }
      default:
        return (
          <div key={field.name} className={wrapperClass}>
            <span className={cn(baseLabelClass, alignedLabelClass)}>{label}</span>
            <input
              name={field.name}
              required={required}
              type={field.type === 'email' ? 'email' : 'text'}
              placeholder={placeholder}
              autoComplete={field.type === 'email' ? 'email' : 'on'}
              defaultValue={typeof saved === 'string' ? saved : undefined}
              className={inputClass}
            />
          </div>
        );
    }
  };

  return (
    <section className={cn(sectionPadding, sectionBg)} style={sectionStyle}>
      <div className="container mx-auto w-full px-5 md:px-6 2xl:px-0 contact-stepper-form">
        {showProgress && (
          <div className="w-full">
            <p className="font-heading text-[20px] leading-[1.4] text-brand-dark/70">
              Step {currentStep + 1} of {totalSteps}
            </p>
            <div className="mt-[6px] h-[15px] w-full rounded-[100px] bg-white">
              <div
                className="h-full rounded-[100px] bg-brand-orange"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {stepTitle ? (
          <h2 className={cn('font-heading font-bold text-brand-dark text-[44px] leading-none', showProgress ? 'mt-[56px]' : '')}>
            {stepTitle}
          </h2>
        ) : null}

        <div className={cn(stepTitle || showProgress ? 'mt-[33px]' : '')}>
          <div className="w-full rounded-[10px] bg-white px-[30px] pt-[25px] pb-[33px] shadow-[0px_2px_20.6px_rgba(0,0,0,0.05)]">
            {status === 'loading' && (
              <p className="text-[14px] text-brand-dark/70">Loading the form...</p>
            )}

            {status !== 'loading' && allFields.length === 0 && (
              <p className="text-[14px] text-brand-dark/70">
                {error ?? 'The form will be available soon. Please try reloading the page.'}
              </p>
            )}

            {allFields.length > 0 && (
              <form
                ref={formRef}
                className="grid grid-cols-1 gap-y-[24px] lg:grid-cols-3 lg:gap-x-[24px] xl:gap-x-[75px]"
                onSubmit={handleSubmit}
                encType={hasFileFields ? 'multipart/form-data' : undefined}
              >
                {status === 'success' && successMessage && (
                  <StatusBanner variant="success" message={successMessage} />
                )}

                {status === 'error' && error && <StatusBanner variant="error" message={error} />}

                {activeFields.map((field) => renderField(field))}

                {(formConfig?.disclaimer ?? defaultDisclaimer) && currentStep === totalSteps - 1 && (
                  <RichText
                    html={formConfig?.disclaimer ?? defaultDisclaimer}
                    className="lg:col-span-3 text-left text-[16px] leading-[1.6] text-brand-dark/70 [&_a]:underline [&_a]:text-brand-dark prose-p:my-[6px]"
                  />
                )}

                <div className="lg:col-span-3 mt-[11px] flex items-center justify-between gap-4">
                  {currentStep > 0 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className={cn(
                        'flex h-[53px] min-w-[158px] items-center justify-center rounded-[100px] border border-brand-dark bg-transparent px-[32px] font-heading text-[16px] font-bold text-brand-dark leading-none transition-opacity duration-150',
                        status === 'submitting'
                          ? 'opacity-60'
                          : 'hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30'
                      )}
                    >
                      {activeStep?.prev_label ?? 'Previous'}
                    </button>
                  ) : (
                    <span />
                  )}

                  {currentStep < totalSteps - 1 ? (
                    <button
                      key="next"
                      type="button"
                      onClick={handleNext}
                      className={cn(
                        'flex h-[53px] min-w-[158px] items-center justify-center rounded-[100px] bg-brand-dark px-[32px] font-heading text-[16px] font-bold text-white leading-none transition-opacity duration-150',
                        status === 'submitting'
                          ? 'opacity-60'
                          : 'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30'
                      )}
                    >
                      {activeStep?.next_label ?? 'Next'}
                    </button>
                  ) : (
                    <button
                      key="submit"
                      type="submit"
                      disabled={status === 'submitting'}
                      className={cn(
                        'flex h-[53px] min-w-[158px] items-center justify-center rounded-[100px] bg-brand-dark px-[32px] font-heading text-[16px] font-bold text-white leading-none transition-opacity duration-150',
                        status === 'submitting'
                          ? 'opacity-70'
                          : 'hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/30'
                      )}
                    >
                      {status === 'submitting' ? 'Sending…' : resolvedSubmitLabel}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiStepContactForm;
