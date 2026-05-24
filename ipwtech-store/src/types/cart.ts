import { Product } from "./product";

export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
}