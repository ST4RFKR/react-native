import { RootState } from "../store";
import { clearLocalCheckpoints, clearLocalCheckpointsPhotos, clearLocalData, setLastSync } from "../store/slices/localSlice";
import { deleteImage } from "./RNFS";

import { uploadToCloudinary } from "./uploadToCloudinary";


export const syncCheckpoints = async (
  createCheckpoint: any,createCheckpointPhoto: any,  dispatch: any, getState: () => RootState) => {
  try {
    const state = getState();
    const checkpoints = state.local.checkpoints;
    const checkpointPhotos = state.local.checkpointPhotos;
    
    const results = {
      synced: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const checkpoint of checkpoints) {
      try {
        const photosForCheckpoint = checkpointPhotos.filter(
          (p) => p.checkpointId === checkpoint.id
        );

        const uploadedPhotoUrls: string[] = [];

        // 1. Завантажуємо всі фото з обробкою помилок
        for (const photo of photosForCheckpoint) {
          try {
            const url = await uploadToCloudinary(photo.url);
            if (url) {
              uploadedPhotoUrls.push(url);
            }
          } catch (photoError) {
            console.warn(`⚠️ Не вдалося завантажити фото ${photo.url}:`, photoError);
            // Продовжуємо без цього фото
          }
        }

        // 2. Створюємо чекпоінт
        const checkpointResponse = await createCheckpoint({
          type: checkpoint.type,
          timestamp: checkpoint.timestamp,
          vehicleId: checkpoint.vehicleId,
          userId: checkpoint.userId,
          locationId: checkpoint.locationId,
        });

        if (checkpointResponse.error) {
          throw new Error(`Не вдалося створити чекпоінт: ${checkpointResponse.error}`);
        }

        const createdCheckpointId = checkpointResponse.data.id;

        // 3. Прив'язуємо фото з обробкою помилок
        const photoPromises = uploadedPhotoUrls.map(async (url) => {
          try {
            return await createCheckpointPhoto({
              checkpointId: createdCheckpointId,
              url,
            });
          } catch (error) {
            console.warn(`⚠️ Не вдалося прив'язати фото ${url}:`, error);
            return null;
          }
        });

        await Promise.allSettled(photoPromises);

        // 4. Видаляємо локальні дані тільки після успішної синхронізації
        for (const photo of photosForCheckpoint) {
          try {
            await deleteImage(photo.url);

            //TODO: Видалити фото з стору
            // dispatch(removeCheckpointPhoto(photo));
          } catch (error) {
            console.warn(`⚠️ Не вдалося видалити локальне фото:`, error);
          }
        }

        results.synced++;
        dispatch(setLastSync(new Date().toISOString()));
        dispatch(clearLocalCheckpoints());
        dispatch(clearLocalCheckpointsPhotos());


      } catch (checkpointError) {
        console.error(`❌ Помилка синхронізації чекпоінта ${checkpoint.id}:`, checkpointError);
        results.failed++;
        results.errors.push(`Checkpoint ${checkpoint.id}: ${checkpointError}`);
      }
    }

    return { 
      success: results.failed === 0, 
      results,
      error: results.errors.length > 0 ? results.errors : undefined 
    };

  } catch (error) {
    console.error('❌ Критична помилка під час синхронізації:', error);
    return { success: false, error };
  }
};