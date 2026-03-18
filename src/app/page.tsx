import HeroSection from "@/components/home/HeroSection";
import FlashSale from "@/components/home/FlashSale";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import { getActiveFlashSale, getBrands, getProducts } from "@/lib/api";

export default async function Home() {
  const [brands, flashSale, allProducts] = await Promise.all([
    getBrands().catch(() => []),
    getActiveFlashSale().catch(() => ({ endTime: null, products: [] })),
    getProducts({ sortBy: "popular", size: 20 }).catch(() => []),
  ]);

  const topSelling = [...allProducts].sort((a, b) => b.soldCount - a.soldCount).slice(0, 10);
  const fallbackFlashProducts = [...allProducts]
    .filter((p) => p.originalPrice > p.price)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 10);

  const flashProducts = flashSale.products.length > 0 ? flashSale.products : fallbackFlashProducts;
  const flashSaleEndTime = flashSale.endTime || "2099-01-01T00:00:00.000Z";

  return (
    <>
      <HeroSection categories={brands} />
      <FlashSale products={flashProducts} endTime={flashSaleEndTime} />
      <CategoryShowcase products={topSelling} />
    </>
  );
}
