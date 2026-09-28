import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import { auth } from "@/lib/auth/auth";
import { formatCurrency } from "@/lib/utils";
import { BuyNowButton } from "@/components/forms/buy-now-button";
import { LinkButton } from "@/components/ui/button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();

  return (
    <div className="container-app py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-surface-tint" />

        <div>
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-wide text-accent">{product.category.name}</p>
          )}
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-ink">{formatCurrency(product.price.toString())}</p>

          {product.description && <p className="mt-6 leading-relaxed text-ink-muted">{product.description}</p>}

          {product.inventoryCount !== null && (
            <p className="mt-4 text-sm text-ink-muted">
              {product.inventoryCount > 0 ? `${product.inventoryCount} in stock` : "Out of stock"}
            </p>
          )}

          <div className="mt-8">
            {session?.user ? (
              product.inventoryCount === 0 ? (
                <p className="text-sm text-ink-muted">This item is currently out of stock.</p>
              ) : (
                <BuyNowButton productId={product.id} />
              )
            ) : (
              <LinkButton href={`/login?callbackUrl=/store/${product.slug}`}>Sign in to Purchase</LinkButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
