import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, CircleButton, Icon } from '@components';
import { useAuth } from '@context/AuthContext';
import { useImagePicker } from '@hooks/useImagePicker';
import { useLoading } from '@context/LoadingContext';
import { useNavigation } from '@react-navigation/native';
import { uploadImages } from '@api/image';
import { showToast } from '@config/toastConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import styles from './Profile.style';
import colors from '@utils/colors';

const Profile = () => {
  const { userDetails, refreshUserDetails, logout } = useAuth();
  const { images, setImages, pickFromCamera, pickFromLibrary } =
    useImagePicker();
  const { showLoading, hideLoading } = useLoading();

  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [donateModalVisible, setDonateModalVisible] = useState(false);

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

  const sendContactEmail = () => {
    try {
      Linking.openURL('mailto:peticimapp@gmail.com');
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'Hata',
        text2: 'E-posta gönderimi sırasında bir hata oluştu.',
      });
    }
  };

  useEffect(() => {
    const handleUserAvatarChange = async () => {
      if (!images || images.length === 0 || !userDetails?.id) return;
      try {
        setModalVisible(false);
        showLoading();
        const uploadResult = await uploadImages(
          [images[0]],
          'profile_images',
          userDetails.id,
          null,
        );
        setAvatarUri(uploadResult.uploadedImages[0].url);
        showToast({
          type: 'success',
          text1: 'Başarılı',
          text2: 'Profil fotoğrafınız güncellendi.',
        });
        refreshUserDetails();
      } catch (error: any) {
        showToast({
          type: 'error',
          text1: 'Hata',
          text2:
            'Profil fotoğrafı değiştirilirken bir hata meydana geldi, tekrar deneyiniz.',
          duration: 'medium',
        });
      } finally {
        setImages([]);
        hideLoading();
      }
    };
    handleUserAvatarChange();
  }, [images, userDetails?.id]);

  console.log('USER_DETAILS', userDetails);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={
            avatarUri
              ? { uri: avatarUri }
              : userDetails?.profilePicture?.url
              ? { uri: userDetails.profilePicture.url }
              : require('@assets/images/avatar_default.png')
          }
          style={styles.avatar}
        />
        <View style={styles.plusContainer}>
          <Icon name="plus" type="feather" size={18} color={colors.white} />
        </View>
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.nameSurname}>
          {userDetails?.name} {userDetails?.surname}
        </Text>
        <Text style={styles.email}>{userDetails?.email}</Text>
      </View>

      <View style={styles.profileButtons}>
        <Button
          label="Hesap Detaylarım"
          onPress={() => navigation.navigate('AccountDetails')}
          icon={
            <Icon
              name="person-outline"
              type="ion"
              color={colors.white}
              size={18}
            />
          }
          additionalStyles={{
            label: styles.profileButtonText,
            container: styles.profileButton,
          }}
        />
        <Button
          label="İlanlarım"
          onPress={() => navigation.navigate('MyAdoptionListings')}
          icon={
            <Icon
              name="document-text-outline"
              type="ion"
              color={colors.white}
              size={18}
            />
          }
          additionalStyles={{
            label: styles.profileButtonText,
            container: styles.profileButton,
          }}
        />
        <Button
          label="Bize Ulaş"
          onPress={sendContactEmail}
          icon={
            <Icon
              name="mail-outline"
              type="ion"
              color={colors.white}
              size={18}
            />
          }
          additionalStyles={{
            label: styles.profileButtonText,
            container: styles.profileButton,
          }}
          backgroundColor={colors.info}
        />
        <Button
          label="Bağış Yap"
          onPress={() => setDonateModalVisible(true)}
          icon={<Icon name="heart" type="ion" color={colors.white} size={18} />}
          additionalStyles={{
            label: styles.profileButtonText,
            container: styles.profileButton,
          }}
          backgroundColor={colors.error}
        />

        <Button
          label="Çıkış Yap"
          onPress={handleLogout}
          outline={true}
          icon={
            <Icon
              name="logout"
              type="material"
              color={colors.error}
              size={18}
            />
          }
          additionalStyles={{
            label: styles.profileButtonText,
            container: styles.profileButton,
          }}
          backgroundColor={colors.error}
        />
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
              onPress={() =>
                pickFromCamera({
                  maxWidth: 400,
                  maxHeight: 400,
                  mediaType: 'photo',
                })
              }
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
                pickFromLibrary({
                  maxWidth: 400,
                  maxHeight: 400,
                  mediaType: 'photo',
                });
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

      <Modal
        isVisible={donateModalVisible}
        style={styles.donateModalContainer}
        onBackButtonPress={() => setDonateModalVisible(false)}
        onBackdropPress={() => setDonateModalVisible(false)}
      >
        <View style={styles.donateModalContentContainer}>
          <View style={{ position: 'absolute', right: 8, top: 8 }}>
            <CircleButton
              onPress={() => setDonateModalVisible(false)}
              iconColor={colors.black_50}
              iconName="close-outline"
              iconType="ion"
              size={32}
              iconSize={28}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end', gap: 12 }}>
            <Text style={styles.donateModalText}>
              Eğer projeye veya geliştiriciye destek olmak isterseniz mesajınız
              ile birlikte küçük bir bağış yapabilirsiniz 🏠❤️🐈
            </Text>
            <Button
              backgroundColor={colors.success}
              label="Bağış Yap"
              onPress={() => {
                Linking.openURL('https://buymeacoffee.com/zeckydev');
                setDonateModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;
