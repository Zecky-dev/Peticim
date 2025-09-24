interface PickerItem {
  label: string;
  value: string;
}

interface ListingItem {
  id: string;
  animalBreed: string;
  animalType: string;
  createdAt: Date;
  description: string;
  images: {
    url: string;
    publicId: string;
    uploadedAt: Date;
  }[];
  phone: string;
  sterilized?: boolean;
  vaccinated?: boolean;
  title: string;
  userId: string;
  age?: number;
  address: {
    city: string;
    district: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
  };
  views: number;
  isApproved: boolean;
}

interface User {
  address: {
    formattedAddress: string;
    latitude: number;
    longitude: number;
  };
  bio: string;
  createdAt: Date;
  email: string;
  name: string;
  phone: string;
  profilePicture: {
    publicId: string;
    uploadedAt: Date;
    url: string;
  };
  surname: string;
  favorites: string[];
  isBanned: boolean;
  role: 'user' | 'admin'
}

type LocationState = {
  cities: PickerItem[];
  districts: PickerItem[];
  neighborhoods: PickerItem[];
  selectedCity: PickerItem | null;
  selectedDistrict: PickerItem | null;
  selectedNeighborhood: PickerItem | null;
};

interface Filter {
  field: string;
  operator: '<' | '<=' | '==' | '!=' | '>' | '>=' | 'array-contains' | 'in';
  value: any;
}
