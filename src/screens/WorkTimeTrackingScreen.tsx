"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Text, Button, Card } from "react-native-paper"
import NfcScanner from "../shared/components/NfcScanner"
import ManualTagInput from "../shared/components/ManualTagInput"
import PhotoCapture from "../shared/components/PhotoCapture"
import { type RootState, useAppDispatch, useAppSelector } from "../store"

import NetInfo from "@react-native-community/netinfo"
import NetworkIndicator from "../shared/components/NetworkIndicator"
import { generateUniqueId } from "../lib/generateUniqueId"

import { useStore } from "react-redux"
import { determineNextCheckpointType } from "../lib/determineNextCheckpointType"
import { useCreateCheckpointMutation, useGetCheckpointQuery } from "../store/api/checkpointApi"
import { addCheckpoint } from "../store/slices/localSlice"

interface WorkTimeTrackingScreenProps {
  navigation: any
}

export default function WorkTimeTrackingScreen({ navigation }: WorkTimeTrackingScreenProps) {
  const [employeeId, setEmployeeId] = useState<string>("")
  const [photos, setPhotos] = useState<string[]>([])
  const [inputMethod, setInputMethod] = useState<"nfc" | "manual">("nfc")


  const store = useStore<RootState>()
  const localWorkTimeEntries = useAppSelector((state) => state.local.checkpoints)
  const employees = useAppSelector((state) => state.local.users)
  const currentLocation = useAppSelector((state) => state.app.currentLocation)

  const { data: checkpointsByLocation } = useGetCheckpointQuery({
    locationId: currentLocation?.id,
    limit: 50,
  })

  const dispatch = useAppDispatch()
  const [createCheckpoint, result] = useCreateCheckpointMutation()



  const currentEmployee = employees.find((emp) => emp.id === employeeId)

  useEffect(() => {
    console.log("=== ИЗМЕНЕНИЕ ЛОКАЛЬНЫХ ДАННЫХ РАБОЧЕГО ВРЕМЕНИ ===")
    console.log("Work Time Entries:", localWorkTimeEntries)
  }, [localWorkTimeEntries])

  useEffect(() => {
    if (employeeId) {
      console.log("Новый employeeId:", employeeId)
    }
  }, [employeeId, currentEmployee])

  const handleTagRead = (id: string) => {
    console.log("NFC прочитаний (працівник):", id)
    setEmployeeId(id)
  }

  const handleManualInput = (id: string) => {
    console.log("Ручний ввід (працівник):", id)
    setEmployeeId(id)
  }



  const handleSubmit = async () => {
    const localEntryId = generateUniqueId()

    if (!employeeId.trim()) {
      Alert.alert("Помилка", "Введіть ідентифікатор працівника")
      return
    }

    if (!currentEmployee) {
      Alert.alert("Помилка", "Немає такого працівника")
      return
    }

    const getState = store.getState
    const workTimeType = await determineNextCheckpointType(
      currentLocation.id,
      currentEmployee.id,
      getState,
      checkpointsByLocation,
    )

    // Проверяем наличие интернета
    const netInfo = await NetInfo.fetch()
    const isOnline = netInfo.isConnected && netInfo.isInternetReachable


    if (isOnline) {
      // Онлайн режим


      const entryResponse = await createCheckpoint({
        type: workTimeType,
        timestamp: new Date().toISOString(),
        userId: currentEmployee.id,
        locationId: currentLocation.id,
      })



      if (entryResponse.error) {
        console.error("Work time entry creation failed", entryResponse.error)
        return
      }



      Alert.alert("Успіх", `${workTimeType === "ENTER" ? "Вхід" : "Вихід"} оформлено.`)
    } else {
      // Офлайн режим
      console.log("=== ОФЛАЙН РЕЖИМ (РАБОЧЕЕ ВРЕМЯ) ===")

      try {
        const entryToSave = {
          id: localEntryId,
          type: workTimeType,
          timestamp: new Date().toISOString(),
          userId: currentEmployee.id,
          locationId: currentLocation.id,
        }

        console.log("Сохраняем запись рабочего времени локально:", entryToSave)
        dispatch(addCheckpoint(entryToSave))



        Alert.alert("Успіх", `${workTimeType === "ENTER" ? "Вхід" : "Вихід"} оформлено локально.`)
      } catch (error) {
        console.error("Ошибка в офлайн режиме:", error)
        Alert.alert("Ошибка", "Произошла ошибка при локальном сохранении: " + error.message)
      }
    }

    // Переходим на следующий экран
    navigation.navigate("HomeScreen", {
      employeeId: employeeId.trim(),
      photos,
      inputMethod,
    })
  }

  const resetForm = () => {
    setEmployeeId("")
    setPhotos([])
    setInputMethod("nfc")
  }



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <NetworkIndicator />

      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Облік робочого часу
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Відмітьте час приходу або виходу
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
        <NfcScanner
          onTagRead={handleTagRead}
          onCancel={() => setInputMethod("manual")}
        />
      ) : (
        <ManualTagInput
          onTagSubmit={handleManualInput}
          onSwitchToNfc={() => setInputMethod("nfc")}
          initialValue={employeeId}
          placeholder="Введіть ID працівника"
          label="ID працівника"
        />
      )}

      {/* Отображение информации о сотруднике */}
      {currentEmployee && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Дані співробітника
            </Text>
            <View style={styles.employeeContainer}>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text variant="bodyLarge" style={styles.employeeText}>
                  {currentEmployee.name}
                </Text>
                <Text variant="bodyMedium" style={styles.employeeSubText}>
                  ID: {currentEmployee.id}
                </Text>
                <Text variant="bodyMedium" style={styles.employeeSubText}>
                  Телефон: {currentEmployee.phone}
                </Text>
              </View>
              <Button mode="text" onPress={() => setEmployeeId("")} icon="close" compact>
                Видалити
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}




      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!employeeId.trim() || !currentEmployee}>
          Створити запис
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
  employeeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
  },
  employeeText: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  employeeSubText: {
    opacity: 0.7,
    marginBottom: 2,
  },
  chipContainer: {
    marginTop: 8,
  },
  typeChip: {
    alignSelf: "flex-start",
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
