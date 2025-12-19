import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import ChatRow, { ChatItem } from '../components/chats/ChatRow';

export default function ChatsScreen() {
  const [query, setQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [chats, setChats] = useState<ChatItem[]>(sampleChats);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? chats.filter(c => c.placeName.toLowerCase().includes(q))
      : chats.slice();
    base.sort((a, b) => {
      const cmp = a.lastTimestamp - b.lastTimestamp;
      return sortDesc ? -cmp : cmp;
    });
    return base;
  }, [query, sortDesc, chats]);
  const handleDelete = (ci: ChatItem) => {
    setChats(prev => prev.filter(c => c.id !== ci.id));
  };
  const toggleSort = () => setSortDesc(s => !s);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <View style={styles.toolbar}>
          <View style={styles.search}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar lugar"
              placeholderTextColor="#9ca3af"
              value={query}
              onChangeText={setQuery}
            />
            <Pressable accessibilityRole="button" style={styles.searchIconBtn}>
              <Text style={styles.searchIconText}>{'\u{1F50D}'}</Text>
            </Pressable>
          </View>
          <Pressable style={styles.sortBtn} onPress={toggleSort}>
            <Text style={styles.sortText}>{sortDesc ? 'Fecha ↓' : 'Fecha ↑'}</Text>
          </Pressable>
        </View>
        <View style={styles.list}>
          {filtered.map(item => (
            <ChatRow key={item.id} item={item} onDelete={handleDelete} />
          ))}
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>Sin chats</Text>
              <Text style={styles.emptySub}>Busca por nombre o vuelve más tarde</Text>
            </View>
          )}
        </View>
        <TabBar activeRoute="/chats" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  searchIcon: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  searchIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  searchIconText: {
    fontSize: 16,
    color: '#6b7280',
  },
  sortBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  sortText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  emptySub: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
});

const sampleChats: ChatItem[] = [
  {
    id: 'c1',
    placeName: 'Boutique Fashion',
    lastMessage: 'Hola, estamos abiertos hoy hasta las 9pm.',
    lastTimestamp: Date.now() - 1000 * 60 * 15,
    unreadCount: 2,
    avatar: require('../assets/images/city.png'),
  },
  {
    id: 'c2',
    placeName: 'Pan del Día',
    lastMessage: 'Tenemos promoción del 2x1 en croissants.',
    lastTimestamp: Date.now() - 1000 * 60 * 60 * 3,
    unreadCount: 0,
    avatar: require('../assets/images/city.png'),
  },
  {
    id: 'c3',
    placeName: 'Sushi Bar',
    lastMessage: 'Tu reserva está confirmada para las 8pm.',
    lastTimestamp: Date.now() - 1000 * 60 * 5,
    unreadCount: 5,
    avatar: require('../assets/images/city.png'),
  },
  {
    id: 'c4',
    placeName: 'Farma Salud',
    lastMessage: 'Tu pedido está listo para recoger.',
    lastTimestamp: Date.now() - 1000 * 60 * 120,
    unreadCount: 1,
    avatar: require('../assets/images/city.png'),
  },
];
