import { fetchJson } from "@/lib/api";

export type MenuItem = {
  id: number;
  label: string;
  url: string;
  slot?: string | null;
  icon?: string | null;
  opens_in_new_tab: boolean;
  children?: MenuItem[];
};

export type Menu = {
  slug: string;
  name: string;
  location: "header" | "footer" | string;
  items: MenuItem[];
};

type FetchMenuOptions = {
  revalidate?: number;
};

export async function fetchMenuByLocation(location: "header" | "footer", opts: FetchMenuOptions = {}): Promise<Menu | null> {
  const { revalidate = 300 } = opts;
  const payload = await fetchJson<Menu[] | { data: Menu[] }>(`/menus?location=${location}`, { revalidate });

  const items = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

  if (!items.length) {
    return null;
  }

  return items[0];
}
