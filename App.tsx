/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler'; // 최상단에 필수로 추가
import React from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MainNaviagtion from './src/navigation/MainNaviagtion';
import store from 'redux/store';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen'; // 추가


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    // 필요한 로딩 작업(데이터 fetching 등)이 끝난 후 스플래시를 숨깁니다.
    // 여기서는 간단히 앱이 마운트되면 바로 숨기도록 처리합니다.
    // SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar
            animated={true}
            barStyle="dark-content"
            backgroundColor="white"
          />
          <NavigationContainer>
            <MainNaviagtion />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
