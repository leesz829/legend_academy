import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { deepLinkRouter } from './deepLinkRouter';

/**
 * Notifee를 사용해 로컬 알림을 표시하는 함수
 */
const displayLocalNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    // Android 알림 채널 생성 (최초 1회 또는 매번 호출해도 무방)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH, // 상단 배너(헤드업 알림) 표시를 위해 HIGH 필요
    });

    // 알림 표시
    await notifee.displayNotification({
        title: remoteMessage.notification?.title ?? '알림',
        body: remoteMessage.notification?.body ?? '',
        data: remoteMessage.data,
        android: {
            channelId,
            importance: AndroidImportance.HIGH, // 헤드업 알림(배너) 표시
            pressAction: {
                id: 'default',
            },
        },
        ios: {
            foregroundPresentationOptions: {
                alert: true,
                badge: true,
                sound: true,
                banner: true,  // iOS 14+ 배너 표시
            },
        },
    });
};

/**
 * 포그라운드 메시지 수신 핸들러 등록
 */
export const registerForegroundHandler = (): (() => void) => {
    const unsubscribe = messaging().onMessage(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log('[FCM] 포그라운드 메시지 수신:', remoteMessage);

            // 필요시 로컬 알림 표시 또는 인앱 UI 처리
            if (remoteMessage.data) {

                // 백그라운드 알림처럼 상단 배너 표시
                await displayLocalNotification(remoteMessage);
            }
        },
    );

    return unsubscribe;
};

/**
 * 백그라운드/종료 상태에서 알림 클릭 시 핸들러 등록
 */
export const registerBackgroundHandler = (): void => {
    // 앱이 백그라운드 상태에서 알림을 클릭했을 때
    messaging().onNotificationOpenedApp(
        (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log('[FCM] 백그라운드 → 알림 클릭:', remoteMessage);
            if (remoteMessage.data) {
                deepLinkRouter(remoteMessage.data);
            }
        },
    );

    // 앱이 완전히 종료된 상태에서 알림 클릭으로 앱이 열렸을 때
    messaging()
        .getInitialNotification()
        .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
            if (remoteMessage) {
                console.log('[FCM] 앱 종료 → 알림 클릭:', remoteMessage);
                if (remoteMessage.data) {
                    deepLinkRouter(remoteMessage.data);
                }
            }
        });
};

/**
 * 백그라운드 메시지 핸들러 (index.js에서 최상단에 등록)
 */
export const setBackgroundMessageHandler = (): void => {
    messaging().setBackgroundMessageHandler(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log('[FCM] 백그라운드 메시지 처리:', remoteMessage);
        },
    );
};