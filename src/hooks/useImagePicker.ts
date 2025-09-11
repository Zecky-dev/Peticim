import { useState } from 'react';
import {
  launchImageLibrary,
  launchCamera,
  Asset,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';

export const useImagePicker = () => {
  const [images, setImages] = useState<Asset[]>([]);

  const pickFromLibrary = async (options?: ImageLibraryOptions) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 8,
        ...options,
      });

      if (result.didCancel) return;
      if (result.assets) {
        setImages(result.assets);
        return result.assets;
      }
    } catch (error) {
      console.log('PICK_IMAGE_FROM_GALLERY_ERROR:', error);
    }
  };

  const pickFromCamera = async (options?: CameraOptions) => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        ...options,
      });

      if (result.didCancel) return;
      if (result.assets) setImages(result.assets);
    } catch (error) {
      console.log('PICK_IMAGE_FROM_CAMERA_ERROR:', error);
    }
  };

  return {
    images,
    pickFromLibrary,
    pickFromCamera,
    setImages,
  };
};
