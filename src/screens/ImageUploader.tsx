import React, { useRef } from 'react';
import { SafeAreaView, Button, StyleSheet, View, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';


const ImageUploader = () => {
  const webViewRef = useRef<WebView>(null);

  // 1. "앨범에서 사진 선택" 버튼을 눌렀을 때 실행될 함수
  const handleSelectImage = async () => {
    // `launchImageLibrary` 옵션: base64 포함, 이미지 퀄리티 설정 등
    const options = {
      mediaType: 'photo',
      includeBase64: true, // Base64 인코딩 결과를 포함시킴 (가장 중요)
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('사용자가 이미지 선택을 취소했습니다.');
        return;
      }
      if (response.errorCode) {
        Alert.alert('오류', `이미지 선택 중 오류 발생: ${response.errorMessage}`);
        return;
      }

      // 성공적으로 이미지를 선택했을 때
      if (response.assets && response.assets.length > 0) {
        const image: Asset = response.assets[0];

        // 2. Base64 데이터와 이미지 타입을 웹뷰로 전송
        if (image.base64 && image.type && webViewRef.current) {
          console.log('선택된 이미지의 타입:', image.type);

          // 웹뷰의 window.displayImageFromNative 함수를 호출하는 JS 코드 생성
          const script = `
            window.displayImageFromNative('${image.base64}', '${image.type}');
            true;
          `;
          webViewRef.current.injectJavaScript(script);
        }
      }
    });
  };

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
              title="앨범에서 사진 선택하여 웹뷰로 보내기"
              onPress={handleSelectImage}
          />
        </View>
        {/*<WebView
            ref={webViewRef}
            style={styles.webview}
            originWhitelist={['*']}
            source={{ html: webViewHtml }} // 예제를 위해 HTML을 직접 삽입
        />*/}
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  webview: {
    flex: 1,
  },
});

export default ImageUploader;