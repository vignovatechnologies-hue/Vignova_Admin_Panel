import ProductDetail from "@/components/ProductDetail/ProductDetail";

export const dynamic = "force-dynamic";

export default function ProductDetailPage({ params }) {
  return <ProductDetail slug={params.slug} />;
}
