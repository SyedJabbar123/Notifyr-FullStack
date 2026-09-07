import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import ItemCard from '../../components/Dashboard/ItemCard';
import FloatingActionButton from '../../components/Dashboard/FloatingActionButton';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import * as authService from '../../services/authService';
import * as messageService from '../../services/messageService';
import { getCategoryIcon } from '../../constants/categories';
import { registerForPushNotifications, listenForForegroundMessages } from '../../services/pushService';
import { alert } from '../../utils/alert';

const ALL_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function parseDndSchedule(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
}

const DashboardScreen = ({ navigation }) => {
  const { token, user, updateUser } = useAuth();
  const { items: activeItems, loading: isLoading, fetchItems } = useItems();

  const [hasUnread, setHasUnread] = useState(false);
  const [isDndEnabled, setIsDndEnabled] = useState(
    !!parseDndSchedule(user?.global_dnd_schedule)?.enabled
  );
  const [isDndSaving, setIsDndSaving] = useState(false);

  useEffect(() => {
    setIsDndEnabled(!!parseDndSchedule(user?.global_dnd_schedule)?.enabled);
  }, [user?.global_dnd_schedule]);

  useEffect(() => {
    registerForPushNotifications(token);
    const unsubscribe = listenForForegroundMessages(() => {
      setHasUnread(true);
    });
    return unsubscribe;
  }, [token]);

  const fetchUnreadStatus = useCallback(async () => {
    try {
      const data = await messageService.listMessages(token);
      const messages = data.messages || data;
      setHasUnread(messages.some((m) => !m.read_by_owner));
    } catch (err) {
      console.error('Failed to check unread messages:', err);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
      fetchUnreadStatus();
    }, [fetchItems, fetchUnreadStatus])
  );

  const handleToggleDnd = async (value) => {
    setIsDndEnabled(value); 
    setIsDndSaving(true);
    try {
      const schedule = {
        enabled: value,
        days: ALL_DAYS,
        startHour: 0,
        endHour: 23,
      };
      await authService.setGlobalDnd(schedule, token);
      updateUser({ global_dnd_schedule: schedule });
    } catch (err) {
      setIsDndEnabled(!value);
      alert('Error', err.message || 'Could not update Do Not Disturb.');
    } finally {
      setIsDndSaving(false);
    }
  };

  const handleAddItem = () => {
    navigation.navigate('CategorySelection', { activeItems });
  };

  const handleItemPress = (item) => {
    navigation.navigate('ItemDetail', { itemId: item.id });
  };

  // --- LOCAL STATS CALCULATION ---
  const totalItems = activeItems?.length || 0;
  const taggedItems = activeItems?.filter(i => i.qr_id).length || 0;
  const lostItems = activeItems?.filter(i => i.status === 'lost').length || 0; 
  const activeCount = taggedItems - lostItems;
  const unlinkedCount = totalItems - taggedItems;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FD" />
      
      {/* THE NEW EXTRACTED HEADER */}
      <DashboardHeader 
        user={user}
        activeCount={activeCount}
        lostItems={lostItems}
        unlinkedCount={unlinkedCount}
        isDndEnabled={isDndEnabled}
        handleToggleDnd={handleToggleDnd}
        isDndSaving={isDndSaving}
        hasUnread={hasUnread}
        onNotificationPress={() => navigation.navigate('Messages')}
      />

      <View style={styles.listBackground}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#0A1931" />
          </View>
        ) : (
          <FlatList
            data={activeItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeaderRow}>
                <Text style={styles.sectionLabel}>YOUR ITEMS</Text>
                <Text style={styles.listCountLabel}>{totalItems} registered</Text>
              </View>
            }
            renderItem={({ item }) => {
              const displayItem = {
                ...item,
                categoryIcon: getCategoryIcon(item.category),
                status: item.qr_id ? 'active' : 'pending',
                unreadCount: 0,
              };
              return <ItemCard item={displayItem} onPress={() => handleItemPress(displayItem)} />;
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Text style={styles.emptyIcon}>🛡️</Text>
                </View>
                <Text style={styles.emptyStateText}>Nothing registered yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Tap the + button below to protect your first item.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <FloatingActionButton onPress={handleAddItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },
  listBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 24, 
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9AA5B5',
    letterSpacing: 1.5,
  },
  listCountLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9AA5B5',
  },
  listContainer: { 
    padding: 20, 
    paddingTop: 0,
    paddingBottom: 110, 
    flexGrow: 1 
  },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F7F9FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(10, 25, 49, 0.1)',
  },
  emptyIcon: { fontSize: 32 },
  emptyStateText: { fontSize: 18, color: '#0A1931', fontWeight: 'bold' },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8A94A6',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default DashboardScreen;