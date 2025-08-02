
import React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import HomeNavigator from './src/store/navigation/HomeNavigator';



const SettingsRoute = () => <Text>Setting</Text>;
function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeNavigator,
    settings: SettingsRoute,
  });



  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}



export default App;
