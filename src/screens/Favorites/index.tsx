import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation';
import { useCatalogStore } from '../../app/store/useCatalogStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen({ navigation }: Props) {
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);

  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => p.favorite)
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [products, query]);

  const catName = (id?: string) => categories.find((c) => c.id === id)?.name ?? 'Sem categoria';

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar nos favoritos..."
        style={{ padding: 12, borderRadius: 12, backgroundColor: '#f4f4f4' }}
      />

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#f4f4f4' }}>
            <Text>Nenhum favorito ainda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
            style={{ padding: 14, borderRadius: 12, backgroundColor: '#f4f4f4', marginBottom: 10, gap: 6 }}
          >
            <Text style={{ fontSize: 16, fontWeight: '900' }}>{item.name}</Text>
            <Text style={{ opacity: 0.8 }}>{catName(item.categoryId)}</Text>
            <Text style={{ fontWeight: '900' }}>R$ {item.price}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
