import React, { useState } from 'react';
import {
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import styles from './Picker.style';
import Icon from '@components/Icon';
import colors from '@utils/colors';
import Alert from '@components/Alert';

type PickerProps = {
  label: string;
  items: PickerItem[];
  value?: string | number | null;
  error?: string;
  onSelect: (value: any) => void;
};

const Picker = ({ label, items, value, error, onSelect }: PickerProps) => {
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const selectedItem = items.find(item => item.value === value);

  return (
    <>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerButtonContainer}>
          <Text style={styles.pickerLabel}>{label}</Text>
          <Pressable
            onPress={() => setPickerModalVisible(true)}
            style={styles.pickerButton}
          >
            <Text
              style={[
                styles.pickerButtonText,
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
              size={18}
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
          <FlatList
            data={items}
            keyExtractor={(_, i) => i.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={styles.pickerModalItem}
                onPress={() => {
                  onSelect(item);
                  setPickerModalVisible(false);
                }}
              >
                <Text style={styles.pickerModalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

export default Picker;
