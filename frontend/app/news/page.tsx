import PageHeader from '@/components/blocks/PageHeader';
import NewsList from '@/components/blocks/NewsList';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  return (
    <main className="bg-brand-gray text-brand-dark">
      <PageHeader
        title="News"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
        ]}
        padding="pt-[160px] lg:pt-[198px] pb-[38px]"
      />
      <NewsList
        query={{
          limit: 20,
          filter: { type: 'news' },
        }}
      />
    </main>
  );
}
