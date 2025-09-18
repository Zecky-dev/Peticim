import { showToast } from '@config/toastConfig';
import axiosClient from './client';

const sendVerificationEmail = async (email: string) => {
  try {
    const res = await axiosClient.post('/auth/sendVerificationEmail', {
      email,
    });
    return res.data;
  } catch (error: any) {
    console.error('SEND_VERIFICATION_EMAIL_ERROR', error);
    showToast({
      type: 'error',
      text1: 'Hata',
      text2: error.message,
    });
  }
};

const sendPasswordResetEmail = async (email: string) => {
  try {
    const res = await axiosClient.post('/auth/sendPasswordResetEmail', {
      email,
    });
    return res.data;
  } catch (error: any) {
    console.error('SEND_PASSWORD_RESET_EMAIL_ERROR', error);
  }
};

export { sendVerificationEmail, sendPasswordResetEmail };
