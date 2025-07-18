package com.legend_academy

import android.os.Bundle // 추가
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen // 추가

class MainActivity : ReactActivity() {

    /**
     * onCreate는 Activity가 생성될 때 호출됩니다.
     * 스플래시 화면을 여기서 보여줍니다.
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this) // super.onCreate(null) 보다 먼저 호출
        super.onCreate(savedInstanceState)
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "legend_academy"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
