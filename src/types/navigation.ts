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

  type AdoptionStackParamList = {
    Adoptions: undefined;
    AdoptionDetails: { data: ListingItem };
  }

  type RootStackParamList = {
    Auth: undefined;
    App: undefined;
  };
}

export {};
