import android.util.Log;


@ReactNativeModule
class MyModule{
    @ReactNativeMethod 
    fun createCalendarEvent(name: String, location: String) {
        Log.d("CalendarModule", "Create event called with name: $name and location: $location");
    }
}