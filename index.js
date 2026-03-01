/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { setBackgroundMessageHandler } from './src/utils/FCM/pushNotification';

setBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
