import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CookieService} from 'ngx-cookie-service';
import {LoginPage} from '../login/login';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  tempKnobValues:any;
  humidityKnobValues:any;
  constructor(private alertCtrl: AlertController,private cookieService: CookieService,public navCtrl: NavController, public navParams: NavParams) {
  
  this.tempKnobValues = {
    upper:null,
    lower:null
  };

  this.humidityKnobValues = {
    upper:null,
    lower:null
  };

  this.tempKnobValues.upper = this.cookieService.get('tMax');
  this.tempKnobValues.lower = this.cookieService.get('tMin');
  

  this.humidityKnobValues.upper = this.cookieService.get('hMax');
  this.humidityKnobValues.lower = this.cookieService.get('hMin');



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  saveLimits()
  {
    this.cookieService.set('tMax',this.tempKnobValues.upper);
    this.cookieService.set('tMin',this.tempKnobValues.lower);
    this.cookieService.set('hMin',this.humidityKnobValues.lower);
    this.cookieService.set('hMax',this.humidityKnobValues.upper);
    this.showLimitsAlert();  
  }

  resetLimits()
  {
    this.tempKnobValues.upper="100";
    this.tempKnobValues.lower="32";

    this.humidityKnobValues.lower="10";
    this.humidityKnobValues.upper="90";

    this.cookieService.set('tMax',this.tempKnobValues.upper);
    this.cookieService.set('tMin',this.tempKnobValues.lower);
    this.cookieService.set('hMin',this.humidityKnobValues.lower);
    this.cookieService.set('hMax',this.humidityKnobValues.upper);

  
  }

  showLimitsAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Limits saved!',
      subTitle: 'Temperature and humidty limits set successfully.',
      buttons: ['Ok']
    });
    alert.present();
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
    
  }

}
