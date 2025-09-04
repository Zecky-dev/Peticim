import axiosClient from './client';

const uploadImages = async (images: any[], folder: string, userId?: string) => {
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
    formData.append('userId', userId);
    const res = await axiosClient.post('/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error: any) {
    console.log('HATA', error);
    if (error.response) {
      console.error('Upload Error:', error.response.data);
      throw new Error(error.response.data?.error || 'Yükleme başarısız.');
    } else {
      console.error('Bilinmeyen hata:', error.message);
      throw new Error('Bilinmeyen bir hata oluştu.');
    }
  }
};

// Düzenlenecek..
const getImages = async (publicIds: string[], token: string) => {
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
    return res.data.urls;
  } catch (error: any) {
    if (error.response) {
      console.error('Get Error:', error.response.data);
      throw new Error(error.response.data?.error || 'Resimler alınamadı.');
    } else {
      console.error('Bilinmeyen hata:', error.message);
      throw new Error('Bilinmeyen bir hata oluştu.');
    }
  }
};

export { uploadImages, getImages };
