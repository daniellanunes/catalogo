import React, { useMemo } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation';
import { useCatalogStore } from '../../app/store/useCatalogStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

export default function ProductDetailsScreen({ navigation, route }: Props) {
  const id = route.params.id;

  const product = useCatalogStore((s) => s.products.find((p) => p.id === id));
  const categories = useCatalogStore((s) => s.categories);
  const toggleFavorite = useCatalogStore((s) => s.toggleFavorite);
  const removeProduct = useCatalogStore((s) => s.removeProduct);

  const categoryName = useMemo(() => {
    if (!product?.categoryId) return 'Sem categoria';
    return categories.find((c) => c.id === product.categoryId)?.name ?? 'Sem categoria';
  }, [product?.categoryId, categories]);

  if (!product) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ padding: 14, borderRadius: 12, backgroundColor: '#f4f4f4', gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: '900' }}>{product.name}</Text>
        <Text style={{ opacity: 0.8 }}>{categoryName}</Text>
        <Text style={{ fontWeight: '900', fontSize: 16 }}>R$ {product.price}</Text>
        {product.featured ? <Text style={{ opacity: 0.8 }}>Destaque: sim</Text> : <Text style={{ opacity: 0.8 }}>Destaque: não</Text>}
        {product.description ? <Text style={{ marginTop: 6 }}>{product.description}</Text> : null}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={() => toggleFavorite(product.id)}
          style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#111' }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', textAlign: 'center' }}>
            {product.favorite ? 'Remover favorito' : 'Favoritar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ProductForm', { id: product.id })}
          style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#eee' }}
        >
          <Text style={{ fontWeight: '900', textAlign: 'center' }}>Editar</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() =>
          Alert.alert('Excluir', 'Deseja excluir este produto?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: () => {
                removeProduct(product.id);
                navigation.goBack();
              },
            },
          ])
        }
        style={{ marginTop: 'auto', padding: 14, borderRadius: 12, backgroundColor: '#eee' }}
      >
        <Text style={{ fontWeight: '900', textAlign: 'center' }}>Excluir produto</Text>
      </Pressable>
    </View>
  );
}
