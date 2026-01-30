import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation';
import { useCatalogStore } from '../../app/store/useCatalogStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>('ALL');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (categoryId === 'ALL' ? true : p.categoryId === categoryId))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt);
  }, [products, query, categoryId]);

  const catName = (id?: string) => categories.find((c) => c.id === id)?.name ?? 'Sem categoria';

  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? '#111' : '#eee',
      }}
    >
      <Text style={{ color: active ? '#fff' : '#111', fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={() => navigation.navigate('ProductForm')}
          style={{ padding: 12, backgroundColor: '#111', borderRadius: 10 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>+ Produto</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Categories')}
          style={{ padding: 12, backgroundColor: '#eee', borderRadius: 10 }}
        >
          <Text style={{ fontWeight: '700' }}>Categorias</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Favorites')}
          style={{ padding: 12, backgroundColor: '#eee', borderRadius: 10 }}
        >
          <Text style={{ fontWeight: '700' }}>Favoritos</Text>
        </Pressable>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar produto..."
        style={{ padding: 12, borderRadius: 12, backgroundColor: '#f4f4f4' }}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Chip label="Todos" active={categoryId === 'ALL'} onPress={() => setCategoryId('ALL')} />
        {categories.map((c) => (
          <Chip key={c.id} label={c.name} active={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#f4f4f4' }}>
            <Text>Nenhum produto encontrado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
            style={{ padding: 14, borderRadius: 12, backgroundColor: '#f4f4f4', marginBottom: 10, gap: 6 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '900' }}>{item.name}</Text>
              {item.featured ? (
                <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: '#111' }}>
                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>Destaque</Text>
                </View>
              ) : null}
            </View>

            <Text style={{ opacity: 0.8 }}>{catName(item.categoryId)}</Text>
            <Text style={{ fontWeight: '900' }}>R$ {item.price}</Text>
            {item.favorite ? <Text style={{ opacity: 0.7 }}>★ Favorito</Text> : null}
          </Pressable>
        )}
      />
    </View>
  );
}
