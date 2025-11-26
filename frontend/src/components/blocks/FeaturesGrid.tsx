import styles from './blocks.module.css';
import type { FeaturesGridBlock } from '@/lib/blocks/types';

export default function FeaturesGrid({ title, items }: FeaturesGridBlock['fields']) {
  if (!items || items.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeading}>
        {title && <h2>{title}</h2>}
      </div>
      <div className={styles.grid}>
        {items.map((item, idx) => (
          <article key={idx} className={styles.card}>
            <div className={styles.cardTitle}>{item.title}</div>
            <p className={styles.cardText}>{item.text}</p>
            {item.icon && <span className={styles.muted}>Icon: {item.icon}</span>}
          </article>
        ))}
      </div>
    </section>
  );
}
