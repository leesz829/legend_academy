import { Alert, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

/**
 * FCM 토큰을 가져옵니다.
 * 권한 요청 후 토큰을 반환합니다.
 */
export const getFCMToken = async (): Promise<string | null> => {
    try {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('알림 권한이 거부되었습니다.');
                return null;
            }
        }

        // Firebase Messaging 권한 요청(IOS와 안드로이드 공용)
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.warn('[FCM] 알림 권한이 거부되었습니다.');
            return null;
        }

        const token = await messaging().getToken();
        console.log('[FCM] Token:', token);
        return token;
    } catch (error) {
        console.error('[FCM] 토큰 가져오기 실패:', error);
        return null;
    }
};