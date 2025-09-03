import { StyleSheet } from 'react-native';
import colors from '@utils/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  phoneInput: {
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    fontFamily: 'Comfortaa-Bold',
    color: colors.primary,
    fontSize: 16,
  },
  loginButtonText: {
    fontFamily: 'Comfortaa-Bold',
    color: 'white',
    fontSize: 16,
  },
  phoneInputContainer: {
    gap: 4,
  },
  phoneInputLabel: {
    fontFamily: 'Comfortaa-Bold',
    color: colors.black_50,
  },
  errorLabel: {
    color: colors.error,
  },
  errorInput: {
    borderColor: colors.error,
  },
  loginContainer: {
    width: '75%',
    alignSelf: 'center',
    gap: 12,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    alignItems: 'center',
  },
  form: {
    gap: 8,
  },
  actionButtons: {
    marginTop: 4,
    gap: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  forgotPasswordButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotPasswordButtonText: {
    color: colors.primary,
    fontFamily: 'Comfortaa-Bold',
    textDecorationLine: 'underline',
  }
  

});
