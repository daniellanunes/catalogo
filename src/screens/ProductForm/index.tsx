import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation';
import { useCatalogStore } from '../../app/store/useCatalogStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductForm'>;

export default function ProductFormScreen({ navigation, route }: Props) {
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);
  const upsertProduct = useCatalogStore((s) => s.upsertProduct);

  const editId = route.params?.id;
  const editing = useMemo(() => products.find((p) => p.id === editId), [products, editId]);

  const [name, setName] = useState(editing?.name ?? '');
  const [price, setPrice] = useState(String(editing?.price ?? 99.9));
  const [description, setDescription] = useState(editing?.description ?? '');
  const [featured, setFeatured] = useState<boolean>(editing?.featured ?? false);
  const [favorite, setFavorite] = useState<boolean>(editing?.favorite ?? false);
  const [categoryId, setCategoryId] = useState<string>(editing?.categoryId ?? (categories[0]?.id ?? ''));

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

  const save = () => {
    const n = name.trim();
    const p = Number(price);

    if (!n) return Alert.alert('Atenção', 'Informe o nome do produto.');
    if (!Number.isFinite(p) || p < 0) return Alert.alert('Atenção', 'Preço inválido.');

    upsertProduct({
      id: editId,
      name: n,
      price: Math.round(p * 100) / 100,
      description: description.trim() || undefined,
      categoryId: categoryId || undefined,
      featured,
      favorite,
      imageUrl: undefined,
    });

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '900' }}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex: Tênis Runner"
          style={{ padding: 12, borderRadius: 12, backgroundColor: '#f4f4f4' }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '900' }}>Preço</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          placeholder="Ex: 199.90"
          style={{ padding: 12, borderRadius: 12, backgroundColor: '#f4f4f4' }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '900' }}>Descrição (opcional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Detalhes do produto..."
          style={{ minHeight: 90, padding: 12, borderRadius: 12, backgroundColor: '#f4f4f4', textAlignVertical: 'top' }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '900' }}>Categoria</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Sem" active={!categoryId} onPress={() => setCategoryId('')} />
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} active={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '900' }}>Flags</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label={featured ? 'Destaque: sim' : 'Destaque: não'} active={featured} onPress={() => setFeatured((v) => !v)} />
          <Chip label={favorite ? 'Favorito: sim' : 'Favorito: não'} active={favorite} onPress={() => setFavorite((v) => !v)} />
        </View>
      </View>

      <Pressable onPress={save} style={{ marginTop: 'auto', padding: 14, borderRadius: 12, backgroundColor: '#111' }}>
        <Text style={{ color: '#fff', fontWeight: '900', textAlign: 'center' }}>
          {editId ? 'Salvar alterações' : 'Criar produto'}
        </Text>
      </Pressable>
    </View>
  );
}
