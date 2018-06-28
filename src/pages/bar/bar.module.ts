import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarPage } from './bar';

@NgModule({
  declarations: [
    BarPage,
  ],
  imports: [
    IonicPageModule.forChild(BarPage),
  ],
})
export class BarPageModule {}
