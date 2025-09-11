import axiosClient from "./client";

// ------------------ Şehirleri Getir ------------------
export const getCities = async () => {
  try {
    const res = await axiosClient.get("/location/cities");
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Get Cities Error:", error.response.data);
      throw new Error(error.response.data?.error || "Şehirler alınamadı.");
    } else {
      console.error("Bilinmeyen hata:", error.message);
      throw new Error("Bilinmeyen bir hata oluştu.");
    }
  }
};

// ------------------ İlçeleri Getir ------------------
export const getDistricts = async (provinceId: number) => {
  try {
    const res = await axiosClient.get("/location/districts", {
      params: { provinceId },
    });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Get Districts Error:", error.response.data);
      throw new Error(error.response.data?.error || "İlçeler alınamadı.");
    } else {
      console.error("Bilinmeyen hata:", error.message);
      throw new Error("Bilinmeyen bir hata oluştu.");
    }
  }
};

// ------------------ Mahalleleri Getir ------------------
export const getNeighborhoods = async (districtId: number) => {
  try {
    const res = await axiosClient.get("/location/neighborhoods", {
      params: { districtId },
    });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Get Neighborhoods Error:", error.response.data);
      throw new Error(error.response.data?.error || "Mahalleler alınamadı.");
    } else {
      console.error("Bilinmeyen hata:", error.message);
      throw new Error("Bilinmeyen bir hata oluştu.");
    }
  }
};

// ------------------ Lat/Lng Getir ------------------
export const getCoordinates = async (
  city: string,
  district: string,
  neighborhood: string
) => {
  try {
    const res = await axiosClient.get("/location/coordinates", {
      params: { city, district, neighborhood },
    });
    return res.data; // { latitude, longitude }
  } catch (error: any) {
    if (error.response) {
      console.error("Get Coordinates Error:", error.response.data);
      throw new Error(error.response.data?.error || "Koordinatlar alınamadı.");
    } else {
      console.error("Bilinmeyen hata:", error.message);
      throw new Error("Bilinmeyen bir hata oluştu.");
    }
  }
};
