import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CookieService} from 'ngx-cookie-service';

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
  constructor(public navCtrl: NavController, public cookieService: CookieService, public navParams: NavParams) {
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
  }

  changeTemp(value)
  {
    this.unit=value;
  }

}
