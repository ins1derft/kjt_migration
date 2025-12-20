import React from 'react';
import { cn } from '@/lib/utils';

type ArticleBodyProps = {
  html?: string | null;
  className?: string;
};

/**
 * Renders trusted HTML content for article bodies with custom presets.
 */
const ArticleBody: React.FC<ArticleBodyProps> = ({ html, className }) => {
  if (!html) return null;

  return (
    <div
      className={cn('article-body', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default ArticleBody;
