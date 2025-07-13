import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Image, ScrollView, StyleSheet, View, Platform, BackHandler, useWindowDimensions, Alert } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { WebViewNativeEvent } from 'react-native-webview/lib/WebViewTypes';
import { HeaderBackButton } from '@react-navigation/elements';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';



/* ################################################################################################################
###### 서비스 정책 화면
################################################################################################################### */
interface Props {
  navigation: StackNavigationProp<StackParamList, 'Home'>;
  route: RouteProp<StackParamList, 'Home'>;
}

//const { width, height } = Dimensions.get('window');

export const Home = (props: Props) => {
  const { height } = useWindowDimensions(); // 1. useWindowDimensions 훅 사용
  const webViewRef= useRef<WebView>(null);
  const [navState, setNavState] = useState<WebViewNativeEvent>();
  const [canGoBack, setCanGoBack] = useState(false);
  const [isMainPage, setIsMainPage] = useState(false); // [추가] 메인 페이지 여부를 저장할 상태

  const navigation = useNavigation();

  // 1. 로딩 상태와 시작 URL을 관리할 state 추가
  const [isLoading, setIsLoading] = useState(true);
  const [initialUrl, setInitialUrl] = useState<string>(''); // 초기값을 빈 문자열로 변경
  //const BASE_URL = 'http://221.146.13.175:9090';
//  const BASE_URL = 'http://10.0.0.1:9090';
  const BASE_URL = 'http://49.50.131.78:8080';

  // 2. 앱 시작 시 토큰을 확인하여 시작 URL을 설정하는 useEffect
  useEffect(() => {
    const checkTokenAndSetUrl = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');

        if (accessToken) {
          // 토큰이 존재하면 메인 페이지로 설정
          console.log('토큰 발견. 메인 페이지로 이동합니다.');
          setInitialUrl(`${BASE_URL}/page/academy/academySearch`); // 웹 프로젝트의 메인 페이지 경로
        } else {
          // 토큰이 없으면 로그인 페이지로 설정
          console.log('토큰 없음. 로그인 페이지로 이동합니다.');
          setInitialUrl(`${BASE_URL}`); // 웹 프로젝트의 로그인 페이지 경로
        }
      } catch (e) {
        console.error('AsyncStorage에서 토큰 로딩 중 오류 발생:', e);
        // 오류 발생 시 안전하게 로그인 페이지로 보냅니다.
        setInitialUrl(`${BASE_URL}`);
      } finally {
        // URL 결정이 끝나면 로딩 상태를 false로 변경하여 웹뷰를 보여줍니다.
        setIsLoading(false);
      }
    };

    checkTokenAndSetUrl();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때 한번만 실행되도록 합니다.


  /* #########################################################################################################
  *  뒤로가기 처리 관련
  ######################################################################################################### */

  // 2. 뒤로가기 처리를 위한 함수를 useCallback으로 메모이제이션
  const handleBackPress = useCallback(() => {
    console.log('canGoBack !!!!!!!!!!!!!!!');

    console.log('isMainPage :::: ',  isMainPage);

    if(isMainPage){
      BackHandler.exitApp();
      return true;
    }

    if (canGoBack) {
      webViewRef.current?.goBack();
      return true; // 이벤트 처리 완료, 앱 종료 방지
    }
    return false; // 처리할 내용 없음, 기본 동작(화면 전환 등) 실행
  }, [canGoBack, isMainPage]);

  useEffect(() => {
    // 이벤트 리스너를 등록하고, 구독 해제 함수를 반환받습니다.
    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
    );

    // *** 이 부분이 가장 중요합니다: 컴포넌트가 사라질 때 반드시 리스너를 제거합니다. ***
    return () => backHandler.remove();

  }, [handleBackPress]); // handleBackPress 함수가 변경될 때만 이 effect가 다시 실행됩니다.c

  // 4. 네비게이션 헤더 버튼 설정
  useEffect(() => {
    console.log('canGoBac1111111k !!!!!!!!!!!!!!!');
    getAccessToken();

    navigation.setOptions({
      headerLeft: () =>
          canGoBack ? (
              <HeaderBackButton onPress={handleBackPress} tintColor="#58595B" />
          ) : null,
    });
  }, [navigation, canGoBack, handleBackPress]);


  /*useEffect(() => {
    console.log('canGoBac1111111k !!!!!!!!!!!!!!!');

  }, []);*/




  async function getAccessToken() {
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
  }







  /* #########################################################################################################
  *  네이티브와 웹 간의 함수 인터페이스 관련
  ######################################################################################################### */

  /**
   * 전달받은 토큰들을 AsyncStorage에 저장하는 함수
   */
  const storeTokens = async (accessToken: string, refreshToken: string, memberSeq: string) => {
    try {
      // AsyncStorage에 'accessToken'과 'refreshToken' 키로 값을 저장합니다.
      // 여러 값을 동시에 저장하기 위해 multiSet을 사용할 수도 있습니다.
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('memberSeq', memberSeq);

    } catch (e) {
      console.error('토큰 저장 실패:', e);
      //Alert.alert('오류', '로그인 정보를 저장하는 데 실패했습니다.');
    }
  };

  /**
   * 웹뷰로부터 메시지를 수신했을 때 실행되는 핸들러 함수
   */
  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    //console.log('handleWebViewMessage', event);
    // 1. 웹뷰에서 온 데이터(문자열)를 파싱합니다.
    //    안전하게 처리하기 위해 JSON.parse를 사용하고, try-catch로 감싸는 것이 좋습니다.
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      console.error('Error parsing JSON from webview:', e);
      return;
    }

    // 2. 수신된 데이터의 'type'에 따라 분기하여 원하는 함수를 실행합니다.
    if (data && data.type) {
      switch (data.type) {

        // ###################################################### STORAGE 저장
        case 'SET_STORAGE': {
          const {key, value} = data.payload;

          console.log('SET_STORAGE ::: key ::::: ', key);
          console.log('SET_STORAGE ::: value ::::: ', value);

          if (!key) {
            console.error('SET_DATA: 키가 누락되었습니다.');
            return;
          }

          try {
            let valueToStore;
            // 1. 저장할 값(value)의 타입을 확인합니다.
            if (typeof value === 'object' && value !== null) {
              // 2. 타입이 객체(또는 배열)이면 JSON 문자열로 변환합니다.
              valueToStore = JSON.stringify(value);
              console.log(`객체 데이터를 저장합니다. (key: ${key})`);
            } else {
              // 3. 문자열, 숫자, 불리언 등 원시 타입이면 그냥 문자열로 변환합니다.
              valueToStore = String(value);
              console.log(`원시 타입 데이터를 저장합니다. (key: ${key})`);
            }

            // 4. 변환된 값을 AsyncStorage에 저장합니다.
            await AsyncStorage.setItem(key, valueToStore);

          } catch (e) {
            console.error(`데이터 저장 실패 (key: ${key}):`, e);
          }

          break;
        }

          // ###################################################### STORAGE 추출
        case 'GET_STORAGE': {
          const {key} = data.payload;

          if (!key) {
            console.error('GET_DATA: 키가 누락되었습니다.');
            return;
          }

          try {
            const jsonValue = await AsyncStorage.getItem(key);

            let valueToSend = null;
            if (jsonValue !== null) {
              // 저장된 값이 JSON 형태인지 확인하기 위해 파싱을 시도합니다.
              try {
                // JSON.parse가 성공하면 객체 또는 배열입니다.
                valueToSend = JSON.parse(jsonValue);
              } catch (e) {
                // 파싱에 실패하면 일반 문자열입니다.
                valueToSend = jsonValue;
              }
            }

            // 웹뷰로 데이터를 다시 전송합니다.
            if (webViewRef.current) {
              const response = {
                type: 'DATA_RESPONSE',
                key: key, // 어떤 키에 대한 응답인지 알려주면 좋습니다.
                payload: valueToSend,
              };
              webViewRef.current.postMessage(JSON.stringify(response));
            }

          } catch (e) {
            console.error(`데이터 불러오기 실패 (key: ${key}):`, e);
          }

          break;
        }

          // ###################################################### 토큰 저장
        case 'SET_STORE_TOKENS': {
          const {accessToken, refreshToken, memberSeq} = data.payload;
          if (accessToken && refreshToken) {
            // 토큰 저장 함수를 호출합니다.
            //storeTokens(accessToken, refreshToken, memberSeq);

            console.log('SET_STORE_TOKENS memberSeq ::::: ', memberSeq);

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('memberSeq', String(memberSeq));

          } else {
            console.error('페이로드에 토큰이 누락되었습니다.');
          }
          break;
        }
          // ###################################################### 토큰 삭제
        case 'REMOVE_TOKENS': {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');

          break;
        }
          // ###################################################### 토큰 추출
        case 'GET_TOKENS': {
          // 웹뷰로부터 토큰 요청을 받으면 실행됩니다.
          const sendTokensToWebView = async () => {
            try {
              const accessToken = await AsyncStorage.getItem('accessToken');
              const refreshToken = await AsyncStorage.getItem('refreshToken');
              const memberSeq = await AsyncStorage.getItem('memberSeq');

              // 웹뷰로 다시 보낼 응답 메시지를 구성합니다.
              // 웹에서 이 응답을 식별할 수 있도록 새로운 type('TOKEN_RESPONSE')을 사용합니다.
              const response = {
                type: 'TOKEN_RESPONSE',
                payload: {
                  accessToken: accessToken, // 토큰이 없으면 null이 됩니다.
                  refreshToken: refreshToken,
                  memberSeq: memberSeq,
                },
              };

              // webViewRef를 사용하여 웹뷰 안의 자바스크립트로 메시지를 보냅니다.
              if (webViewRef.current) {

                webViewRef.current.postMessage(JSON.stringify(response));

                console.log('response ::::: ', response);
              }
            } catch (e) {
              console.error('토큰 조회 또는 웹뷰로 메시지 전송 실패:', e);
            }
          };

          sendTokensToWebView();

          break;

        }
          // ###################################################### 토큰 저장
        case 'IMAGE_UPLOAD': {
          const imgSrc = await handleImageUpload();
          console.log('imgSrc', imgSrc);

          break;
        }

        case 'UPDATE_BACK_BUTTON_STATE': {
          console.log('data.payload.isMainPage :::: ', data.payload.isMainPage);

          // payload의 isMainPage 값에 따라 상태 업데이트
          setIsMainPage(data.payload.isMainPage);
          break;
        }

        case 'EXIT_APP': {
          console.log('EXIT_APP!!!!!!!!!!!!!!!');

          //BackHandler.exitApp();

          break;
        }

        default:
          break;
      }
    }
  };












  /**
   * 갤러리를 열고 선택된 이미지를 웹뷰로 전송하는 함수
   */
  const handleImageUpload = async () => {
    // 갤러리 실행 옵션
    const options = {
      //mediaType: 'photo',
      mediaType: 'photo' as const,
      includeBase64: true, // Base64 문자열 포함 (핵심)
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.1,        // 이미지 품질을 70%로 설정 (0.0 ~ 1.0)
    };

    // 이미지 라이브러리(갤러리) 실행
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('사용자가 이미지 선택을 취소했습니다.');

        const response = { type: 'GET_IMAGE_CANCELLED' };

        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify(response));
        }

        // (선택) 웹뷰에 취소 사실을 알려줄 수도 있습니다.
        // webViewRef.current?.injectJavaScript(`window.imageSelectionCancelled(); true;`);
        return;
      }
      if (response.errorCode) {
        Alert.alert('오류', `이미지 선택 중 오류 발생: ${response.errorMessage}`);
        return;
      }

      // 이미지를 성공적으로 선택했을 경우
      if (response.assets && response.assets.length > 0) {
        const image: Asset = response.assets[0];

        // Base64 데이터와 이미지 타입을 웹뷰로 전송
        if (image.base64 && image.type && webViewRef.current) {
          console.log('선택된 이미지 타입:', image.type);

          const response = {
            type: 'GET_IMAGE_RESPONSE',
            payload: {
              base64: image.base64,
            },
          };

          // webViewRef를 사용하여 웹뷰 안의 자바스크립트로 메시지를 보냅니다.
          if (webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify(response));

            console.log('response ::::: ' , response);
          }

          // 웹뷰에서 실행할 자바스크립트 코드 생성
          // 웹페이지에 미리 정의된 `window.receiveImageFromNative` 함수를 호출합니다.
          /*const script = `
            window.receiveImageFromNative('${image.base64}', '${image.type}');
            true; // 안드로이드 호환성을 위해 true 반환
          `;*/

          // 생성된 스크립트를 웹뷰에 주입하여 실행
          //webViewRef.current.injectJavaScript(script);

          //return image.base64;
        }
      }
    });
  };










  return (
    <>
      <View style={_styles.wrap}>
        <WebView 
          //source={{uri: 'https://naver.com'}}
          source={{uri: initialUrl}}
          ref={webViewRef}
          onMessage={handleWebViewMessage}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadEnd={() => {
            SplashScreen.hide(); // 웹뷰 로딩이 끝나면 스플래시 화면을 숨깁니다.
          }}
          domStorageEnabled={true} // 웹사이트가 localStorage를 사용할 경우 필요
          startInLoadingState={true} // 웹뷰 로딩 중 인디케이터 표시
        />
      </View>
    </>
  );
};



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}
const _styles = StyleSheet.create({
  wrap: {
    flex: 1,
    //height: height,
    backgroundColor: '#181818',
  },
});