package li.cheers.app.test;

import static org.junit.Assert.*;

import android.content.Context;
import li.cheers.app.MainActivity;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import org.junit.Test;
import org.junit.ClassRule;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.runner.RunWith;


import tools.fastlane.screengrab.locale.LocaleTestRule;
import tools.fastlane.screengrab.Screengrab;
import tools.fastlane.screengrab.UiAutomatorScreenshotStrategy;
import tools.fastlane.screengrab.cleanstatusbar.BluetoothState;
import tools.fastlane.screengrab.cleanstatusbar.CleanStatusBar;
import tools.fastlane.screengrab.cleanstatusbar.MobileDataType;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {

    @ClassRule
    public static final LocaleTestRule localeTestRule = new LocaleTestRule();

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule = new ActivityScenarioRule<>(MainActivity.class);

    @BeforeClass
    public static void beforeAll() {
        Screengrab.setDefaultScreenshotStrategy(new UiAutomatorScreenshotStrategy());

        new CleanStatusBar()
                .setMobileNetworkDataType(MobileDataType.LTE)
                .setBluetoothState(BluetoothState.DISCONNECTED)
                .enable();
    }

    @AfterClass
    public static void afterAll() {
        CleanStatusBar.disable();
    }

    @Test
    public void useAppContext() throws Exception {
        // Context of the app under test.
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();

        assertEquals("li.cheers.app", appContext.getPackageName());

        Screengrab.screenshot("main");
    }
}
