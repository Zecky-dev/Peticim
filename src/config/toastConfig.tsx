import { View } from 'react-native';
import Toast, {
  BaseToast,
  SuccessToast,
  ErrorToast,
  ToastConfig,
  ToastConfigParams,
  ToastProps,
  ToastShowParams,
} from 'react-native-toast-message';
import colors from '@utils/colors';
import { Icon } from '@components';

const COMMON_TOAST_STYLES = {
  container: {
    borderLeftWidth: 0,
    borderRadius: 4,
  },
  contentContainer: {
    borderLeftWidth: 0,
    marginLeft: 0,
    paddingLeft: 0,
  },
  text1Style: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  text2Style: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  iconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
};

type ToastDuration = 'short' | 'medium' | 'long';
const DURATION_MAP: Record<ToastDuration, number> = {
  short: 1500,
  medium: 2000,
  long: 3000,
};

export const toastConfig: ToastConfig = {
  success: (props: ToastConfigParams<ToastProps>) => (
    <SuccessToast
      {...props}
      style={{
        ...COMMON_TOAST_STYLES.container,
        backgroundColor: colors.success_green,
      }}
      contentContainerStyle={COMMON_TOAST_STYLES.contentContainer}
      text1Style={COMMON_TOAST_STYLES.text1Style}
      text2Style={COMMON_TOAST_STYLES.text2Style}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      renderLeadingIcon={() => (
        <View style={COMMON_TOAST_STYLES.iconContainer}>
          <Icon name="checkmark" size={24} type="ion" color={'white'} />
        </View>
      )}
    />
  ),
  error: (props: ToastConfigParams<ToastProps>) => (
    <ErrorToast
      {...props}
      style={{
        ...COMMON_TOAST_STYLES.container,
        backgroundColor: colors.error,
      }}
      contentContainerStyle={COMMON_TOAST_STYLES.contentContainer}
      text1Style={COMMON_TOAST_STYLES.text1Style}
      text2Style={COMMON_TOAST_STYLES.text2Style}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      renderLeadingIcon={() => (
        <View style={COMMON_TOAST_STYLES.iconContainer}>
          <Icon name="close" size={24} type="antdesign" color={'white'} />
        </View>
      )}
    />
  ),
  warning: (props: ToastConfigParams<ToastProps>) => (
    <BaseToast
      {...props}
      style={{
        ...COMMON_TOAST_STYLES.container,
        backgroundColor: colors.warning_orange,
      }}
      contentContainerStyle={COMMON_TOAST_STYLES.contentContainer}
      text1Style={COMMON_TOAST_STYLES.text1Style}
      text2Style={COMMON_TOAST_STYLES.text2Style}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      renderLeadingIcon={() => (
        <View style={COMMON_TOAST_STYLES.iconContainer}>
          <Icon name="warning" size={24} type="antdesign" color={'white'} />
        </View>
      )}
    />
  ),
  info: (props: ToastConfigParams<ToastProps>) => (
    <BaseToast
      {...props}
      style={{
        ...COMMON_TOAST_STYLES.container,
        backgroundColor: colors.info,
      }}
      contentContainerStyle={COMMON_TOAST_STYLES.contentContainer}
      text1Style={COMMON_TOAST_STYLES.text1Style}
      text2Style={COMMON_TOAST_STYLES.text2Style}
      text1NumberOfLines={2}
      text2NumberOfLines={4}
      renderLeadingIcon={() => (
        <View style={COMMON_TOAST_STYLES.iconContainer}>
          <Icon
            name="information-circle"
            size={24}
            type="ion"
            color={'white'}
          />
        </View>
      )}
    />
  ),
};

export const showToast = (
  params: Omit<ToastShowParams, 'topOffset' | 'visibilityTime'> & {
    duration?: ToastDuration;
  },
) => {
  const { duration = 'medium', ...rest } = params;

  Toast.show({
    visibilityTime: DURATION_MAP[duration],
    ...rest,
  });
};
