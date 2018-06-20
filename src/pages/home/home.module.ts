import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { DeviceService } from '../../services/device.service';
import { IonicStorageModule } from '@ionic/storage';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBHsYBnN2cvu2MIElyxY0NrdtpXHN4ZoQI',
      libraries: ["places"]
    })
  ],
  providers: [
    DeviceService
  ]
})
export class HomePageModule {}
