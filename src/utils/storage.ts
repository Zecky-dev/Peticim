import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  public async saveItem(key: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, serializedValue);
    } catch (error: any) {
      console.log(`Veri kaydetme hatası (${key}):`, error);
      throw error;
    }
  }

  public async getItem(key: string): Promise<any | null> {
    try {
      const serializedValue = await AsyncStorage.getItem(key);
      if (serializedValue !== null) {
        try {
          return JSON.parse(serializedValue);
        } catch (parseError) {
          return serializedValue;
        }
      }
      return null;
    } catch (error: any) {
      console.log(`Veri okuma hatası (${key}):`, error);
      throw error;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error: any) {
      console.log(`Veri silme hatası (${key}):`, error);
      throw error;
    }
  }
}

export default new Storage();
