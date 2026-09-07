import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Linking,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import * as messageService from '../../services/messageService';
import * as blockService from '../../services/blockService';
import { getCategoryIcon } from '../../constants/categories';
import BottomSheetMenu from '../../components/BottomSheetMenu';
import TabScreenHeader from '../../components/TabScreenHeader';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';

const PRESET_LABELS = {
  found_item: 'FOUND YOUR ITEM!',
  safe_now: 'ITEM IS SAFE',
  need_pickup: 'PLEASE PICK IT UP',
};

function getPresetLabel(presetType) {
  if (PRESET_LABELS[presetType]) return PRESET_LABELS[presetType];
  if (!presetType) return 'NEW MESSAGE';
  const spaced = presetType.replace(/_/g, ' ');
  return spaced.toUpperCase();
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

const MessagesScreen = ({ navigation }) => {
  const { token } = useAuth();
  const { items, fetchItems } = useItems();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [menuMessage, setMenuMessage] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null); // null = "All"
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const itemsById = useMemo(() => {
    const lookup = {};
    items.forEach((item) => {
      lookup[item.id] = item;
    });
    return lookup;
  }, [items]);

  const loadData = useCallback(async () => {
    try {
      const [messagesData] = await Promise.all([
        messageService.listMessages(token),
        fetchItems(),
      ]);

      const rawMessages = messagesData.messages || messagesData;
      const sorted = [...rawMessages].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setMessages(sorted);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [token, fetchItems]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Only items that actually have at least one message get a filter chip
  const itemsWithMessages = useMemo(() => {
    const seen = new Set();
    const result = [];
    messages.forEach((m) => {
      if (!seen.has(m.item_id) && itemsById[m.item_id]) {
        seen.add(m.item_id);
        result.push(itemsById[m.item_id]);
      }
    });
    return result;
  }, [messages, itemsById]);

  // Filtering is done client-side against the already-fetched full list
  const filteredMessages = useMemo(() => {
    if (!selectedItemId) return messages;
    return messages.filter((m) => m.item_id === selectedItemId);
  }, [messages, selectedItemId]);

  // Unread badge always reflects the TRUE total
  const unreadCount = messages.filter((m) => !m.read_by_owner).length;

  // Sync WhatsApp-style badge on the bottom navigation bar
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        tabBarBadgeStyle: {
          backgroundColor: colors.brandGold,
          color: colors.brandNavy,
          fontWeight: 'bold',
        },
      });
    }, [navigation, unreadCount])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleToggleExpand = async (message) => {
    const isOpening = expandedId !== message.id;
    setExpandedId(isOpening ? message.id : null);

    if (isOpening && !message.read_by_owner) {
      try {
        await messageService.markRead(message.id, token);
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, read_by_owner: 1 } : m))
        );
      } catch (err) {
        console.error('Failed to mark message read:', err);
      }
    }
  };

  const handleViewLocation = (lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleBlockSender = async (message) => {
    try {
      await blockService.blockDevice(message.device_hash, message.item_id, token);
      alert('Blocked', 'This sender has been blocked.');
    } catch (err) {
      alert('Error', err.message || 'Could not block this sender.');
    }
  };

  const handleDeleteMessage = (message) => {
    setMenuMessage(null);
    alert('Delete Message', 'This message will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await messageService.deleteMessage(message.id, token);
            setMessages((prev) => prev.filter((m) => m.id !== message.id));
            if (expandedId === message.id) setExpandedId(null);
          } catch (err) {
            alert('Error', err.message || 'Could not delete this message.');
          }
        },
      },
    ]);
  };

  const handleDeleteAll = () => {
    if (messages.length === 0) return;
    alert(
      'Delete All Messages',
      'This will permanently delete every message across all your items. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsDeletingAll(true);
            try {
              await messageService.deleteAllMessages(token);
              setMessages([]);
              setExpandedId(null);
              setSelectedItemId(null);
            } catch (err) {
              alert('Error', err.message || 'Could not delete your messages.');
            } finally {
              setIsDeletingAll(false);
            }
          },
        },
      ]
    );
  };

  const handleMenuPress = (message) => {
    setMenuMessage(message);
  };

  const renderMessage = ({ item: message }) => {
    const relatedItem = itemsById[message.item_id];
    const isUnread = !message.read_by_owner;
    const isExpanded = expandedId === message.id;
    const hasLocation = message.location_lat != null && message.location_lng != null;

    return (
      <TouchableOpacity
        style={[styles.card, isUnread && styles.cardUnread]}
        onPress={() => handleToggleExpand(message)}
        activeOpacity={0.9}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.thumbnailWrap}>
            {relatedItem?.item_photo_url ? (
              <Image source={{ uri: relatedItem.item_photo_url }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Image
                  source={getCategoryIcon(relatedItem?.category)}
                  style={styles.thumbnailIcon}
                  resizeMode="contain"
                />
              </View>
            )}
            {isUnread && <View style={styles.unreadDot} />}
          </View>

          <View style={styles.cardTextWrap}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.presetLabel}>{getPresetLabel(message.preset_type)}</Text>
              <Text style={styles.timeText}>{timeAgo(message.created_at)}</Text>
            </View>
            <Text style={styles.itemName} numberOfLines={1}>
              {relatedItem?.nickname || 'Unknown item'}
            </Text>
            <Text style={styles.messageSnippet} numberOfLines={isExpanded ? undefined : 1}>
              {message.free_text || 'No additional message.'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => handleMenuPress(message)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#9AA5B5" />
          </TouchableOpacity>
        </View>

        {isExpanded && hasLocation && (
          <View style={styles.expandedSection}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => handleViewLocation(message.location_lat, message.location_lng)}
              activeOpacity={0.8}
            >
              <Text style={styles.locationButtonText}>📍 View Location</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (label, isActive, onPress, key) => (
    <TouchableOpacity
      key={key}
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandNavy} />

      <TabScreenHeader
        eyebrow="INBOX"
        title="Messages"
        subtitle={isLoading ? "Loading..." : `${unreadCount} unread notifications`}
      />

      <View style={styles.listBackground}>
        {!isLoading && itemsWithMessages.length > 0 && (
          <View style={styles.filterRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {renderFilterChip('All', selectedItemId === null, () => setSelectedItemId(null), 'all')}
              {itemsWithMessages.map((item) =>
                renderFilterChip(
                  item.nickname || 'Unnamed item',
                  selectedItemId === item.id,
                  () => setSelectedItemId(item.id),
                  item.id
                )
              )}
            </ScrollView>

            {messages.length > 0 && (
              <TouchableOpacity
                style={styles.deleteAllButton}
                onPress={handleDeleteAll}
                disabled={isDeletingAll}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {isDeletingAll ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.brandNavy} />
          </View>
        ) : (
          <FlatList
            data={filteredMessages}
            keyExtractor={(m) => m.id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.brandNavy} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyStateText}>
                  {selectedItemId ? 'No messages for this item' : 'No messages yet'}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {selectedItemId
                    ? 'Try selecting a different item or "All".'
                    : 'When someone finds one of your items, their message will show up here.'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <BottomSheetMenu
        visible={!!menuMessage}
        onClose={() => setMenuMessage(null)}
        options={[
          {
            label: 'Block Sender',
            icon: <Ionicons name="ban-outline" size={18} color="#D32F2F" />,
            destructive: true,
            onPress: () => handleBlockSender(menuMessage),
          },
          {
            label: 'Delete Message',
            icon: <Ionicons name="trash-outline" size={18} color="#D32F2F" />,
            destructive: true,
            onPress: () => handleDeleteMessage(menuMessage),
          },
        ]}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brandNavy },
  listBackground: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: spacing.xl, paddingTop: spacing.md, flexGrow: 1 },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.xl,
    paddingRight: spacing.md,
    paddingTop: spacing.md,
  },
  filterScrollContent: {
    paddingRight: spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: '#F0F4F8',
  },
  chipActive: {
    backgroundColor: colors.brandNavy,
    borderColor: colors.brandNavy,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brandNavy,
  },
  chipTextActive: {
    color: '#fff',
  },
  deleteAllButton: {
    marginLeft: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EAF0FB',
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: '#F0F4F8',
  },
  cardUnread: {
    borderLeftColor: colors.brandGold,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  thumbnailWrap: { position: 'relative', marginRight: 16, marginTop: 4 },
  thumbnail: { width: 40, height: 40, borderRadius: 8 },
  thumbnailPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailIcon: { width: 20, height: 20 },
  unreadDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brandGold,
    borderWidth: 2,
    borderColor: colors.background,
  },

  cardTextWrap: { flex: 1 },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 0.5
  },
  timeText: { fontSize: 11, color: '#9AA5B5', fontWeight: '500' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: colors.brandNavy, marginBottom: 4 },
  messageSnippet: { fontSize: 13, color: '#6B7A93', lineHeight: 18 },

  menuButton: { paddingLeft: 12, paddingBottom: 12, justifyContent: 'center', alignItems: 'center' },

  expandedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  locationButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF0FB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  locationButtonText: { fontSize: 13, color: colors.brandNavy, fontWeight: '700' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyStateText: { fontSize: 18, color: colors.brandNavy, fontWeight: 'bold' },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default MessagesScreen;