// src/app/product/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return {
    title: `${product.title} | Premium Brand`,
    description: product.description,
    openGraph: {
      images: [product.imageUrl],
    },
    alternates: {
      canonical: `https://yourbrand.in/product/${product.slug}`,
    }
  };
}
