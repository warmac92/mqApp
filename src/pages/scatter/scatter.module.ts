import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScatterPage } from './scatter';

@NgModule({
  declarations: [
    ScatterPage,
  ],
  imports: [
    IonicPageModule.forChild(ScatterPage),
  ],
})
export class ScatterPageModule {}
