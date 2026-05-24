import ShopProducts from "@/src/components/shop/ShopProducts";
import ShopSidebar from "@/src/components/shop/ShopSidebar";
import { ShopProvider } from "@/src/context/ShopContext";

export default function ShopPage() {
    return (
        <ShopProvider>
            <div className="max-w-[1500px] mx-auto px-4 py-10"> 
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    <ShopSidebar /> 
                    <ShopProducts /> 
                </div> 
            </div>
        </ShopProvider>
    );
}