import Link from 'next/link';
import type { CSSProperties } from 'react';
import styles from './blocks.module.css';
import type { HeroBlock } from '@/lib/blocks/types';

export default function HeroSection({
  title,
  subtitle,
  badge,
  background,
  primary_cta_label,
  primary_cta_url,
  secondary_cta_label,
  secondary_cta_url,
}: HeroBlock['fields']) {
  const heroStyle = background
    ? ({ '--hero-bg': `url(${background})` } as CSSProperties)
    : undefined;

  return (
    <section className={styles.section}>
      <div className={styles.hero} style={heroStyle}>
        <div className={styles.heroContent}>
          {badge && <span className={styles.badge}>{badge}</span>}
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
          <div className={styles.ctas}>
            {primary_cta_label && primary_cta_url && (
              <Link className={styles.ctaPrimary} href={primary_cta_url}>
                {primary_cta_label}
              </Link>
            )}
            {secondary_cta_label && secondary_cta_url && (
              <Link className={styles.ctaSecondary} href={secondary_cta_url}>
                {secondary_cta_label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
