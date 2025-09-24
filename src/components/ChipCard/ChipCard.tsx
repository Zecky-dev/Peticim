import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './ChipCard.style';

type ChipCardProps = {
  text: string;
  icon?: React.ReactNode;
  onSelect: (value: any) => void;
  isSelected: boolean
};

const ChipCard = ({ icon, text, onSelect, isSelected }: ChipCardProps) => {
  return (
    <TouchableOpacity onPress={onSelect} style={[styles.container, isSelected && styles.selectedContainer]}>
      {icon}
      <Text style={[styles.text, isSelected && styles.selectedText]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ChipCard;
