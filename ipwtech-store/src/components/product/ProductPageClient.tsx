"use client";

import { useEffect, useState } from "react";
import { getProductById } from "@/src/services/productsService";

import ProductImagesGallery from "./ProductImagesGallery";
import ProductInfo from "./ProductInfo";
import ProductSpecs from "./ProductSpecs";
import ProductSkeleton from "./ProductSkeleton";
import AboutProduct from "./AboutProduct";
import ReviewSection from "./ReviewSection";


export default function ProductPageClient({ id }: { id: string }) { 
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data);
        } catch (err) {
            console.error(err);
        }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <ProductSkeleton />;
    }

    return (
        <div className="px-10 py-6 text-white">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ProductImagesGallery
            images={product.images?.length ? product.images : [product.image]}
            />
            <ProductInfo product={product} />
        </div>

        <div className="mt-12 flex flex-col gap-12">
            <AboutProduct desc={product.description} />
            <ProductSpecs specs={product.specs} />
            <ReviewSection productId={id} />
        </div>


        </div>
    );
}