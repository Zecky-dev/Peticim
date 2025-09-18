import axiosClient from './client';

const uploadImages = async (
  images: any[],
  folder: string,
  userId?: string,
  listingId?: string | null,
  token?: string | null,
) => {
  try {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('files', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `photo_${index}.jpg`,
      } as any);
    });
    formData.append('folder', folder);
    if (userId) formData.append('userId', userId);
    if (listingId) formData.append('listingId', listingId);
    const res = await axiosClient.post('/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('UPLOAD_IMAGE_ERROR', error);
  }
};

const classifyAnimal = async (images: any[], token?: string | null) => {
  if (!token || images.length === 0) return null;
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

const getImages = async (publicIds: string[], token?: string | null) => {
  try {
    const res = await axiosClient.post(
      '/image',
      { publicIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    console.error('GET_IMAGES_ERROR', error);
  }
};

const deleteImages = async (
  userId: string,
  listingId: string,
  token: string,
) => {
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

export { uploadImages, getImages, classifyAnimal, deleteImages };
