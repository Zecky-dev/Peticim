import axiosClient from './client';

const sendVerificationEmail = async (email: string) => {
  try {
    const res = await axiosClient.post('/auth/sendVerificationEmail', {
      email,
    });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Hata:', error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error('Bilinmeyen bir hata oluştu:', error.message);
      throw new Error('Bilinmeyen bir hata oluştu.');
    }
  }
};

const sendPasswordResetEmail = async (email: string) => {
  try {
    const res = await axiosClient.post('/auth/sendPasswordResetEmail', {
      email,
    });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Hata:', error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error('Bilinmeyen bir hata oluştu:', error.message);
      throw new Error('Bilinmeyen bir hata oluştu.');
    }
  }
};

export { sendVerificationEmail, sendPasswordResetEmail };
