// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text, TouchableRipple, Card, Button, Portal,
  Dialog, List, TextInput, Snackbar
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store';

import NetInfo from '@react-native-community/netinfo';
import { Location } from '../store/types/location';
import MenuButtons from '../shared/components/MenuButtons';
import { useSyncData } from '../../hooks/useSyncData';
import { updateConnectionStatus, updateSelectedLocation } from '../store/slices/appSlice';
import NetworkIndicator from '../shared/components/NetworkIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: any) {
  const [showObjectModal, setShowObjectModal] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const dispatch = useAppDispatch();

  // Отримуємо дані з локального сховища
  const { locations } = useAppSelector(state => state.local);

  const { currentLocation } = useAppSelector(state => state.app);

  // Запускаємо синхронізацію
  useSyncData();

  // Перевірка підключення до інтернету
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      dispatch(updateConnectionStatus(state.isConnected ?? false));
      if (!state.isConnected) {
        setSnackbarVisible(true);
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Фільтрація локацій
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(object =>
        object.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        object.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
    console.log(AsyncStorage.getItem('persist:root'));

  }, [locations, searchQuery]);

  const selectObject = (object: Location) => {
    dispatch(updateSelectedLocation(object));
    setSearchQuery('');
    setShowObjectModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Індикатор офлайн режиму */}
      <NetworkIndicator />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {isOnline ? 'Синхронізовано з сервером' : 'Ви в офлайн-режимі'}
      </Snackbar>

      {/* Вибір об'єкта */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="labelMedium">Поточний об'єкт:</Text>
          <TouchableRipple
            onPress={() => setShowObjectModal(true)}
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <View style={styles.objectSelector}>
              <Text variant="bodyMedium">
                {currentLocation ? currentLocation.name : "Оберіть об'єкт"}
              </Text>
              <Text variant="bodyMedium">
                {currentLocation ? currentLocation.address : 'Натисніть для вибору'}
              </Text>
            </View>
          </TouchableRipple>
        </Card.Content>
      </Card>

      {/* Меню доступне тільки після вибору об'єкта */}
      {currentLocation ? (
        <View >
          <MenuButtons navigation={navigation} selectedObject={currentLocation} />
        </View>
      ) : (
        <View style={styles.noObjectContainer}>
          <Text variant="bodyLarge" style={styles.noObjectText}>
            Оберіть об'єкт для продовження роботи
          </Text>
        </View>
      )}

      {/* Модальне вікно вибору об'єкта */}
      <Portal>
        <Dialog
          visible={showObjectModal}
          onDismiss={() => setShowObjectModal(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Оберіть об'єкт</Dialog.Title>

          {/* Поле пошуку */}
          <Dialog.Content>
            <TextInput
              mode="outlined"
              placeholder="Пошук об'єктів..."
              left={<TextInput.Icon icon="magnify" />}
              style={styles.searchInput}
              onChangeText={setSearchQuery}
              value={searchQuery}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              textContentType="none"
            />
          </Dialog.Content>

          {/* Список об'єктів */}
          <Dialog.ScrollArea style={styles.dialogScroll}>
            <List.Section style={styles.listSection}>
              {filteredLocations?.length > 0 ? (
                filteredLocations?.map((object) => (
                  <List.Item
                    key={object.id}
                    title={object.name}
                    description={object.address}
                    onPress={() => selectObject(object)}
                    titleStyle={styles.listItemTitle}
                    descriptionStyle={styles.listItemDescription}
                    style={styles.listItem}
                    left={props => <List.Icon {...props} icon="office-building" />}
                  />
                ))
              ) : (
                <View >
                  <Text >Нічого не знайдено</Text>
                </View>
              )}
            </List.Section>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={() => setShowObjectModal(false)}>Скасувати</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingVertical: 20,
  },
  card: {
    marginBottom: 10,
  },
  objectSelector: {
    paddingVertical: 10,
  },
  noObjectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noObjectText: {
    textAlign: 'center',
    color: '#666',
  },
  dialogContent: {
    paddingHorizontal: 24,
  },
  objectCard: {
    marginBottom: 10,
  },
  dialog: {
    maxHeight: '80%',
    borderRadius: 12,
  },
  dialogScroll: {
    paddingHorizontal: 0,
    maxHeight: 400,
  },
  searchInput: {
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  listSection: {
    padding: 0,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  listItemDescription: {
    fontSize: 14,
    color: '#666',
  },
});