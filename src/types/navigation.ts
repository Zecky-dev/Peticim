import { ListingItem, User } from "./global";

declare global {
  type AuthStackParamList = {
    Login: { prefilledEmail?: string };
    Register: undefined;
    ForgotPassword: { prefilledEmail?: string };
  };

  type ProfileStackParamList = {
    Profile: undefined;
    AccountDetails: undefined;
    MyAdoptionListings: undefined;
  };

  type AdoptionStackParamList = {
    Adoptions: { shouldRefresh?: boolean };
    AdoptionDetails: { data: ListingItem; shouldRefresh?: boolean };
    AdoptionOwnerProfile: { ownerData: User | null }
  };

  type RootTabParamList = {
    AdoptionStacks: AdoptionStackParamList;
    AddAdoption: { shouldRefresh?: boolean };
    ProfileStack: ProfileStackParamList;
  };

  type RootStackParamList = {
    Auth: undefined;
    App: undefined;
  };
}

export {};
