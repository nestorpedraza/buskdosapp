import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export interface ChatItem {
  id: string;
  placeName: string;
  lastMessage: string;
  lastTimestamp: number;
  unreadCount?: number;
  avatar?: any;
}

export default function ChatRow({
  item,
  onPress,
  onDelete,
}: {
  item: ChatItem;
  onPress?: (item: ChatItem) => void;
  onDelete?: (item: ChatItem) => void;
}) {
  return (
    <Pressable style={styles.row} onPress={() => onPress?.(item)}>
      <View style={styles.left}>
        <Image
          source={item.avatar || require('../../assets/images/city.png')}
          style={styles.avatar}
        />
        <View style={styles.texts}>
          <View style={styles.titleLine}>
            <Text style={styles.placeName} numberOfLines={1}>{item.placeName}</Text>
            <Text style={styles.time}>
              {formatTime(item.lastTimestamp)}
            </Text>
          </View>
          <View style={styles.messageLine}>
            <Text style={styles.message} numberOfLines={1}>{item.lastMessage}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <Pressable style={styles.deleteBtn} onPress={() => onDelete?.(item)}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </Pressable>
    </Pressable>
  );
}

function formatTime(ts: number) {
  const d = new Date(ts);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  texts: {
    flex: 1,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    maxWidth: '70%',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  messageLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  message: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9900ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
});
