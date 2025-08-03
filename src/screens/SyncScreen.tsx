
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, ProgressBar, Chip, Icon } from 'react-native-paper';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { syncDataWithCacheClear } from '../lib/syncData';
import { clearLocalData } from '../store/slices/localSlice';
import { syncCheckpoints } from '../lib/syncCheckpoints';
import { useCreateCheckpointMutation } from '../store/api/checkpointApi';
import { useCreateCheckpointPhotoMutation } from '../store/api/checkpointPhotoApi';
import { useStore } from 'react-redux';
import NetworkIndicator from '../shared/components/NetworkIndicator';




export default function SyncScreen({ navigation }: any) {
  const pendingCheckpoints = useAppSelector(state => state.local.checkpoints.length);
  const pendingPhotos = useAppSelector(state => state.local.checkpointPhotos.length);
  const lastSync = useAppSelector(state => state.local.lastSync);

  const [createCheckpoint] = useCreateCheckpointMutation()
  const [createCheckpointPhoto] = useCreateCheckpointPhotoMutation()
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();


  const syncDataInfo = {
    isSync: false,
    totalItems: 5,
    syncedItems: 3,
    pendingCheckpoints,
    pendingPhotos,
    lastSyncTime: lastSync,
    errors: [],
  };
  const handleManualSync = async () => {

    const getState = store.getState;

    try {
      const result = await syncCheckpoints(
        createCheckpoint,
        createCheckpointPhoto,
        dispatch,
        getState
      );

      if (result.success) {
        Alert.alert('✅ Синхронізація успішна');
      } else {
        Alert.alert('❌ Помилка', 'Не вдалося синхронізувати');
      }
    } catch (error) {
      console.error('Помилка синхронізації:', error);
    }
  };


  const handleClearLocal = () => {
    dispatch(clearLocalData())
    Alert.alert('Успіх', 'Локальні дані очищені успішно');
  };
  const handleLogSync = async () => {

    const result = await syncDataWithCacheClear(dispatch);

    if (result.success) {
      Alert.alert('Успіх', 'Дані синхронізовані успішно');
    } else {
      Alert.alert('Помилка', 'Не вдалося синхронізувати дані');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uk-UA');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Заголовок */}
      <NetworkIndicator />
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Синхронізація даних
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Керування локальними та серверними даними
          </Text>
        </Card.Content>
      </Card>

      {/* Статус синхронізації */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Статус синхронізації
          </Text>

          {syncDataInfo.isSync ? (
            <View style={styles.syncingContainer}>
              <View style={styles.syncStatusRow}>
                <Icon source="sync" size={24} />
                <Text variant="bodyLarge" style={styles.syncingText}>
                  Синхронізація триває...
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.progressText}>
                {syncDataInfo.syncedItems} з {syncDataInfo.totalItems} елементів
              </Text>
              <ProgressBar
                progress={syncDataInfo.totalItems > 0 ? syncDataInfo.syncedItems / syncDataInfo.totalItems : 0}
                style={styles.progressBar}
              />
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <View style={styles.syncStatusRow}>
                <Icon
                  source={syncDataInfo.pendingCheckpoints > 0 ? "sync-alert" : "sync"}
                  size={24}
                />
                <Text variant="bodyLarge">
                  {syncDataInfo.pendingCheckpoints > 0 ? 'Є несинхронізовані дані' : 'Усі дані синхронізовано'}
                </Text>
              </View>

              {syncDataInfo.lastSyncTime && (
                <Text variant="bodySmall" style={styles.lastSyncText}>
                  Остання синхронізація: {formatDate(syncDataInfo.lastSyncTime)}
                </Text>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Локальні дані */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Локальні дані
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icon source="map-marker" size={20} />
              </View>
              <View style={styles.statTextContainer}>
                <Text variant="bodyLarge" style={styles.statNumber}>
                  {syncDataInfo.pendingCheckpoints}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Чекпоінтів
                </Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icon source="camera" size={20} />
              </View>
              <View style={styles.statTextContainer}>
                <Text variant="bodyLarge" style={styles.statNumber}>
                  {syncDataInfo.pendingPhotos}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Фотографій
                </Text>
              </View>
            </View>
          </View>

          {syncDataInfo.pendingCheckpoints > 0 && (
            <Chip
              icon="alert-circle"
              style={styles.warningChip}
              textStyle={styles.warningChipText}
            >
              Потрібна синхронізація
            </Chip>
          )}
        </Card.Content>
      </Card>

      {/* Дії */}
      {/* Дії */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Дії
          </Text>

          <View style={styles.actionsContainer}>
            <Button
              mode="contained-tonal"
              onPress={handleLogSync}
              disabled={syncDataInfo.isSync}
              style={styles.actionButton}
              icon="file-document-outline"
            >
              Синхронізувати журнали
            </Button>

            <Button
              mode="contained"
              onPress={handleManualSync}
              disabled={syncDataInfo.isSync || syncDataInfo.pendingCheckpoints === 0}
              style={styles.actionButton}
              icon="sync"
            >
              {syncDataInfo.isSync ? 'Синхронізація...' : 'Синхронізувати зараз'}
            </Button>

            <Button
              mode="outlined"
              onPress={handleClearLocal}
              disabled={syncDataInfo.isSync}
              style={styles.actionButton}
              icon="delete-outline"
            >
              Очистити локальні дані
            </Button>
          </View>
        </Card.Content>
      </Card>


      {/* Помилки синхронізації */}
      {syncDataInfo.errors.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Помилки синхронізації
            </Text>

            {syncDataInfo.errors.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <Icon source="alert-circle" size={16} />
                <Text variant="bodySmall" style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Інформація */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Інформація
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon source="information" size={16} />
              <Text variant="bodySmall" style={styles.infoText}>
                Синхронізація виконується автоматично при підключенні до інтернету
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Icon source="cloud-upload" size={16} />
              <Text variant="bodySmall" style={styles.infoText}>
                Фото завантажуються у хмарне сховище
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Icon source="database" size={16} />
              <Text variant="bodySmall" style={styles.infoText}>
                Дані зберігаються локально до моменту синхронізації
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
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
    fontWeight: 'bold',
    marginBottom: 16,
  },
  syncingContainer: {
    padding: 8,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  syncingText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  statusContainer: {
    padding: 8,
  },
  lastSyncText: {
    marginTop: 8,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    flex: 0.45,
  },
  statIconContainer: {
    marginRight: 12,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  statLabel: {
    opacity: 0.7,
  },
  warningChip: {
    backgroundColor: '#fff3e0',
    alignSelf: 'flex-start',
  },
  warningChipText: {
    color: '#f57c00',
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
    color: '#d32f2f',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
    opacity: 0.7,
    lineHeight: 18,
  },
});