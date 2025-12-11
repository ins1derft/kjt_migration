import { cn, resolveMediaUrl } from '@/lib/utils';
import { resolveSectionBackground, resolveSectionBackgroundStyle, resolveSectionPadding, type SectionPadding } from '@/lib/blocks/padding';
import type { TeamMember } from '@/lib/blocks/types';
import { getTeamMember } from '@/lib/api';
import Image from 'next/image';
import RichText from '../RichText';

export type TeamHighlightProps = {
  title?: string | null;
  intro?: string | null;
  footerText?: string | null;
  memberSlug?: string | null;
  member?: TeamMember | null;
  padding?: SectionPadding | null;
  backgroundClass?: string | null;
  backgroundColor?: string | null;
};

const DEFAULT_INTRO = 'Meet the people behind our work. We pair strategy with hands-on experience to deliver real results for schools and families.';

async function resolveMember(member?: TeamMember | null, memberSlug?: string | null): Promise<TeamMember | null> {
  if (member) return member;
  if (!memberSlug) return null;
  return await getTeamMember(memberSlug, {
    fields: ['slug', 'name', 'role', 'department', 'photo', 'bio'],
    init: { cache: 'no-store' },
  });
}

export default async function TeamHighlight({
  title,
  intro,
  footerText,
  member,
  memberSlug,
  padding,
  backgroundClass,
  backgroundColor,
}: TeamHighlightProps) {
  const resolvedMember = await resolveMember(member, memberSlug);

  if (!resolvedMember) return null;

  const paddingClass = resolveSectionPadding(padding, 'pt-[96px] pb-[96px]');
  const sectionBackground = resolveSectionBackground(backgroundClass, 'bg-white');
  const sectionStyle = resolveSectionBackgroundStyle(backgroundColor);

  const photo = resolveMediaUrl(resolvedMember.photo) ?? '/images/placeholders/no-image.jpg';
  const heading = title ?? resolvedMember.role ?? 'Team Highlight';
  const introText = intro ?? DEFAULT_INTRO;

  return (
    <section className={cn('overflow-hidden', sectionBackground, paddingClass)} style={sectionStyle}>
      <div className="container mx-auto flex flex-col items-center px-5 sm:px-6 md:px-10 text-center">
        <h2 className="font-heading text-[32px] font-bold leading-[1.05] text-brand-dark md:text-[64px]">{heading}</h2>
        {introText ? (
          <RichText
            html={introText}
            className="mt-[15px] max-w-[934px] text-[16px] font-heading leading-[1.4] text-brand-dark/70 md:text-[20px] mx-auto prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold"
          />
        ) : null}

        <div className="mt-[64px] flex w-full flex-col items-center gap-[32px] md:flex-row md:items-center md:justify-center md:gap-[32px]">
          <div className="h-auto w-[274px] overflow-hidden rounded-[20px] shadow-[0px_2px_20.6px_rgba(0,0,0,0.1)] md:z-10 md:-mr-[76px]">
            <div className="relative aspect-[274/343] w-full">
              <Image
                src={photo}
                alt={resolvedMember.name}
                fill
                sizes="(max-width: 768px) 80vw, 274px"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="flex-1 rounded-[20px] bg-brand-gray px-[48px] py-[40px] text-left md:min-h-[279px] md:pl-[124px] md:pr-[48px]">
            <div className="max-w-[893px]">
              <p className="font-heading text-[24px] font-bold leading-[1.2] text-brand-dark">
                {resolvedMember.name}
              </p>
              {resolvedMember.role ? (
                <RichText
                  html={resolvedMember.role}
                  className="mt-[4px] font-heading text-[20px] leading-[1.4] text-brand-dark/80 prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold"
                />
              ) : null}
              {resolvedMember.bio ? (
                <RichText
                  html={resolvedMember.bio}
                  className="mt-[20px] font-heading text-[20px] leading-[1.4] text-brand-dark/70 prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold"
                />
              ) : null}
            </div>
          </div>
        </div>

        {footerText ? (
          <RichText
            html={footerText}
            className="mt-[38px] max-w-[934px] text-[16px] font-heading leading-[1.4] text-brand-dark/70 md:text-[20px] mx-auto prose-p:my-0 prose-headings:my-0 prose-strong:font-semibold"
          />
        ) : null}
      </div>
    </section>
  );
}
