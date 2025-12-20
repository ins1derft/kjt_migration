import PageHeader from '@/components/blocks/PageHeader';
import NewsList from '@/components/blocks/NewsList';

export const dynamic = 'force-dynamic';

const CASE_STUDIES_CATEGORY = 'case-studies';

export default async function CaseStudiesPage() {
  return (
    <main className="bg-brand-gray text-brand-dark">
      <PageHeader
        title="Case Studies"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Case Studies', href: '/case-studies' },
        ]}
        padding="pt-[160px] lg:pt-[198px] pb-[38px]"
      />
      <NewsList
        query={{
          limit: 20,
          filter: { category: CASE_STUDIES_CATEGORY },
        }}
      />
    </main>
  );
}
