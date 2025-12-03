export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export type Category = string;

export interface UserProfile {
  name?: string;
  address?: string;
  email: string;
}


export interface UserProfile {
  id: string;
  name?: string;
  address?: string;
  email: string;
}
