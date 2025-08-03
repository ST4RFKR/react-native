import { Alert } from "react-native";

export const uploadToCloudinary = async (uri: string) => {
    const data = new FormData();

    data.append('file', {
      uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    data.append('upload_preset', 'reactnative_unsigned');
    data.append('cloud_name', 'dsxw2jobt');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dsxw2jobt/image/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed', err);
      Alert.alert('Помилка', 'Не вдалося завантажити фото');
      return null;
    }
  };