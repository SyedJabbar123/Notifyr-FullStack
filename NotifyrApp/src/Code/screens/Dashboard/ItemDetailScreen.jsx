import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import * as itemService from '../../services/itemService';
import QrTagIcon from '../../components/Dashboard/QrTagIcon';
import ScreenHeader from '../../components/ScreenHeader';
import BottomSheetMenu from '../../components/BottomSheetMenu';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';
import { getCategoryIcon, getCategoryName } from '../../constants/categories';

const STATUS_STYLES = {
  active: { label: 'Active', color: '#1E9E5A', bg: '#E4F7EC' },
  dnd: { label: 'Do Not Disturb', color: '#B8860B', bg: '#FDF3DC' },
  lost: { label: 'Lost', color: '#D32F2F', bg: '#FDECEA' },
  deactivated: { label: 'Deactivated', color: '#666666', bg: '#EEEEEE' },
  notLinked: { label: 'Not Linked', color: '#888888', bg: '#EFEFEF' },
};

const ItemDetailScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { token } = useAuth();
  const { updateItem: updateSharedItem, removeItem } = useItems();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUnbinding, setIsUnbinding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fetchItem = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await itemService.getItem(itemId, token);
      setItem(data);
      updateSharedItem(data);
    } catch (err) {
      alert('Error', err.message || 'Could not load item.');
    } finally {
      setIsLoading(false);
    }
  }, [itemId, token, updateSharedItem]);

  useFocusEffect(
    useCallback(() => {
      fetchItem();
    }, [fetchItem])
  );

  const handleChangeStatus = async (newStatus) => {
    if (!item || item.status === newStatus) return;
    setIsUpdatingStatus(true);
    try {
      await itemService.updateStatus(item.id, newStatus, token);
      const updated = { ...item, status: newStatus };
      setItem(updated);
      updateSharedItem(updated);
    } catch (err) {
      alert('Update Failed', err.message || 'Could not update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUnbindQr = () => {
    alert(
      'Unlink Tag',
      'Are you sure you want to unlink the Notifyr tag from this item? You can link it again later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            setIsUnbinding(true);
            try {
              await itemService.unbindQr(item.id, token);
              const updated = { ...item, qr_id: null, status: 'notLinked' };
              setItem(updated);
              updateSharedItem(updated);
              alert('Success', 'Notifyr tag has been successfully unlinked.');
            } catch (err) {
              alert('Error', err.message || 'Could not unbind the tag.');
            } finally {
              setIsUnbinding(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteItem = () => {
    setShowMenu(false);
    alert(
      'Delete Item',
      `This will permanently delete "${item.nickname}"${
        item.qr_id ? ' and free its linked tag' : ''
      }. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await itemService.deleteItem(item.id, token, { qrId: item.qr_id });
              removeItem(item.id);
              navigation.goBack();
            } catch (err) {
              alert('Error', err.message || 'Could not delete this item.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddItemForm', {
      categoryId: item.category,
      categoryName: getCategoryName(item.category),
      existingItem: item,
    });
  };

  const handleLinkQr = () => {
    navigation.navigate('QRScannerScreen', {
      itemId: item.id,
      nickname: item.nickname,
    });
  };

  if (isLoading || !item) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.brandNavy} />
      </SafeAreaView>
    );
  }

  const details = typeof item.details === 'string' ? JSON.parse(item.details || '{}') : item.details || {};
  const privateDetails =
    typeof item.private_details === 'string'
      ? JSON.parse(item.private_details || '{}')
      : item.private_details || {};

  const statusInfo = item.qr_id
    ? (STATUS_STYLES[item.status] || STATUS_STYLES.active)
    : STATUS_STYLES.notLinked;

  const categoryIconName = getCategoryIcon(item.category);
  const categoryDisplayName = getCategoryName(item.category);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <ScreenHeader
            onBackPress={() => navigation.goBack()}
          />
          <TouchableOpacity
            onPress={() => setShowMenu(true)}
            style={styles.menuButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={isDeleting}
          >
            <Ionicons name="ellipsis-vertical" size={22} color={colors.brandNavy} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.imageWrapper}>
            {item.item_photo_url ? (
              <Image source={{ uri: item.item_photo_url }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name={categoryIconName} size={64} color={colors.brandNavy} />
              </View>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.titleRow}>
              <View style={styles.categoryIconWrap}>
                <Ionicons name={categoryIconName} size={22} color={colors.brandNavy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nickname}>{item.nickname}</Text>
                <Text style={styles.categoryLabel}>{categoryDisplayName}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
              </View>
            </View>

            {(details.brand || details.color) && (
              <View style={styles.detailsSection}>
                {details.brand ? (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Brand</Text>
                    <Text style={styles.detailValue}>{details.brand}</Text>
                  </View>
                ) : null}
                {details.color ? (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Color</Text>
                    <Text style={styles.detailValue}>{details.color}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {privateDetails.serialNumber ? (
              <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Serial Number</Text>
                  <Text style={styles.detailValue}>{privateDetails.serialNumber}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.detailsSection}>
              <View style={styles.tagContainerRow}>
                <View style={styles.tagRow}>
                  <QrTagIcon linked={!!item.qr_id} size={18} />
                  <Text style={styles.tagText}>
                    {item.qr_id ? `Tag ID: ${item.qr_id}` : 'No tag linked yet'}
                  </Text>
                </View>
                {item.qr_id && (
                  <TouchableOpacity 
                    onPress={handleUnbindQr} 
                    disabled={isUnbinding}
                    style={styles.unlinkButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {isUnbinding ? (
                      <ActivityIndicator size="small" color="#D32F2F" />
                    ) : (
                      <Text style={styles.unlinkText}>Unlink Tag</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {!item.qr_id && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleLinkQr} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Link a Notifyr Tag</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleEdit} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>Edit Item</Text>
          </TouchableOpacity>

          {item.qr_id ? (
            <View style={styles.statusSection}>
              <Text style={styles.sectionTitle}>Set Status</Text>
              <View style={styles.statusOptionsRow}>
                {['active', 'dnd', 'lost'].map((statusKey) => {
                  const isActive = item.status === statusKey;
                  const info = STATUS_STYLES[statusKey];
                  return (
                    <TouchableOpacity
                      key={statusKey}
                      style={[
                        styles.statusOption,
                        { borderColor: info.color },
                        isActive && { backgroundColor: info.color },
                      ]}
                      onPress={() => handleChangeStatus(statusKey)}
                      disabled={isUpdatingStatus}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.statusOptionText, { color: isActive ? '#fff' : info.color }]}>
                        {info.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.statusSection}>
              <Text style={styles.statusHint}>Link a Notifyr tag to enable status controls.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <BottomSheetMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        options={[
          {
            label: 'Delete Item',
            icon: <Ionicons name="trash-outline" size={18} color="#D32F2F" />,
            destructive: true,
            onPress: handleDeleteItem,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  contentWrapper: { flex: 1, paddingHorizontal: spacing.xl, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 50 },

  headerRow: { position: 'relative' },
  menuButton: {
    position: 'absolute',
    top: spacing.lg,
    right: 0,
    padding: 4,
    zIndex: 10,
  },

  imageWrapper: { alignItems: 'center', marginTop: 5, marginBottom: 20 },
  image: { width: 220, height: 220, borderRadius: 16, backgroundColor: '#E8EDF2' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },

  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: '#F0F4F8',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  categoryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nickname: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  categoryLabel: { fontSize: 13, color: '#888', textTransform: 'capitalize', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },

  detailsSection: { borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 12, paddingTop: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailLabel: { fontSize: 13, color: '#888', fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  tagContainerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tagText: { fontSize: 13.5, color: '#333', fontWeight: '600', letterSpacing: 0.3 },
  unlinkButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  unlinkText: { fontSize: 13, color: '#D32F2F', fontWeight: 'bold' },

  primaryButton: {
    backgroundColor: colors.brandNavy,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...shadows.floatingCard,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.brandNavy,
  },
  secondaryButtonText: { color: colors.brandNavy, fontSize: 15, fontWeight: 'bold' },

  statusSection: { marginTop: 28 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10, textTransform: 'uppercase' },
  statusHint: { fontSize: 13, color: '#888', fontStyle: 'italic' },
  statusOptionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statusOption: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  statusOptionText: { fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
});

export default ItemDetailScreen;