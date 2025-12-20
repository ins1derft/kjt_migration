import * as React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 text-brand-dark', className)}
      classNames={{
        root: 'relative p-0',
        months: 'flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        month_caption: 'relative flex min-h-[40px] items-center justify-center px-12 pt-0',
        caption_label:
          'inline-flex items-center gap-1 rounded-[10px] border border-[#C6CBDF] bg-white px-3 py-1 text-[14px] font-semibold text-brand-dark shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        dropdowns: 'mx-auto flex items-center gap-2 text-brand-dark',
        dropdown_root: 'relative inline-flex items-center',
        dropdown: 'absolute inset-0 h-full w-full cursor-pointer opacity-0 text-brand-dark',
        nav: 'pointer-events-none absolute left-0 right-0 top-2 z-10 flex h-10 items-center justify-between px-2',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'pointer-events-auto relative z-20 h-8 w-8 rounded-full border-[#C6CBDF] bg-white p-0 text-table-text/80 hover:bg-brand-sky/10 hover:text-brand-dark'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'pointer-events-auto relative z-20 h-8 w-8 rounded-full border-[#C6CBDF] bg-white p-0 text-table-text/80 hover:bg-brand-sky/10 hover:text-brand-dark'
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: 'w-9 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-table-text/70',
        weeks: 'mt-2 flex flex-col space-y-1',
        week: 'flex w-full',
        day: 'relative h-9 w-9 p-0 text-center text-sm',
        day_button:
          'inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[14px] font-semibold text-brand-dark transition-colors hover:bg-brand-sky/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/20',
        selected:
          'bg-brand-sky text-white hover:bg-brand-sky focus:bg-brand-sky',
        today: 'bg-brand-orange/15 text-brand-dark',
        outside:
          'text-table-text/40 aria-selected:bg-brand-sky/20 aria-selected:text-table-text/60',
        disabled: 'text-table-text/40',
        range_middle: 'aria-selected:bg-brand-sky/15 aria-selected:text-brand-dark',
        range_end: 'range_end',
        range_start: 'range_start',
        hidden: 'invisible',
        chevron: 'text-table-text/70',
        ...classNames,
      }}
      components={{
        Chevron: ({ className: iconClassName, orientation, ...iconProps }) => {
          const iconClass = cn('h-4 w-4', iconClassName);
          if (orientation === 'left') {
            return <ChevronLeft className={iconClass} {...iconProps} />;
          }
          if (orientation === 'right') {
            return <ChevronRight className={iconClass} {...iconProps} />;
          }
          if (orientation === 'up') {
            return <ChevronUp className={iconClass} {...iconProps} />;
          }
          return <ChevronDown className={iconClass} {...iconProps} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
