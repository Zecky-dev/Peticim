import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@components';
import Modal from 'react-native-modal';
import styles from './Profile.style';
import colors from '@utils/colors';

import { useAuth } from '@context/AuthContext';
import { useImagePicker } from '@hooks/useImagePicker';
import { uploadImages } from '@api/image';
import { useLoading } from '@context/LoadingContext';
import { showToast } from '@config/toastConfig';

import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Profile = () => {
  const { user, logout } = useAuth();
  const { images, setImages, pickFromCamera, pickFromLibrary } =
    useImagePicker();
  const { showLoading, hideLoading } = useLoading();

  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    const handleUserAvatarChange = async () => {
      if (!images || images.length === 0 || !user?.uid) return;
      try {
        setModalVisible(false);
        showLoading();
        const resizedImage = await ImageResizer.createResizedImage(
          images[0].uri as string,
          400,
          400,
          'JPEG',
          100,
        );
        const uploadResult = await uploadImages(
          [resizedImage],
          'profile_images',
          user.uid,
        );
        setAvatarUri(uploadResult.uploadedImages[0].secureUrl);
        showToast({
          type: 'success',
          text1: 'Başarılı',
          text2: 'Profil fotoğrafınız güncellendi.',
        });
      } catch (error: any) {
        showToast({
          type: 'error',
          text1: 'Hata',
          text2: error.message,
        });
      } finally {
        setImages([]);
        hideLoading();
      }
    };
    handleUserAvatarChange();
  }, [images, user?.uid]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={
            avatarUri
              ? { uri: avatarUri }
              : user?.photoURL
              ? { uri: user.photoURL }
              : require('@assets/images/avatar_default.png')
          }
          style={styles.avatar}
        />
        <View style={styles.plusContainer}>
          <Icon name="plus" type="feather" size={14} color={colors.white} />
        </View>
      </TouchableOpacity>
      <View>
        <Text style={styles.nameSurname}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.profileButtons}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AccountDetails')}
          style={styles.profileButton}
        >
          <Icon
            name="person-outline"
            type="ion"
            color={colors.white}
            size={18}
          />

          <Text style={styles.profileButtonText}>Hesap Detaylarım</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => console.log('İlanlarım')}
          style={styles.profileButton}
        >
          <Icon
            name="document-text-outline"
            type="ion"
            color={colors.white}
            size={18}
          />
          <Text style={styles.profileButtonText}>İlanlarım</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={[styles.profileButton, { backgroundColor: colors.error }]}
        >
          <Icon name="logout" type="material" color={colors.white} size={18} />
          <Text style={styles.profileButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      <Modal
        style={styles.modalContainer}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        backdropTransitionOutTiming={1}
        isVisible={modalVisible}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>Kaynak Seçiniz</Text>
          </View>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.optionButton}
              onPress={() => pickFromCamera()}
            >
              <Icon
                name="camera-outline"
                type="ion"
                size={36}
                color={colors.black}
              />
              <Text style={styles.pickOptionText}>Kamera</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.optionButton}
              onPress={() => {
                pickFromLibrary();
              }}
            >
              <Icon
                name="image-outline"
                type="ion"
                size={36}
                color={colors.black}
              />
              <Text style={styles.pickOptionText}>Galeri</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
