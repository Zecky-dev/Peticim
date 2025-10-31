import React, { useState, useMemo } from 'react';
import {
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import styles from './Picker.style';
import Icon from '@components/Icon';
import colors from '@utils/colors';
import Alert from '@components/Alert';

type PickerItem = {
  label: string;
  value: string | number;
};

type PickerProps = {
  label: string;
  items: PickerItem[];
  value?: string | number | null;
  error?: string;
  onSelect: (value: any) => void;
  additionalStyles?: {
    pickerContainer?: ViewStyle;
    pickerButton?: ViewStyle;
    pickerButtonText?: TextStyle;
    pickerLabel?: TextStyle;
    iconSize?: number;
  };
};

const Picker = ({
  label,
  items,
  value,
  error,
  onSelect,
  additionalStyles,
}: PickerProps) => {
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const selectedItem = items.find(item => item.value === value);

  // Arama metnine göre filtreleme
  const filteredItems = useMemo(() => {
    const lower = searchText.toLowerCase();
    return items.filter(i => i.label.toLowerCase().includes(lower));
  }, [searchText, items]);

  return (
    <>
      <View style={styles.pickerButtonContainer}>
        <View style={[styles.pickerContainer, additionalStyles?.pickerContainer]}>
          <Text style={[styles.pickerLabel, additionalStyles?.pickerLabel]}>{label}</Text>
          <Pressable
            onPress={() => setPickerModalVisible(true)}
            style={[styles.pickerButton, additionalStyles?.pickerButton]}
          >
            <Text
              style={[
                styles.pickerButtonText,
                additionalStyles?.pickerButtonText,
                !value && { color: colors.black_50 },
              ]}
            >
              {selectedItem
                ? selectedItem.label
                : `Lütfen ${label.toLowerCase()} seçiniz..`}
            </Text>
            <Icon
              name="caret-down"
              type="ion"
              color={colors.black_50}
              size={additionalStyles?.iconSize || 18}
            />
          </Pressable>
        </View>
        {error && <Alert withIcon={false} message={error} />}
      </View>

      <Modal
        isVisible={pickerModalVisible}
        style={styles.pickerModalContainer}
        onBackdropPress={() => setPickerModalVisible(false)}
        onBackButtonPress={() => setPickerModalVisible(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropTransitionOutTiming={1}
        hideModalContentWhileAnimating={false}
      >
        <View style={styles.pickerContentContainer}>
          {/* 🔍 Arama inputu */}
          <View style={styles.searchContainer}>
            <Icon name="search" type="ion" size={18} color={colors.black_50} />
            <TextInput
              placeholder={`${label} ara...`}
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              placeholderTextColor={colors.black_50}
            />
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={(_, i) => i.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerModalItem}
                onPress={() => {
                  onSelect(item);
                  setPickerModalVisible(false);
                  setSearchText('');
                }}
              >
                <Text style={styles.pickerModalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

export default Picker;
