import { auth } from './firebase';

let confirmation: any = null;

export const sendPhoneOTP = async (phoneNumber: string) => {
  try {
    confirmation = await auth.signInWithPhoneNumber(`+90${phoneNumber}`);
    return confirmation;
  } catch (err) {
    console.error('OTP gönderilemedi:', err);
    throw err;
  }
};

export const verifyPhoneOtp = async (code: string) => {
  if (!confirmation) throw new Error('Önce OTP gönderilmelidir.');
  try {
    await confirmation.confirm(code);
    return true;
  } catch (err) {
    console.error('Kod hatalı:', err);
    throw err;
  }
};
