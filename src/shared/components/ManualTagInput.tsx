import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Card, } from 'react-native-paper';

interface ManualTagInputProps {
  onTagSubmit: (tagId: string) => void;
  onSwitchToNfc?: () => void;
  initialValue?: string;
  placeholder?: string;
}

const ManualTagInput: React.FC<ManualTagInputProps> = ({
  onTagSubmit,
  placeholder = '8323'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string>('');



  const validateInput = (value: string): boolean => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError('Номер авто не може бути пустим');
      return false;
    }

    if (trimmedValue.length < 4) {
      setError('Номер авто повинен містити не менше 4 цифр');
      return false;
    }

    if (!/^[a-zA-Z0-9\-_]+$/.test(trimmedValue)) {
      setError('Номер авто повинен містити лише цифри та символи - _');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateInput(inputValue)) {
      onTagSubmit(inputValue.trim());
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (error) {
      // Очищаем ошибку при изменении ввода
      setError('');
    }
  };



  const clearInput = () => {
    setInputValue('');
    setError('');
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Ручний спосіб реєстрації
          </Text>

        </View>

        <Text variant="bodyMedium" style={styles.description}>
          Введіть номер авто (самі цифри, без букв)
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Номер авто (1692)"
            placeholder={placeholder}
            value={inputValue}
            onChangeText={handleInputChange}
            error={!!error}
            style={styles.textInput}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            right={
              inputValue ? (
                <TextInput.Icon
                  icon="close"
                  onPress={clearInput}
                />
              ) : null
            }
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!inputValue.trim()}
            style={styles.submitButton}
            icon="check"
          >
            Підтвердити
          </Button>


        </View>
        {error && (
          <Text variant="bodySmall" style={styles.errorText}>
            {error}
          </Text>
        )}


        <View style={styles.examplesContainer}>
          <Text variant="bodySmall" style={styles.examplesTitle}>
            Приклад введення:  1234, 4567
          </Text>
        </View>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5
  },
  textInput: {
    marginBottom: 8,
    flex: 1,
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  submitButton: {

  },
  examplesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  examplesTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  examplesText: {
    opacity: 0.7,
    fontFamily: 'monospace',
  },
});

export default ManualTagInput;