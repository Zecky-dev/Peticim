import React from 'react';
import { View, Text } from 'react-native';
import { OnBoardingSlide } from 'types/global';
import styles from './OnBoardingScreen.style';
import { Button, Icon } from '@components';
import colors from '@utils/colors';

type OnBoardingScreenProps = {
  data: OnBoardingSlide;
  onButtonPress: () => void;
};

const OnBoardingScreen = ({ data, onButtonPress }: OnBoardingScreenProps) => {
  const { icon, title, subTitle, buttonText } = data;

  return (
    <View style={styles.slideContainer}>
      <View style={styles.slideContentContainer}>
        <View style={{ alignItems: 'center' }}>
          <Icon
            name={icon.name}
            type={icon.type as any}
            size={icon.size}
            color={icon.color}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
      <View style={styles.slideButtonContainer}>
        <Button
          labelColor={colors.black}
          backgroundColor={colors.white}
          label={buttonText}
          onPress={onButtonPress}
        />
      </View>
    </View>
  );
};

export default OnBoardingScreen;
