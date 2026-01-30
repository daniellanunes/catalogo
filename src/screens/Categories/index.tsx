import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { useCatalogStore } from '../../app/store/useCatalogStore';

export default function CategoriesScreen() {
  const categories = useCatalogStore((s) => s.categories);
  const upsertCategory = useCatalogStore((s) => s.upsertCategory);
  const removeCategory = useCatalogStore((s) => s.removeCategory);

  const [name, setName] = useState('');

  const add = () => {
    const n = name.trim();
    if (!n) return Alert.alert('Atenção', 'Informe o nome da categoria.');
    upsertCategory({ name: n });
    setName('');
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ padding: 12, borderRadius: 12, backgroundColor: '#f4f4f4', gap: 10 }}>
        <Text style={{ fontWeight: '900' }}>Nova categoria</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex: Calçados"
          style={{ padding: 12, borderRadius: 10, backgroundColor: '#fff' }}
        />
        <Pressable onPress={add} style={{ padding: 12, borderRadius: 10, backgroundColor: '#111' }}>
          <Text style={{ color: '#fff', fontWeight: '900', textAlign: 'center' }}>Adicionar</Text>
        </Pressable>
      </View>

      <Text style={{ fontWeight: '900' }}>Categorias</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#f4f4f4',
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Text style={{ fontWeight: '900' }}>{item.name}</Text>

            <Pressable
              onPress={() =>
                Alert.alert('Remover', `Remover "${item.name}"?`, [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Remover', style: 'destructive', onPress: () => removeCategory(item.id) },
                ])
              }
              style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#eee' }}
            >
              <Text style={{ fontWeight: '900' }}>Excluir</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
