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
  citiesKnobValues: any;
  showCelsius:boolean;
  constructor(private alertCtrl: AlertController,private cookieService: CookieService,public navCtrl: NavController, public navParams: NavParams) {
  
  this.showCelsius=false;
  
  this.tempKnobValues = {
    upper:null,
    lower:null
  };

  this.humidityKnobValues = {
    upper:null,
    lower:null
  };

  this.citiesKnobValues = {
    upper: null,
    lower:0
  }

  this.tempKnobValues.upper = this.cookieService.get('tMax');
  this.tempKnobValues.lower = this.cookieService.get('tMin');

  this.citiesKnobValues.upper = this.cookieService.get('cities');
  
  this.humidityKnobValues.upper = this.cookieService.get('hMax');
  this.humidityKnobValues.lower = this.cookieService.get('hMin');

  if(this.cookieService.get('unit')=='celsius')
  {
    this.showCelsius = true;
  }
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

  saveCitiesLimits()
  {
    this.cookieService.set('cities',this.citiesKnobValues.upper);
    this.showCitiesLimitsAlert();
  }
  
  resetTempLimits()
  {
    if(this.cookieService.get('unit')=='celsius')
    {
      this.tempKnobValues = {
        upper: 38,
        lower:0
      }
    }
    else
    {
    this.tempKnobValues = {
      upper: 100,
      lower:32
    }
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

  resetCitiesLimits()
  {
    this.citiesKnobValues = {
      upper: 5,
      lower:0
    }
    this.cookieService.set('cities',this.citiesKnobValues.upper);
    this.showCitiesResetAlert();
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

  showCitiesLimitsAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Simulated Sites saved!',
      buttons: ['ok']
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

  showCitiesResetAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Simulated Sites set to default!',
      buttons: ['Ok']
    });
    alert.present();
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage); 
  }
}
