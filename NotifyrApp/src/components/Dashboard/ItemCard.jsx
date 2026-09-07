import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CATEGORIES } from '../../constants/categories';
import QrTagIcon from './QrTagIcon';

const FALLBACK_ICON = CATEGORIES[0].icon;

// 1. ADDED 'notLinked' to handle the missing tag state properly
const STATUS_META = {
  active: { color: '#1E9E5A', bg: '#E4F7EC', label: 'Active' },
  dnd: { color: '#B8860B', bg: '#FDF3DC', label: 'Do Not Disturb' },
  lost: { color: '#D32F2F', bg: '#FDECEA', label: 'Lost' },
  notLinked: { color: '#8A94A6', bg: '#EEF1F6', label: 'Not Linked' }, 
};

const ItemCard = ({ item, onPress }) => {
  // 2. UPDATED LOGIC: 
  // If there is no QR tag, force the status to 'notLinked'.
  // If there is a tag, use the actual status (defaulting to 'active').
  const currentStatus = item.qr_id ? (item.status?.toLowerCase() || 'active') : 'notLinked';
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.notLinked;

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.thumbnailContainer}>
        {item.item_photo_url ? (
          <Image source={{ uri: item.item_photo_url }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Image
              source={item.categoryIcon || FALLBACK_ICON}
              style={styles.placeholderIcon}
              resizeMode="contain"
            />
          </View>
        )}
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}

        <View style={styles.qrBadge}>
          <QrTagIcon linked={!!item.qr_id} size={16} />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.nickname} numberOfLines={1}>{item.nickname}</Text>
        <Text style={styles.category}>{item.category.toUpperCase()}</Text>
      </View>

      <View style={[styles.statusPill, { backgroundColor: statusMeta.bg }]}>
        <View style={[styles.statusDot, { backgroundColor: statusMeta.color }]} />
        <Text style={[styles.statusPillText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#0A1931',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnailContainer: { position: 'relative', marginRight: 14 },
  thumbnail: { width: 58, height: 58, borderRadius: 12 },
  thumbnailPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: { width: 26, height: 26 },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  qrBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 2,
  },
  detailsContainer: { flex: 1, justifyContent: 'center', marginRight: 8 },
  nickname: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  category: { fontSize: 11, color: '#9AA5B5', fontWeight: '700', letterSpacing: 0.5 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusPillText: { fontSize: 10.5, fontWeight: '700' },
});

export default ItemCard;