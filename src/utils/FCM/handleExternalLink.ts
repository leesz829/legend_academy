import { Linking } from 'react-native';

/**
 * 외부 URL 또는 딥링크를 처리합니다.
 * @param url - 이동할 URL 또는 딥링크
 */
export const handleExternalLink = async (url: string): Promise<void> => {
    try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            await Linking.openURL(url);
        } else {
            console.warn('[handleExternalLink] 열 수 없는 URL:', url);
        }
    } catch (error) {
        console.error('[handleExternalLink] 링크 열기 실패:', error);
    }
};