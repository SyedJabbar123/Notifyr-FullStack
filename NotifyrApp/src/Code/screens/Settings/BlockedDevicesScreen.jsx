import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import * as blockService from '../../services/blockService';
import ScreenHeader from '../../components/ScreenHeader';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const BlockedDevicesScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState(null);

  const loadBlocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await blockService.listBlocks(token);
      setBlocks(data.blocks || data);
    } catch (err) {
      alert('Error', err.message || 'Could not load blocked senders.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadBlocks();
    }, [loadBlocks])
  );

  const handleUnblock = (block) => {
    alert(
      'Unblock Sender?',
      `They'll be able to message you about "${block.item_nickname || 'this item'}" again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unblock',
          onPress: async () => {
            setUnblockingId(block.id);
            try {
              await blockService.unblockDevice(block.id, token);
              setBlocks((prev) => prev.filter((b) => b.id !== block.id));
            } catch (err) {
              alert('Error', err.message || 'Could not unblock this sender.');
            } finally {
              setUnblockingId(null);
            }
          },
        },
      ]
    );
  };

  const renderBlock = ({ item: block }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {block.item_nickname || 'Unknown item'}
        </Text>
        <Text style={styles.blockedDate}>Blocked on {formatDate(block.blocked_at)}</Text>
      </View>

      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(block)}
        disabled={unblockingId === block.id}
        activeOpacity={0.8}
      >
        {unblockingId === block.id ? (
          <ActivityIndicator size="small" color={colors.brandNavy} />
        ) : (
          <Text style={styles.unblockText}>Unblock</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScreenHeader 
          title="Blocked Senders"
          onBackPress={() => navigation.goBack()}
        />

        <Text style={styles.subtitle}>People who can no longer message you</Text>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.brandNavy} />
          </View>
        ) : (
          <FlatList
            data={blocks}
            keyExtractor={(b) => b.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={renderBlock}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Text style={styles.emptyIcon}>🚫</Text>
                </View>
                <Text style={styles.emptyStateText}>No blocked senders</Text>
                <Text style={styles.emptyStateSubtext}>
                  Anyone you block from a message will show up here.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  contentWrapper: { 
    flex: 1,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  subtitle: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginTop: spacing.xs,
    marginBottom: spacing.lg, 
    fontWeight: '500', 
  },
  listContainer: { 
    paddingBottom: spacing.xl, 
    flexGrow: 1, 
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: '#F0F4F8',
  },
  cardInfo: { 
    flex: 1, 
    marginRight: 12, 
  },
  itemName: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
  },
  blockedDate: { 
    fontSize: 12.5, 
    color: colors.textSecondary, 
    marginTop: 3, 
  },
  unblockButton: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 76,
    alignItems: 'center',
  },
  unblockText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: colors.brandNavy, 
  },
  emptyState: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 80, 
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EAF0FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: { 
    fontSize: 32, 
  },
  emptyStateText: { 
    fontSize: 18, 
    color: '#1A1A1A', 
    fontWeight: 'bold', 
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default BlockedDevicesScreen;