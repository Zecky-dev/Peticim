import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import styles from './Loading.style';
import colors from '@utils/colors'

type LoadingProps = {
  isVisible: boolean;
};

const Loading = ({ isVisible }: LoadingProps) => {
  return (
    <Modal isVisible={isVisible} style={styles.modalContainer} animationIn={"fadeIn"} animationOut={"fadeOut"}>
      <View style={styles.modalContentContainer}>
        <ActivityIndicator
          size={"large"}
          color={colors.primary}
          style={styles.loadingIndicator}
        />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    </Modal>
  );
};

export default Loading;
