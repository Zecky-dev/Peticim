declare global {
  type AuthStackParamList = {
    Login: { prefilledEmail?: string };
    Register: undefined;
    ForgotPassword: { prefilledEmail?: string };
  };

  type ProfileStackParamList = {
    Profile: undefined;
    AccountDetails: undefined;
  }

  type RootStackParamList = {
    Auth: undefined;
    App: undefined;
  };
}

export {};
