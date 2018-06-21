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

  saveHumidLimits()
  {
    this.cookieService.set('hMin',this.humidityKnobValues.lower);
    this.cookieService.set('hMax',this.humidityKnobValues.upper);
    this.showHumidsLimitsAlert();
  }

  saveTempLimits()
  {
    this.cookieService.set('tMax',this.tempKnobValues.upper);
    this.cookieService.set('tMin',this.tempKnobValues.lower);
    this.showTempsLimitsAlert();
  }


  
  resetTempLimits()
  {

    this.tempKnobValues = {
      upper: 100,
      lower:32
    }

    this.cookieService.set('tMax',this.tempKnobValues.upper);
    this.cookieService.set('tMin',this.tempKnobValues.lower);

    this.showTempsResetAlert();
  }

  resetHumidLimits()
  {

    this.humidityKnobValues = {
      upper:90,
      lower:10
    }

    this.cookieService.set('hMin',this.humidityKnobValues.lower);
    this.cookieService.set('hMax',this.humidityKnobValues.upper);

    this.showHumidsResetAlert();
  
  }

  showTempsLimitsAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Temperature limits saved!',
      buttons: ['Ok']
    });
    alert.present();
  }

  showHumidsLimitsAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Humidity limits saved!',
      buttons: ['Ok']
    });
    alert.present();
  }


  showTempsResetAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Temperature limits set to default successfully!',
      buttons: ['Ok']
    });
    alert.present();

  }

  showHumidsResetAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Humidity limits set to default successfully!',
      buttons: ['Ok']
    });
    alert.present();

  }


  logout()
  {
    this.navCtrl.setRoot(LoginPage);
    
  }

}
