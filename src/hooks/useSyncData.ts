// hooks/useSyncData.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';


import { useGetLocationsQuery } from '../store/api/locationApi';
import { useGetEmployeeCardsQuery } from '../store/api/employeeCardApi';
import { useGetUsersQuery } from '../store/api/users';
import { useGetVehiclesQuery } from '../store/api/vehicle';
import { setEmployeeCards, setLastSync, setLocations, setUsers, setVehicles } from '../store/slices/localSlice';



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