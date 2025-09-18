export const generateFirebaseErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi zaten kullanılıyor.';
    case 'auth/invalid-credential':
      return 'E-posta adresi veya şifre yanlış.';
    case 'auth/invalid-email':
      return 'Lütfen geçerli bir e-posta adresi girin.';
    case 'auth/operation-not-allowed':
      return 'E-posta/Şifre ile giriş devre dışı bırakılmış. Lütfen Firebase konsolunuzu kontrol edin.';
    case 'auth/weak-password':
      return 'Şifre en az 6 karakter olmalıdır.';
    case 'auth/user-disabled':
      return 'Kullanıcı hesabı devre dışı bırakılmıştır.';
    case 'auth/wrong-password':
      return 'E-posta veya şifre hatalı.';
    case 'auth/user-not-found':
      return 'Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı.';
    case 'auth/network-request-failed':
      return 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.';
    case 'auth/credential-already-in-use':
      return 'Bu kimlik bilgileri başka bir hesapla zaten kullanılıyor.';
    case 'auth/requires-recent-login':
      return 'Güvenlik nedeniyle, bu işlem için yakın zamanda giriş yapmanız gerekiyor.';
    case 'auth/email-not-verified':
      return 'E-posta adresi doğrulanmamış, e-posta kutunuzu kontrol edin.';
    case 'auth/too-many-requests':
      return 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.';
    case 'auth/internal-error':
      return 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    default:
      return 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.';
  }
};
