import { create } from 'zustand';
import { Category, Product, ID } from '../types/models';
import { getJSON, setJSON } from '../utils/storage';

const STORAGE_KEY = '@catalogo_demo_v1';
const uid = (): ID => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

type State = {
  hydrated: boolean;

  categories: Category[];
  products: Product[];

  hydrate: () => Promise<void>;
  persist: () => Promise<void>;

  upsertCategory: (c: Omit<Category, 'id'> & { id?: ID }) => void;
  removeCategory: (id: ID) => void;

  upsertProduct: (p: Omit<Product, 'id' | 'createdAt'> & { id?: ID }) => void;
  removeProduct: (id: ID) => void;

  toggleFavorite: (id: ID) => void;
};

type Persisted = Pick<State, 'categories' | 'products'>;

export const useCatalogStore = create<State>((set, get) => ({
  hydrated: false,

  categories: [
    { id: 'cat1', name: 'Tênis' },
    { id: 'cat2', name: 'Camisas' },
    { id: 'cat3', name: 'Acessórios' },
  ],
  products: [
    {
      id: 'p1',
      name: 'Tênis Runner',
      price: 299.9,
      description: 'Confortável para o dia a dia.',
      categoryId: 'cat1',
      featured: true,
      favorite: false,
      createdAt: Date.now() - 100000,
    },
    {
      id: 'p2',
      name: 'Camiseta Básica',
      price: 59.9,
      description: 'Algodão premium.',
      categoryId: 'cat2',
      featured: false,
      favorite: true,
      createdAt: Date.now() - 50000,
    },
  ],

  hydrate: async () => {
    const data = await getJSON<Persisted>(STORAGE_KEY, {
      categories: get().categories,
      products: get().products,
    });
    set({ ...data, hydrated: true });
  },

  persist: async () => {
    const { categories, products } = get();
    await setJSON(STORAGE_KEY, { categories, products } satisfies Persisted);
  },

  upsertCategory: (c) => {
    const id = c.id ?? uid();
    set((state) => {
      const exists = state.categories.some((x) => x.id === id);
      const categories = exists
        ? state.categories.map((x) => (x.id === id ? { ...x, ...c, id } : x))
        : [{ id, name: c.name }, ...state.categories];
      return { categories };
    });
    void get().persist();
  },

  removeCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      products: state.products.map((p) =>
        p.categoryId === id ? { ...p, categoryId: undefined } : p
      ),
    }));
    void get().persist();
  },

  upsertProduct: (p) => {
    const id = p.id ?? uid();
    set((state) => {
      const exists = state.products.some((x) => x.id === id);
      const next: Product = {
        id,
        name: p.name,
        price: p.price,
        description: p.description,
        categoryId: p.categoryId,
        featured: p.featured,
        favorite: p.favorite,
        imageUrl: p.imageUrl,
        createdAt: exists ? state.products.find((x) => x.id === id)!.createdAt : Date.now(),
      };
      const products = exists
        ? state.products.map((x) => (x.id === id ? next : x))
        : [next, ...state.products];
      return { products };
    });
    void get().persist();
  },

  removeProduct: (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
    void get().persist();
  },

  toggleFavorite: (id) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
    }));
    void get().persist();
  },
}));
