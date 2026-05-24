"use client";

import HeroSlider from "@/src/components/home/HeroSlider";
import ProductSection from "@/src/components/home/ProductSection";
import CategorySection from "@/src/components/home/CategorySection";
import BrandSection from "@/src/components/home/BrandSection";

export default function HomePage() {
  return (
    <main className="w-full flex flex-col gap-6">

      {/* ================= Hero Slider ================= */}
      <HeroSlider />



      <ProductSection
        title="Top Selling Products"
        type="top-selling"
      />

      <ProductSection
        title="Newest Products"
        type="Newest"
      />

      <ProductSection
        title="Discounted Products"
        type="discounted"
      />



      {/* ================= Categories ================= */}
      <CategorySection title="Categories"/>



      {/* ================= Brands ================= */}
      <BrandSection title="Brands"/>

    </main>
  );
}