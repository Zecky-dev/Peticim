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
    publicId: string;
    uploadedAt: Date;
  }[];
  photoURLs?: string[];
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
  };
  surname: string;
}
