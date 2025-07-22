import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { fetchItemsFromApi } from '../../utils/api';
import { saveImage } from '../../utils/file';
import { initItemsTable, upsertItem, getAllItems, getPendingItems, markItemSynced } from '../../database/items';
import { API_URL } from '../../constants/Api';

export default function DataScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const init = async () => {
      await initItemsTable();
      await loadItems();
      await countPending();
    };
    init();
    const sub = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => sub();
  }, []);

  const loadItems = async () => {
    const all = await getAllItems();
    setItems(all);
  };

  const countPending = async () => {
    const p = await getPendingItems();
    setPending(p.length);
  };

  const handleFetch = async () => {
    try {
      const data = await fetchItemsFromApi();
      for (const item of data) {
        const imagePath = item.image ? await saveImage(item.id, item.image) : null;
        await upsertItem({ id: item.id, title: item.title, imagePath, synced: 1 });
      }
      await loadItems();
      await countPending();
      Alert.alert('Sucesso', 'Dados baixados');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao buscar dados');
    }
  };

  const syncPending = async () => {
    try {
      const pendentes = await getPendingItems();
      for (const item of pendentes) {
        await fetch(`${API_URL}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, title: item.title }),
        });
        await markItemSynced(item.id);
      }
      await loadItems();
      await countPending();
      Alert.alert('Sucesso', 'Sincronização concluída');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao sincronizar');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      {item.imagePath ? (
        <Image source={{ uri: item.imagePath }} style={styles.avatar} />
      ) : null}
      <Text style={styles.title}>{item.title}</Text>
      {!item.synced && <Text style={styles.pending}>●</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Dados</Text>
      <Text style={[styles.status, isConnected ? styles.online : styles.offline]}> {isConnected ? '🟢 Online' : '🔴 Offline'} </Text>
      <Button title="Buscar na API" onPress={handleFetch} />
      {pending > 0 && isConnected && (
        <View style={{ marginVertical: 10 }}>
          <Button title={`Enviar dados (${pending})`} onPress={syncPending} />
        </View>
      )}
      <FlatList data={items} keyExtractor={(item) => String(item.id)} renderItem={renderItem} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  status: { marginBottom: 10 },
  online: { color: 'green' },
  offline: { color: 'red' },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  title: { flex: 1 },
  pending: { color: 'orange', marginLeft: 6 },
});
