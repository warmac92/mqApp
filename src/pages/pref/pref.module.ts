import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrefPage } from './pref';

@NgModule({
  declarations: [
    PrefPage,
  ],
  imports: [
    IonicPageModule.forChild(PrefPage),
  ],
})
export class PrefPageModule {}
