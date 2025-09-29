import axiosClient from './client';
import { getValidToken } from '@utils/functions';

const uploadImages = async (
  images: any[],
  folder: string,
  userId?: string,
  listingId?: string | null,
) => {
  try {
    const token = await getValidToken();
    if (!token) return;
    const formData = new FormData();
    formData.append('folder', folder);
    if (userId) formData.append('userId', userId);
    if (listingId) formData.append('listingId', listingId);
    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `photo_${index}.jpg`,
      } as any);
    });
    const res = await axiosClient.post('/image/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('UPLOAD_IMAGE_ERROR', error);
  }
};

const classifyAnimal = async (images: any[]) => {
  const token = await getValidToken();
  if (!token || !images) return;
  try {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `photo_${index}.jpg`,
      } as any);
    });
    const res = await axiosClient.post('/image/classifyAnimal', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.results || null;
  } catch (error: any) {
    console.error('CLASSIFY_ANIMAL_ERROR', error);
    return null;
  }
};

const deleteImages = async (userId: string, listingId: string) => {
  const token = await getValidToken();
  if (!userId || !listingId) return;
  try {
    const res = await axiosClient.post(
      '/image/delete',
      { userId, listingId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data;
  } catch (err: any) {
    console.error(
      'DELETE_IMAGES_ERROR error:',
      err.response?.data || err.message,
    );
  }
};

export { uploadImages, classifyAnimal, deleteImages };
