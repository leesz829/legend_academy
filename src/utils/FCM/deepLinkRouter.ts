import { NavigationContainerRef } from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
    navigationRef = ref;
};

/**
 * 알림의 data payload에서 이동할 화면을 파싱하여 네비게이트합니다.
 */
export const deepLinkRouter = (data: Record<string, any>) => {
    if (!navigationRef) {
        console.warn('[deepLinkRouter] navigationRef가 설정되지 않았습니다.');
        return;
    }

    const screen = data?.screen;
    const params = data?.params ? JSON.parse(data.params) : {};

    if (screen) {
        navigationRef.navigate(screen as never, params as never);
    }
};