

import { employeeCardApi } from '../store/api/employeeCardApi';
import { locationApi } from '../store/api/locationApi';
import { userApi } from '../store/api/users';
import { vehicleApi } from '../store/api/vehicle';
import {
  setLocations,
  setEmployeeCards,
  setUsers,
  setVehicles,
  setLastSync,
} from '../store/slices/localSlice';

export const syncDataWithCacheClear = async (dispatch: any) => {
  try {
    console.log('=== НАЧАЛО СИНХРОНИЗАЦИИ С ОЧИСТКОЙ КЕША ===');

    // Очищаем кеш для всех эндпоинтов
    dispatch(locationApi.util.invalidateTags(['Location']));
    dispatch(employeeCardApi.util.invalidateTags(['NFCCard']));
    dispatch(userApi.util.invalidateTags(['User']));
    dispatch(vehicleApi.util.invalidateTags(['Vehicle']));

    // Небольшая задержка для корректной очистки кеша
    await new Promise(resolve => setTimeout(resolve, 100));

    // Теперь выполняем запросы
    const [locationsRes, cardsRes, usersRes, vehiclesRes] = await Promise.all([
      dispatch(locationApi.endpoints.getLocations.initiate()).unwrap(),
      dispatch(employeeCardApi.endpoints.getEmployeeCards.initiate()).unwrap(),
      dispatch(userApi.endpoints.getUsers.initiate()).unwrap(),
      dispatch(vehicleApi.endpoints.getVehicles.initiate()).unwrap(),
    ]);

    console.log('Получены данные с сервера после очистки кеша:');
    console.log('Locations:', locationsRes);
    console.log('Cards:', cardsRes);
    console.log('Users:', usersRes);
    console.log('Vehicles:', vehiclesRes);

    // Сохраняем данные
    if (locationsRes?.data || locationsRes) {
      const locationData = locationsRes.data || locationsRes;
      dispatch(setLocations(locationData));
      console.log('Locations сохранены:', locationData.length);
    }

    if (cardsRes?.data || cardsRes) {
      const cardData = cardsRes.data || cardsRes;
      dispatch(setEmployeeCards(cardData));
      console.log('Employee cards сохранены:', cardData.length);
    }

    if (usersRes?.data || usersRes) {
      const userData = usersRes.data || usersRes;
      dispatch(setUsers(userData));
      console.log('Users сохранены:', userData.length);
    }

    if (vehiclesRes?.data || vehiclesRes) {
      const vehicleData = vehiclesRes.data || vehiclesRes;
      dispatch(setVehicles(vehicleData));
      console.log('Vehicles сохранены:', vehicleData.length);
    }

    dispatch(setLastSync(new Date().toISOString()));

    console.log('=== СИНХРОНИЗАЦИЯ С ОЧИСТКОЙ КЕША ЗАВЕРШЕНА ===');
    return { success: true };
  } catch (err) {
    console.error('=== ОШИБКА СИНХРОНИЗАЦИИ С ОЧИСТКОЙ КЕША ===', err);
    return { success: false, error: err };
  }
};
