import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert, Dimensions } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

interface PhotoCaptureProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  title?: string;
  allowGallery?: boolean;
  onClose?: () => void
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 5,
  title = 'Фотографии',
  allowGallery = true,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);


  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - 80) / 2; // 2 колонки с отступами

  const showImagePicker = () => {
    const options = [
      { text: 'Камера', onPress: () => openCamera() },
      { text: 'Отмена', style: 'cancel' as const }
    ];

    if (allowGallery) {
      options.splice(1, 0, { text: 'Галерея', onPress: () => openGallery() });
    }

    Alert.alert(
      'Выберите источник',
      'Откуда вы хотите добавить фотографию?',
      options
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
    };

    setIsLoading(true);
    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
      selectionLimit: maxPhotos - photos.length,
    };

    setIsLoading(true);
    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    setIsLoading(false);

    if (response.didCancel || response.errorMessage) {
      if (response.errorMessage) {
        Alert.alert('Ошибка', response.errorMessage);
      }
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const newPhotos = response.assets
        .filter(asset => asset.uri)
        .map(asset => asset.uri!)
        .slice(0, maxPhotos - photos.length);

      onPhotosChange([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    Alert.alert(
      'Видалити фотографію',
      'Ви впевнені, що хочете видалити фотографію?',
      [
        { text: 'Відмінити', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index);
            onPhotosChange(newPhotos);
          }
        }
      ]
    );
  };

  const clearAllPhotos = () => {
    Alert.alert(
      'Видалити все фотографіі',
      'Ви впевнені, що хочете видалити всі фотографіі?',
      [
        { text: 'Відмінити', style: 'cancel' },
        {
          text: 'Видалити всі',
          style: 'destructive',
          onPress: () => onPhotosChange([])
        }
      ]
    );
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <IconButton
          icon="close"
          size={20}
          onPress={onClose}
          style={styles.closeButton}
        />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
            <Text variant="bodySmall" style={styles.counter}>
              {photos.length} / {maxPhotos}
            </Text>
          </View>

          {photos.length > 0 && (
            <IconButton
              icon="delete"
              size={20}
              style={{ position: 'absolute', right: 30, top: 0 }}
              onPress={clearAllPhotos}
            />
          )}
        </View>

        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <IconButton
              icon="camera"
              size={48}
              mode="contained-tonal"
            />
            <Text variant="bodyMedium" style={styles.emptyText}>
              Немає фотографій
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              Нажміть на кнопку нижче, щоб додати фотографію
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photosContainer}
          >
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image
                    source={{ uri: photo }}
                    style={[styles.photo, { width: imageSize, height: imageSize }]}
                    resizeMode="cover"
                  />
                  <IconButton
                    icon="close"
                    size={20}
                    mode="contained"
                    onPress={() => removePhoto(index)}
                    style={styles.removeButton}
                    iconColor="#fff"
                    containerColor="rgba(0,0,0,0.6)"
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        <View style={styles.actionsContainer}>
          <Button
            mode={canAddMore ? "contained" : "outlined"}
            onPress={showImagePicker}
            disabled={!canAddMore || isLoading}
            loading={isLoading}
            icon="camera-plus"
            style={styles.addButton}
          >
            {photos.length === 0
              ? 'Добавить фотографии'
              : canAddMore
                ? `Добавить еще (${maxPhotos - photos.length})`
                : 'Максимум фотографий'
            }
          </Button>
        </View>

        {photos.length > 0 && (
          <Text variant="bodySmall" style={styles.hint}>
            Нажміть на хрестик, щоб видалити фотографію
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
  },
  content: {
    position: 'relative',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  counter: {
    opacity: 0.6,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: 250,
  },
  photosContainer: {
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
  },
  actionsContainer: {
    marginTop: 8,
  },
  addButton: {
    paddingVertical: 8,
  },
  hint: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
});

export default PhotoCapture;