import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/CustomInput';
import ScreenHeader from '../../components/ScreenHeader';
import { launchImageLibrary } from 'react-native-image-picker';
import * as itemService from '../../services/itemService';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import { colors, spacing, shadows } from '../../theme/theme';

const AddItemFormScreen = ({ route, navigation }) => {
  const { token } = useAuth();
  const { addItem: addSharedItem, updateItem: updateSharedItem } = useItems();
  const { categoryId, categoryName, existingItem } = route.params;

  const [nickname, setNickname] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [rawImageFile, setRawImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingItem) {
      setNickname(existingItem.nickname || '');
      setImageUri(existingItem.item_photo_url || null);

      let parsedDetails = existingItem.details || {};
      let parsedPrivate = existingItem.private_details || {};

      try {
        if (typeof parsedDetails === 'string') parsedDetails = JSON.parse(parsedDetails);
        if (typeof parsedPrivate === 'string') parsedPrivate = JSON.parse(parsedPrivate);
      } catch (e) {
        console.error('Error parsing details:', e);
      }

      setBrand(parsedDetails?.brand || '');
      setColor(parsedDetails?.color || '');
      setSerialNumber(parsedPrivate?.serialNumber || '');
    }
  }, [existingItem]);

  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          console.log(response.errorMessage);
          return;
        }

        if (response.assets?.length) {
          const image = response.assets[0];
          setImageUri(image.uri);
          setRawImageFile(image);
        }
      }
    );
  };

  const handleContinue = async () => {
    if (!nickname.trim()) {
      alert('Missing Nickname', 'Please enter a nickname for this item.');
      return;
    }

    if (!rawImageFile && !imageUri) {
      alert('Missing Photo', 'Please select an image for this item.');
      return;
    }

    setIsLoading(true);

    try {
      let liveImageUrl = imageUri;

      if (rawImageFile) {
        liveImageUrl = await itemService.uploadImage(rawImageFile, categoryId);
      }

      const itemPayload = {
        id: existingItem?.id,
        category: categoryId,
        nickname,
        item_photo_url: liveImageUrl,
        details: {
          brand,
          color,
        },
      };

      if (serialNumber.trim()) {
        itemPayload.private_details = {
          serialNumber,
        };
      }

      const savedItem = await itemService.saveItem(itemPayload, token);

      if (!existingItem) {
        addSharedItem({ ...itemPayload, id: savedItem?.id });
        navigation.navigate('QRScannerScreen', {
          itemId: savedItem?.id,
          nickname,
        });
      } else {
        updateSharedItem({ ...existingItem, ...itemPayload, id: existingItem.id });
        navigation.goBack();
      }
    } catch (err) {
      alert('Error', err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
        <View style={styles.contentWrapper}>
          <ScreenHeader 
            title={`Register ${categoryName}`}
            onBackPress={() => navigation.goBack()}
          />

          <Text style={styles.subtitle}>Enter details for your {categoryId}</Text>

          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleSelectImage} activeOpacity={0.8}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholder}>
                  <View style={styles.cameraIconCircle}>
                    <Ionicons name="camera-outline" size={24} color={colors.brandNavy} />
                    <View style={styles.plusBadge}>
                      <Ionicons name="add" size={12} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={styles.placeholderText}>Add photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <CustomInput
            label="Nickname"
            placeholder="e.g., My Bag"
            value={nickname}
            onChangeText={setNickname}
            icon="pricetag-outline"
          />

          {(categoryId === 'laptop' || categoryId === 'mobile') && (
            <>
              <CustomInput
                label="Brand"
                placeholder={categoryId === 'mobile' ? 'e.g., Apple, Samsung' : 'e.g., Apple, HP'}
                value={brand}
                onChangeText={setBrand}
                icon="flash-outline"
              />

              <CustomInput
                label="Color"
                placeholder={categoryId === 'mobile' ? 'e.g., Titanium' : 'e.g., Silver'}
                value={color}
                onChangeText={setColor}
                icon="color-palette-outline"
              />

              <CustomInput
                label={categoryId === 'mobile' ? 'IMEI (Private)' : 'Serial Number (Private)'}
                placeholder="Optional"
                value={serialNumber}
                onChangeText={setSerialNumber}
                icon="lock-closed-outline"
              />
            </>
          )}

          {(categoryId === 'bag' ||
            categoryId === 'keys' ||
            categoryId === 'wallet' ||
            categoryId === 'bottle') && (
            <>
              <CustomInput
                label="Brand"
                placeholder={
                  categoryId === 'bag'
                    ? 'e.g., Apple, Tumi'
                    : categoryId === 'keys'
                    ? 'e.g., House Keys'
                    : categoryId === 'wallet'
                    ? 'e.g., Leather Wallet'
                    : 'e.g., Water Bottle'
                }
                value={brand}
                onChangeText={setBrand}
                icon="flash-outline"
              />

              <CustomInput
                label="Color"
                placeholder={
                  categoryId === 'bag'
                    ? 'e.g., Space Gray'
                    : categoryId === 'keys'
                    ? 'Blue keychain attached'
                    : categoryId === 'wallet'
                    ? 'Brown leather with initials'
                    : 'Blue stainless steel bottle'
                }
                value={color}
                onChangeText={setColor}
                icon="color-palette-outline"
              />
            </>
          )}

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
              onPress={handleContinue}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {existingItem ? 'Update Item' : 'Continue to QR Scan'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: { 
    paddingHorizontal: spacing.xl,
    paddingBottom: 160, 
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  subtitle: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginBottom: spacing.xl, 
    fontWeight: '500', 
  },
  imageContainer: { 
    alignItems: 'center', 
    marginBottom: spacing.lg, 
  },
  imagePickerButton: {
    width: 120, 
    height: 120, 
    borderRadius: 60,
    backgroundColor: '#F8FAFC', 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden', 
    borderWidth: 1.5, 
    borderColor: colors.brandNavy, 
    borderStyle: 'dashed',
    ...shadows.subtle,
  },
  previewImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover', 
  },
  placeholder: { 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  cameraIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.brandNavy,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  placeholderText: { 
    color: colors.brandNavy, 
    fontWeight: '700', 
    fontSize: 12, 
  },
  buttonWrapper: { 
    marginTop: spacing.xl, 
  },
  primaryButton: {
    backgroundColor: colors.brandNavy,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floatingCard,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddItemFormScreen;