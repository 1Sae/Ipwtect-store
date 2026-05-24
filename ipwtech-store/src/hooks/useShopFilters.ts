import { useState } from "react"

export const useShopFilters = () => {
    const [category, setCategory] = useState<string | null>(null)
    const [brand, setBrand] = useState<string | null>(null)
    
        return {
        category,
        brand,
        setCategory,
        setBrand
        }
    }