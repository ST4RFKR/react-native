import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from './src/store';
import { persistStore } from 'redux-persist';
import { PaperProvider } from 'react-native-paper';

const persistor = persistStore(store);



const ReduxApp = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
