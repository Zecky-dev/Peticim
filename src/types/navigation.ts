declare global {
  type AuthStackParamList = {
    Login: { prefilledEmail?: string };
    Register: undefined;
    ForgotPassword: { prefilledEmail?: string };
  };

  type RootStackParamList = {
    Auth: undefined;
    App: undefined;
  };
}

export {};
