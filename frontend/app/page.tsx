import type { Metadata } from "next";
import ProductHero from "@/components/blocks/ProductHero";
import { renderBlocks } from "@/lib/blocks/registry";
import type { BlockInput, PagePayload, ProductSummary } from "@/lib/blocks/types";
import { fetchJson, getForm } from "@/lib/api";
import { absoluteUrl, defaultSeo, mergeSeo, nextSeoToMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HOME_SLUG = "home";
type PageApiResponse = { data: PagePayload };

function isPageResource(payload: PagePayload | PageApiResponse): payload is PageApiResponse {
  return typeof (payload as PageApiResponse).data === "object";
}

async function fetchHomePage() {
  const res = await fetchJson<PageApiResponse | PagePayload>(`/pages/${HOME_SLUG}`, {
    cache: "no-store",
  });

  if (!res) return null;
  return isPageResource(res) ? res.data : res;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchHomePage();
  const canonical = absoluteUrl("/");

  const seoConfig = mergeSeo(defaultSeo, {
    title: data?.seo?.title ?? data?.title ?? defaultSeo.title,
    description: data?.seo?.description ?? defaultSeo.description,
    canonical,
    openGraph: {
      title: data?.seo?.title ?? data?.title ?? defaultSeo.title,
      description: data?.seo?.description ?? defaultSeo.description,
      url: canonical,
      images: data?.seo?.og_image ? [{ url: data.seo.og_image }] : defaultSeo.openGraph?.images,
    },
  });

  return nextSeoToMetadata(seoConfig);
}

export default async function HomePage() {
  const data = await fetchHomePage();

  if (!data) {
    return (
      <main className="bg-brand-gray text-brand-dark">
        <div className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-12 text-muted-foreground">
          Главная страница пока не настроена. Добавьте запись со slug &quot;home&quot; в разделе Pages админки.
        </div>
      </main>
    );
  }

  const blocks = (data?.blocks ?? []) as BlockInput[];
  const product = (data?.product ?? null) as ProductSummary | null;
  const productFormCode = product?.form?.code ?? null;

  const blockFormCodes = blocks
    .map((block) => {
      if (block.name === "product_hero" || block.name === "gradient_form_banner") {
        const values = (block.values ?? {}) as { formCode?: string | null };
        return values.formCode ?? null;
      }
      if (block.name === "cta_section") {
        const values = (block.values ?? {}) as { formCode?: string | null };
        return values.formCode ?? null;
      }
      if (block.name === "contact_form") {
        const values = (block.values ?? {}) as { formCode?: string | null };
        return values.formCode ?? null;
      }
      if (block.name === "counter_showcase") {
        const values = (block.values ?? {}) as { formCode?: string | null };
        return values.formCode ?? null;
      }
      return null;
    })
    .flat()
    .filter(Boolean) as string[];

  const uniqueFormCodes = Array.from(new Set([productFormCode, ...blockFormCodes].filter(Boolean))) as string[];

  const formsByCodeEntries = await Promise.all(
    uniqueFormCodes.map(async (code) => [code, await getForm(code, { init: { cache: "no-store" } })] as const)
  );

  const formsByCode = Object.fromEntries(formsByCodeEntries) as Record<string, Awaited<ReturnType<typeof getForm>>>;
  const formConfig = productFormCode ? formsByCode[productFormCode] ?? null : null;

  const normalizedBlocks = blocks.map((block) => {
    if (block.name !== "reviews") return block;
    const values = { ...(block.values ?? {}) } as Record<string, unknown>;
    const { items: _omitItems, ...rest } = values;
    void _omitItems;
    const query = (values as { query?: Record<string, unknown> }).query ?? { limit: 12, onlyActive: true };
    return { ...block, values: { ...rest, query } } as BlockInput;
  });

  const hasProductHeroBlock = normalizedBlocks.some((block) => block.name === "product_hero");
  const showProductHero = data?.type === "product_landing" && product && !hasProductHeroBlock;

  const heroProps = showProductHero
    ? {
        title: product?.name ?? "",
        slogan: product?.excerpt ?? product?.slogan ?? undefined,
        description: product?.description ?? product?.excerpt ?? undefined,
        rating: product?.rating ?? undefined,
        reviewCount: product?.review_count_label ?? undefined,
        badges: product?.badges ?? [],
        formCode: product?.form?.code ?? undefined,
        formTitle: product?.form?.title ?? undefined,
        formConfig,
        ctaLabel: product?.default_cta_label ?? undefined,
        hasProduct: true,
      }
    : null;

  const content = normalizedBlocks.length
    ? renderBlocks(normalizedBlocks, {
        product,
        variants: data?.variants,
        formConfig,
        formsByCode,
      })
    : (
        <p className="mx-auto w-full max-w-6xl px-4 xl:px-12 py-8 text-muted-foreground">
          Контент страницы появится здесь после заполнения блоков в админке.
        </p>
      );

  return (
    <main className="bg-brand-gray text-brand-dark">
      {showProductHero && heroProps && <ProductHero {...heroProps} />}
      {content}
    </main>
  );
}
