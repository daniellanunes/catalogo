export type ID = string;

export type Category = {
  id: ID;
  name: string;
};

export type Product = {
  id: ID;
  name: string;
  price: number;
  description?: string;
  categoryId?: ID;
  featured: boolean;
  favorite: boolean;
  imageUrl?: string;
  createdAt: number;
};
