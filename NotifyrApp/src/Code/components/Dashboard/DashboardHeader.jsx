import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DashboardHeader = ({ 
  user, 
  activeCount, 
  lostItems, 
  unlinkedCount, 
  isDndEnabled, 
  handleToggleDnd, 
  isDndSaving, 
  hasUnread, 
  onNotificationPress 
}) => {
  return (
    <View style={styles.glassyHeader}>
      <View style={styles.headerTop}>
        <View style={styles.userInfo}>
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.greeting} numberOfLines={1}>{user?.name || 'User'}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.bellButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={hasUnread ? "notifications" : "notifications-outline"} 
            size={22} 
            color={hasUnread ? "#FFB800" : "#0A1931"} 
          />
          {hasUnread && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.headerBottom}>
        <View style={styles.compactStatsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.statText}>{activeCount} Active</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.statText}>{lostItems} Lost</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#A0B3D6' }]} />
            <Text style={styles.statText}>{unlinkedCount} Unlinked</Text>
          </View>
        </View>

        <View style={styles.dndMiniToggle}>
          <Text style={styles.dndText}>DND</Text>
          <Switch
            value={isDndEnabled}
            onValueChange={handleToggleDnd}
            disabled={isDndSaving}
            trackColor={{ false: '#E2E8F0', true: '#FFB800' }}
            thumbColor="#fff"
            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glassyHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(10, 25, 49, 0.05)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(10, 25, 49, 0.10)',
    borderTopWidth: 0,
    shadowColor: '#0A1931',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
    paddingRight: 12,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(10, 25, 49, 0.55)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  greeting: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#0A1931',
    letterSpacing: -0.5,
  },
  bellButton: { 
    padding: 10,
    backgroundColor: '#FFFFFF', 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(10, 25, 49, 0.10)',
    shadowColor: '#0A1931',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: '#FFB800',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(10, 25, 49, 0.10)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A1931',
  },
  dndMiniToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    paddingLeft: 12, 
    paddingRight: 4,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(10, 25, 49, 0.10)',
  },
  dndText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A1931',
    letterSpacing: 0.5,
    marginRight: 2,
  },
});

export default DashboardHeader;