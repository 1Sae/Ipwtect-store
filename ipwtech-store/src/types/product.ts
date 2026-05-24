export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    images: string[];
    category: {
        _id: string;
        name: string;
    };
    brand: {
        _id: string;
        name: string;
    };
    stock: number;
    sold: number;
    discount: number;
    status: string;
    specs: {
        key: string;
        value: string;
    }[];
}