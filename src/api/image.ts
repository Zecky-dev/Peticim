import axiosClient from './client';

const uploadImages = async (
  images: any[],
  folder: string,
  userId?: string,
  listingId?: string,
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
      },
    });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Upload Error:', error.response.data);
      throw new Error(error.response.data?.error || 'Yükleme başarısız.');
    } else {
      console.error('Bilinmeyen hata:', error.message);
      throw new Error('Bilinmeyen bir hata oluştu.');
    }
  }
};

const classifyAnimal = async (images: any[], token?: string | null) => {
  if (!token) {
    console.error('User token missing, cannot classify animals');
    throw new Error('Kullanıcı doğrulaması yok, işlem yapılamıyor.');
  }
  if (!images || images.length === 0) {
    console.error('No images provided for animal classification');
    throw new Error('Lütfen en az bir resim yükleyin.');
  }

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
    return res.data.results;
  } catch (error: any) {
    console.error(
      'Animal Check Error:',
      error?.response?.data || error.message,
    );
    throw new Error('Hayvan kontrolü başarısız.');
  }
};

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
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Get Error:', error.response.data);
      throw new Error('Resimler getirilirken bir hata meydana geldi.');
    } else {
      console.error('Bilinmeyen hata:', error.message);
      throw new Error('Bilinmeyen bir hata oluştu.');
    }
  }
};

export { uploadImages, getImages, classifyAnimal };
