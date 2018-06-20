import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LegendPage } from './legend';

@NgModule({
  declarations: [
    LegendPage,
  ],
  imports: [
    IonicPageModule.forChild(LegendPage),
  ],
})
export class LegendPageModule {}
