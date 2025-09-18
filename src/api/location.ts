import axiosClient from './client';

// ------------------ Şehirleri Getir ------------------
export const getCities = async () => {
  try {
    const res = await axiosClient.get('/location/cities');
    return res.data;
  } catch (error: any) {
    console.error('GET_CITIES_ERROR', error);
  }
};

// ------------------ İlçeleri Getir ------------------
export const getDistricts = async (provinceId: number) => {
  try {
    const res = await axiosClient.get('/location/districts', {
      params: { provinceId },
    });
    return res.data;
  } catch (error: any) {
    console.error('GET_DISTRICTS_ERROR', error);
  }
};

// ------------------ Mahalleleri Getir ------------------
export const getNeighborhoods = async (districtId: number) => {
  try {
    const res = await axiosClient.get('/location/neighborhoods', {
      params: { districtId },
    });
    return res.data;
  } catch (error: any) {
    console.error('GET_NEIGHBORHOODS_ERROR', error);
  }
};

export const getCoordinates = async (
  city: string,
  district: string,
  neighborhood: string,
) => {
  try {
    const res = await axiosClient.get('/location/coordinates', {
      params: { city, district, neighborhood },
    });
    return res.data;
  } catch (error: any) {
    console.error('GET_COORDINATES_ERROR', error);
  }
};
