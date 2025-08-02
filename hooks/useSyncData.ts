// hooks/useSyncData.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetLocationsQuery } from '../src/store/api/locationApi';
import { useGetEmployeeCardsQuery } from '../src/store/api/employeeCardApi';
import { useGetUsersQuery } from '../src/store/api/users';
import { setEmployeeCards, setLastSync, setLocations, setUsers, setVehicles } from '../src/store/slices/localSlice';
import { useGetVehiclesQuery } from '../src/store/api/vehicle';


export const useSyncData = () => {
  const dispatch = useDispatch();
  
  const { data: locations, isSuccess: locationsSuccess } = useGetLocationsQuery();
  const { data: employeeCards, isSuccess: employeeCardsSuccess } = useGetEmployeeCardsQuery();
  const { data: users, isSuccess: usersSuccess } = useGetUsersQuery();
  const { data: vehicles, isSuccess: VehiclesSuccess } = useGetVehiclesQuery();

  useEffect(() => {
    if (locationsSuccess && locations) {
      dispatch(setLocations(locations));
    }
  }, [locations, locationsSuccess, dispatch]);

  useEffect(() => {
    if (employeeCardsSuccess && employeeCards) {
      dispatch(setEmployeeCards(employeeCards));
    }
  }, [employeeCards, employeeCardsSuccess, dispatch]);

  useEffect(() => {
    if (usersSuccess && users) {
      dispatch(setUsers(users));
    }
  }, [users, usersSuccess, dispatch]);
    useEffect(() => {
    if (VehiclesSuccess && vehicles) {
      dispatch(setVehicles(vehicles));
    }
  }, [vehicles, VehiclesSuccess, dispatch]);

  useEffect(() => {
    if (locationsSuccess && employeeCardsSuccess && usersSuccess) {
      dispatch(setLastSync(new Date().toISOString()));
    }
  }, [locationsSuccess, employeeCardsSuccess, usersSuccess, dispatch]);
};