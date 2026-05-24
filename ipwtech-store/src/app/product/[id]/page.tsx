import ProductPageClient from "@/src/components/product/ProductPageClient";

export default async function ProductPage({
    params,
    }: {
        params: Promise<{ id: string }>;
    }) {
        const { id } = await params;
    
        return <ProductPageClient id={id} />;
    }