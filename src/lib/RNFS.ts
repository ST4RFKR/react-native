import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { generateUniqueId } from './generateUniqueId';



const IMAGES_FOLDER = `${RNFS.DocumentDirectoryPath}/myAppImages`;


// Создать папку, если её ещё нет
export const ensureImagesFolderExists = async () => {
  try {
    const exists = await RNFS.exists(IMAGES_FOLDER);
    if (!exists) {
      await RNFS.mkdir(IMAGES_FOLDER);
    }
  } catch (error) {
    console.error('❌ Помилка при створенні папки для зображень:', error);
  }
};

// Сохранить изображение по локальному URI (например, из камеры или галереи)
export const saveImageLocally = async (sourceUri: string): Promise<string> => {
  try {
    await ensureImagesFolderExists();
    const localCheckpointId = generateUniqueId();
    const fileName = `${localCheckpointId}.jpg`;
    const destPath = `${IMAGES_FOLDER}/${fileName}`;

    await RNFS.copyFile(sourceUri, destPath);

    // На Android лучше добавить префикс file:// для корректного отображения пути
    return Platform.OS === 'android' ? `file://${destPath}` : destPath;
  } catch (error) {
    console.error('❌ Помилка при збереженні зображення:', error);
    throw error;
  }
};

// Удалить файл по пути
export const deleteImage = async (filePath: string) => {
  try {
    const exists = await RNFS.exists(filePath);
    if (exists) {
      await RNFS.unlink(filePath);
    }
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
  }
};

/**
 * Повертає список усіх файлів у папці myAppImages
 */
export const listLocalImages = async (): Promise<string[]> => {
  try {
    const files = await RNFS.readDir(IMAGES_FOLDER);
    return files.map(file => file.path);
  } catch (error) {
    console.error('❌ Помилка при читанні зображень:', error);
    return [];
  }
};
/**
 * Очистити всю папку зображень (видалити всі файли)
 */
export const clearAllImages = async (): Promise<void> => {
  try {
    const files = await RNFS.readDir(IMAGES_FOLDER);
    for (const file of files) {
      await RNFS.unlink(file.path);
    }
  } catch (error) {
    console.error('❌ Помилка при очищенні папки зображень:', error);
  }
};