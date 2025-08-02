"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Text, Button, Card } from "react-native-paper"
import NfcScanner from "../shared/components/NfcScanner"
import ManualTagInput from "../shared/components/ManualTagInput"
import PhotoCapture from "../shared/components/PhotoCapture"
import { useAppSelector } from "../store"
import { useCreateCheckpointMutation } from "../store/api/checkpointApi"
import NetInfo from '@react-native-community/netinfo';
import { useCreateCheckpointPhotoMutation } from "../store/api/checkpointPhotoApi"

interface RegisterTechnicScreenProps {
  navigation: any
}

export default function RegisterTechnicScreen({ navigation, }: RegisterTechnicScreenProps) {
  const [tagId, setTagId] = useState<string>("")
  const [photos, setPhotos] = useState<string[]>([])
  const [inputMethod, setInputMethod] = useState<"nfc" | "manual">("nfc")
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)

  const vehicle = useAppSelector(state => state.local.vehicle)
  const currentLocation = useAppSelector(state => state.app.currentLocation)

  const onlyDigits = (str: string) => str.replace(/[^0-9]/g, '');

  const currentVehicle = vehicle.find(v =>
    onlyDigits(v.plate) === onlyDigits(tagId)
  );
  // Отслеживаем изменения tagId
  useEffect(() => {
    if (tagId) {
      console.log("Новый tagId:", tagId)
    }
  }, [tagId, currentVehicle]);

  const handleTagRead = (id: string) => {
    console.log("NFC прочитан:", id)
    setTagId(id)
  }
  const [createCheckpoint, result] = useCreateCheckpointMutation()
  const [createCheckpointPhoto] = useCreateCheckpointPhotoMutation()
  const handleManualInput = (id: string) => {
    console.log("Ручной ввод:", id) // Логируем сразу полученное значение
    setTagId(id)
    // НЕ логируем tagId здесь - он еще не обновился!
  }

  const handlePhotosChange = (newPhotos: string[]) => {
    setPhotos(newPhotos)
  }

  const handleSubmit = async () => {
    if (!tagId.trim()) {
      Alert.alert("Ошибка", "Необходимо указать ID метки")
      return
    }

    // Проверяем наличие интернета
    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected && netInfo.isInternetReachable;
    let uploadedPhotoUrls: string[] = [];

    if (isOnline) {
      // Загружаем фото в Cloudinary
      for (const uri of photos) {
        const uploadedUrl = await uploadToCloudinary(uri);
        if (uploadedUrl) {
          uploadedPhotoUrls.push(uploadedUrl);
        }
      }
    } else {
      Alert.alert("Без интернета", "Фото не были загружены, так как вы офлайн.");
      uploadedPhotoUrls = [...photos]; // Сохраняем локальные URI на случай оффлайна
    }



    const checkpointResponse = await createCheckpoint({
      type: "ENTER",
      timestamp: new Date().toISOString(),
      vehicleId: currentVehicle?.id,
      locationId: currentLocation.id,
    })
    if (checkpointResponse.error) {
      console.error('Checkpoint creation failed', checkpointResponse.error);
      return;
    }
    console.log(checkpointResponse.data.id);

    for (const photoUrl of uploadedPhotoUrls) {
      await createCheckpointPhoto({
        checkpointId: checkpointResponse.data.id,
        url: photoUrl,
      });
    }



    // Переходим на следующий экран с данными
    navigation.navigate("RegisterTechnic", {
      tagId: tagId.trim(),
      photos,
      inputMethod,
    })
  }
  const uploadToCloudinary = async (uri: string) => {
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



  const resetForm = () => {
    setTagId("")
    setPhotos([])
    setInputMethod("nfc")
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Регистрация техники
          </Text>
        </Card.Content>
      </Card>

      {/* Выбор способа ввода */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Спосіб введення даних
          </Text>
          <View style={styles.methodButtons}>
            <Button
              mode={inputMethod === "nfc" ? "contained" : "outlined"}
              onPress={() => setInputMethod("nfc")}
              style={styles.methodButton}
              icon="nfc"
            >
              NFC сканер
            </Button>
            <Button
              mode={inputMethod === "manual" ? "contained" : "outlined"}
              onPress={() => setInputMethod("manual")}
              style={styles.methodButton}
              icon="keyboard"
            >
              Ручний ввід
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* NFC Scanner или Manual Input */}
      {inputMethod === "nfc" ? (
        <NfcScanner onTagRead={handleTagRead} onCancel={() => setInputMethod("manual")} />
      ) : (
        <ManualTagInput
          onTagSubmit={handleManualInput}
          onSwitchToNfc={() => setInputMethod("nfc")}
          initialValue={tagId}
        />
      )}

      {/* Отображение результата */}
      {currentVehicle && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Дані
            </Text>
            <View style={styles.tagIdContainer}>
              <View style={{ flexDirection: 'column' }}>
                <Text variant="bodyLarge" style={styles.tagIdText}>
                  {currentVehicle?.plate}
                </Text>
                <Text variant="bodyLarge" style={styles.tagIdText}>
                  {currentVehicle?.model}
                </Text>
              </View>

              <Button mode="text" onPress={() => setTagId("")} icon="close" compact>
                Видалити
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Кнопка для фотографирования груза */}
      {!showPhotoCapture && (
        <View style={styles.actionsContainer}>
          <Button mode="contained" onPress={() => setShowPhotoCapture(true)} icon="camera">
            Добавити фотографії
          </Button>
        </View>
      )}

      {/* Фотографирование груза */}
      {showPhotoCapture && (
        <PhotoCapture
          photos={photos}
          onPhotosChange={handlePhotosChange}
          maxPhotos={5}
          title="Фотографии груза"
          onClose={() => setShowPhotoCapture(false)}
        />
      )}

      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!tagId.trim() || onlyDigits(currentVehicle?.plate || "") !== tagId.trim()}
          style={styles.submitButton}
          icon="check"
        >
          Зберегти
        </Button>
        <Button mode="outlined" onPress={resetForm} style={styles.resetButton} icon="refresh">
          Скинути
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  methodButtons: {
    flexDirection: "row",
    gap: 12,
  },
  methodButton: {
    flex: 1,
  },
  tagIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e8f5e8",
    padding: 12,
    borderRadius: 8,
  },
  tagIdText: {
    fontFamily: "monospace",
    flex: 1,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  submitButton: {
    paddingVertical: 8,
  },
  resetButton: {
    paddingVertical: 8,
  },
})
