import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HttpClientModule} from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { LoginService } from '../services/login.service';
import { DeviceService } from '../services/device.service';
import { WeatherService } from '../services/weather.service';
import { IonicStorageModule } from '@ionic/storage';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Util } from '../constants/util';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ChartsModule } from 'ng2-charts';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { TouchID } from '@ionic-native/touch-id';

var config = {
  apiKey: "AIzaSyAGOXVVn6m11aMbhP0XQrLSO3--0W_bnWI",
  authDomain: "macrosoft-iot-4a200.firebaseapp.com",
  databaseURL: "https://macrosoft-iot-4a200.firebaseio.com",
  projectId: "macrosoft-iot-4a200",
  storageBucket: "macrosoft-iot-4a200.appspot.com",
  messagingSenderId: "574561697134"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    AngularFontAwesomeModule,
    BrowserModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    AngularFireModule.initializeApp(config),
    ChartsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    TouchID,
    Util,
    CookieService,
    LoginService,
    DeviceService,
    WeatherService,
    LoadingController,
    LocalNotifications,
    DatePipe,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
