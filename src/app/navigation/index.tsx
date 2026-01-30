import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCatalogStore } from '../store/useCatalogStore';

import HomeScreen from '../../screens/Home';
import ProductDetailsScreen from '../../screens/ProductDetails';
import ProductFormScreen from '../../screens/ProductForm';
import CategoriesScreen from '../../screens/Categories';
import FavoritesScreen from '../../screens/Favorites';

export type RootStackParamList = {
  Home: undefined;
  ProductDetails: { id: string };
  ProductForm: { id?: string } | undefined;
  Categories: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  const hydrate = useCatalogStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Catálogo' }} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Produto' }} />
        <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Novo produto' }} />
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categorias' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
