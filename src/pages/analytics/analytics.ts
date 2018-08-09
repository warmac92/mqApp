import { Component } from '@angular/core';
import {LoginPage} from '../login/login';
import {CookieService} from 'ngx-cookie-service';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AnalyticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-analytics',
  templateUrl: 'analytics.html',
})
export class AnalyticsPage {
  deviceName:string;

  constructor(public cookieService: CookieService, public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams.get('data'));
    if(navParams.get('data')=="0"){
      this.deviceName=this.cookieService.get('deviceName');
    }else if(navParams.get('data')=="1"){
      this.deviceName=this.cookieService.get('deviceName');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalyticsPage');
  }

  goBack()
  {
    this.navCtrl.setRoot('HomePage');
  }

  goStat(){
    if(!this.navParams.get('data')){
    this.navCtrl.setRoot('StatsPage');
    }else if(this.navParams.get('data')=="0"){
      this.navCtrl.setRoot('StatsPage', {
        data: "0"
      });
    }else if(this.navParams.get('data')=="1"){
      this.navCtrl.setRoot('StatsPage', {
        data: "1"
      });
    }
  }

  goScatter(){
    if(!this.navParams.get('data')){
    this.navCtrl.setRoot('ScatterPage');
    }else if(this.navParams.get('data')=="0"){
      this.navCtrl.setRoot('ScatterPage', {
        data: "0"
      });
    }else if(this.navParams.get('data')=="1"){
      this.navCtrl.setRoot('ScatterPage', {
        data: "1"
      });
    }
  }

  goBar(){
    if(!this.navParams.get('data')){
    this.navCtrl.setRoot('BarPage');
    }else if(this.navParams.get('data')=="0"){
      this.navCtrl.setRoot('BarPage', {
        data: "0"
      });
    }else if(this.navParams.get('data')=="1"){
      this.navCtrl.setRoot('BarPage', {
        data: "1"
      });
    }
  }

  goVariations(){
    if(!this.navParams.get('data')){
    this.navCtrl.setRoot('VariationsPage');
    }else if(this.navParams.get('data')=="0"){
      this.navCtrl.setRoot('VariationsPage', {
        data: "0"
      });
    }else if(this.navParams.get('data')=="1"){
      this.navCtrl.setRoot('VariationsPage', {
        data: "1"
      });
    }
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
    this.cookieService.delete('xAuthToken'); 
  }

}
