import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch, StatusBar } from 'react-native';
import RNFS from 'react-native-fs';
import RNShare from 'react-native-share';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from "../../hooks/useAuth";
import * as authService from '../../services/authService';
import { alert } from '../../utils/alert';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import TabScreenHeader from '../../components/TabScreenHeader';
import { colors, spacing, shadows } from '../../theme/theme';

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

const SettingsScreen = ({ navigation }) => {
  const { logout, user, token, updateUser } = useAuth();

  const [isDndEnabled, setIsDndEnabled] = useState(
    !!parseDndSchedule(user?.global_dnd_schedule)?.enabled
  );
  const [isDndSaving, setIsDndSaving] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsDndEnabled(!!parseDndSchedule(user?.global_dnd_schedule)?.enabled);
  }, [user?.global_dnd_schedule]);

  const handleLogout = () => {
    alert("Log Out", "Are you sure you want to log out of Notifyr?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        }
      }
    ]);
  };

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

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function titleCase(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatExportedData(data) {
  const lines = [];
  lines.push('NOTIFYR — YOUR DATA EXPORT');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('========================================');
  lines.push('');

  // ACCOUNT
  if (data.user) {
    const u = data.user;
    lines.push('ACCOUNT');
    lines.push('----------------------------------------');
    lines.push(`Name: ${formatValue(u.name)}`);
    lines.push(`Email: ${formatValue(u.email)} ${u.email_verified ? '(verified)' : '(unverified)'}`);
    lines.push(`Phone: ${formatValue(u.phone)}`);
    if (u.created_at) lines.push(`Member since: ${new Date(u.created_at).toLocaleDateString()}`);
    lines.push('');
  }

  // ITEMS
  if (Array.isArray(data.items)) {
    lines.push(`ITEMS (${data.items.length})`);
    lines.push('----------------------------------------');
    data.items.forEach((item, i) => {
      lines.push(`${i + 1}. ${formatValue(item.nickname)} — ${formatValue(item.category)}`);
      lines.push(`   Status: ${formatValue(item.status)}`);
      lines.push(`   Tag linked: ${item.qr_id ? 'Yes' : 'No'}`);
      if (item.details && Object.keys(item.details).length) {
        Object.entries(item.details).forEach(([k, v]) => {
          lines.push(`   ${titleCase(k)}: ${formatValue(v)}`);
        });
      }
      if (item.private_details && Object.keys(item.private_details).length) {
        Object.entries(item.private_details).forEach(([k, v]) => {
          lines.push(`   ${titleCase(k)}: ${formatValue(v)}`);
        });
      }
      if (item.created_at) {
        lines.push(`   Registered: ${new Date(item.created_at).toLocaleDateString()}`);
      }
      lines.push('');
    });
  }

  // MESSAGES — kept generic since exact field names weren't visible in
  // the confirmed API response; this handles whatever shape comes back
  // without silently dropping data.
  if (Array.isArray(data.messages)) {
    lines.push(`MESSAGES (${data.messages.length})`);
    lines.push('----------------------------------------');
    data.messages.forEach((msg, i) => {
      lines.push(`${i + 1}.`);
      Object.entries(msg).forEach(([k, v]) => {
        lines.push(`   ${titleCase(k)}: ${formatValue(v)}`);
      });
      lines.push('');
    });
  }

  // ANY OTHER TOP-LEVEL SECTIONS (e.g. blocked_devices) — generic
  // fallback so nothing in the export is silently lost.
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'user' || key === 'items' || key === 'messages') return;
    if (Array.isArray(value)) {
      lines.push(`${titleCase(key).toUpperCase()} (${value.length})`);
      lines.push('----------------------------------------');
      value.forEach((entry, i) => {
        lines.push(`${i + 1}.`);
        if (entry && typeof entry === 'object') {
          Object.entries(entry).forEach(([k, v]) => {
            lines.push(`   ${titleCase(k)}: ${formatValue(v)}`);
          });
        } else {
          lines.push(`   ${formatValue(entry)}`);
        }
        lines.push('');
      });
    }
  });

  lines.push('========================================');
  return lines.join('\n');
}


const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await authService.exportMyData(token);
      const readableText = formatExportedData(data);

      const fileName = `notifyr-data-export-${Date.now()}.txt`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
      await RNFS.writeFile(filePath, readableText, 'utf8');

      await RNShare.open({
        title: 'Notifyr Data Export',
        url: `file://${filePath}`,
        type: 'text/plain',
        failOnCancel: false,
      });
    } catch (err) {
      if (err?.message !== 'User did not share') {
        alert('Export Failed', err.message || 'Could not export your data.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authService.deleteAccount(token);
      setShowDeleteModal(false);
      await logout();
    } catch (err) {
      setIsDeleting(false);
      alert('Error', err.message || 'Could not delete your account.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const SettingsRow = ({ icon, title, subtitle, onPress, rightElement, isDestructive }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        {icon && <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : colors.brandNavy} style={styles.rowIcon} />}
        <View>
          <Text style={[styles.rowTitle, isDestructive && styles.destructiveText]}>{title}</Text>
          {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement ? rightElement : <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandNavy} />
      
      {/* Integrated Shared Tab Header */}
      <TabScreenHeader 
        eyebrow="ACCOUNT" 
        title="Settings" 
      />

      <View style={styles.scrollBackground}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Notifyr User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'No email provided'}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfileScreen')}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* PREFERENCES SECTION */}
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.sectionBody}>
            <SettingsRow
              title="Global Do Not Disturb"
              subtitle="Pause all scan notifications"
              rightElement={
                <Switch
                  value={isDndEnabled}
                  onValueChange={handleToggleDnd}
                  disabled={isDndSaving}
                  trackColor={{ false: "#EAF0FB", true: colors.brandNavy }}
                  thumbColor={colors.background}
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              title="Push Notifications"
              subtitle="Alerts when a tag is scanned"
              rightElement={
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={setIsNotificationsEnabled}
                  trackColor={{ false: "#EAF0FB", true: colors.brandNavy }}
                  thumbColor={colors.background}
                />
              }
            />
          </View>

          {/* ACCOUNT & SECURITY SECTION */}
          <Text style={styles.sectionTitle}>ACCOUNT & SECURITY</Text>
          <View style={styles.sectionBody}>
            <SettingsRow icon="lock-closed-outline" title="Reset Password" onPress={() => navigation.navigate('ResetPasswordScreen')} />
            <View style={styles.divider} />
            <SettingsRow icon="shield-checkmark-outline" title="Blocked Senders" onPress={() => navigation.navigate('BlockedDevicesScreen')} />
            <View style={styles.divider} />
            <SettingsRow
              icon="download-outline"
              title={isExporting ? "Exporting..." : "Export My Data"}
              onPress={isExporting ? undefined : handleExportData}
            />
          </View>

          {/* SUPPORT SECTION */}
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.sectionBody}>
            <SettingsRow icon="help-circle-outline" title="Help & FAQ" onPress={() => navigation.navigate('HelpFaqScreen')} />
            <View style={styles.divider} />
            <SettingsRow icon="mail-outline" title="Contact Us" onPress={() => navigation.navigate('ContactUsScreen')} />
          </View>

          {/* DANGER ZONE (Logout + Delete Account) */}
          <View style={[styles.sectionBody, styles.dangerZone]}>
            <SettingsRow
              icon="log-out-outline"
              title="Log Out"
              onPress={handleLogout}
              isDestructive={true}
              rightElement={<View/>}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="trash-outline"
              title="Delete Account"
              onPress={() => setShowDeleteModal(true)}
              isDestructive={true}
              rightElement={<View/>}
            />
          </View>

        </ScrollView>
      </View>

      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brandNavy },
  scrollBackground: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, paddingBottom: 50 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: '#F0F4F8',
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    backgroundColor: colors.brandNavy, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: colors.background },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: colors.brandNavy },
  profileEmail: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  editButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: colors.background, borderRadius: 24, borderWidth: 1, borderColor: '#EAF0FB' },
  editButtonText: { color: colors.brandNavy, fontWeight: '700', fontSize: 13 },

  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#9AA5B5', 
    marginBottom: 12, 
    letterSpacing: 1.5, 
    marginLeft: 4, 
    textTransform: 'uppercase' 
  },
  sectionBody: { 
    backgroundColor: colors.surfaceLight, 
    borderRadius: 20, 
    marginBottom: 32, 
    overflow: 'hidden', 
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: '#F0F4F8', 
  },
  
  row: { flexDirection: 'row', alignItems: 'center', padding: 18, justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: 16 },
  rowTitle: { fontSize: 16, color: colors.brandNavy, fontWeight: '600' },
  rowSubtitle: { fontSize: 12, color: '#9AA5B5', marginTop: 4 },
  
  divider: { height: 1, backgroundColor: '#F0F4F8', marginLeft: 20 },
  dangerZone: { marginTop: 10 },
  destructiveText: { color: '#EF4444', fontWeight: 'bold' },
});

export default SettingsScreen;