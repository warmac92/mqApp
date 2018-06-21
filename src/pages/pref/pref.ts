import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CookieService} from 'ngx-cookie-service';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the PrefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pref',
  templateUrl: 'pref.html',
})
export class PrefPage {
  companyName: any;
  unit:string;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public cookieService: CookieService, public navParams: NavParams) {
    this.unit="celsius";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrefPage');
  }

  saveChanges(){
    this.cookieService.set('compaName',this.companyName);
    console.log(this.cookieService.get('compaName'));
    this.cookieService.set('unit',this.unit);
    console.log(this.cookieService.get('unit'));
    let alert = this.alertCtrl.create({
      title: 'Preferences Saved',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  changeTemp(value)
  {
    this.unit=value;
  }

}
