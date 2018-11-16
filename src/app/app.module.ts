import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { MyApp } from './app.component';
import { CameraService } from '../providers/natives/camera.service';
import { HTTPService } from '../providers/global/http.service';
import { PhoneService } from '../providers/phone.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "../providers/interceptors/auth.interceptor";
import { IonicStorageModule } from "@ionic/storage";
import { StorageService } from "../providers/natives/storage.service";
import { AuthService } from "../providers/global/auth.service";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { SyncService } from "../providers/global/sync.service";
import { VehicleService } from "../providers/vehicle.service";
import { DefectCategoryService } from "../providers/defect-category.service";
import { SearchService } from "../providers/search.service";
import { VehicleTestService } from "../providers/vehicle-test.service";
import { VehicleTestCategoryService } from "../providers/vehicle-test-category.service";
import { MobileAccessibility } from "@ionic-native/mobile-accessibility";

const IONIC_PROVIDERS = [
  StatusBar,
  SplashScreen,
  {provide: ErrorHandler, useClass: IonicErrorHandler}
];

const CUSTOM_PROVIDERS = [
  SyncService,
  HTTPService,
  StorageService,
  AuthService,
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  VehicleService,
  DefectCategoryService,
  SearchService,
  VehicleService,
  VehicleTestService,
  VehicleTestCategoryService,
  PhoneService,
  CameraService,
  MobileAccessibility,
];

const IONIC_NATIVE_PROVIDERS = [
  SocialSharing,
  InAppBrowser,
  Camera,
  CallNumber,
  OpenNativeSettings,
];

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {statusbarPadding: true}),
    IonicStorageModule.forRoot({
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    ...IONIC_PROVIDERS,
    ...CUSTOM_PROVIDERS,
    ...IONIC_NATIVE_PROVIDERS
  ]
})
export class AppModule {
}
