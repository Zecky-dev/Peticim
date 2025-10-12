import { StyleSheet } from 'react-native';
import colors from '@utils/colors';
export default StyleSheet.create({
  container: { flex: 1 },
  webviewContainer: { flex: 1 },
  webview: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    padding: 12,
    gap: 12,
    backgroundColor: colors.black_50,
  },
});
