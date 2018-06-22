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
  isCelChecked:boolean;
  isFarChecked:boolean;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public cookieService: CookieService, public navParams: NavParams) {
   
    if(!this.cookieService.get('unit'))
   {
     this.unit='celsius';
     this.isCelChecked=true;
     this.isFarChecked=false;
   }
   else
   {
     this.unit=this.cookieService.get('unit');
     if(this.unit=='celsius')
     {
       this.isCelChecked=true;
       this.isFarChecked=false;
     }
     else
     {
       this.isFarChecked=true;
       this.isCelChecked=false;
     }
   }


   if(!this.cookieService.get('compaName'))
   {
     this.companyName="Acme Inc."
   }
   else
   {
     this.companyName=this.cookieService.get('compaName');
   }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrefPage');
  }

  saveChanges(){
    if(this.companyName=='' || this.companyName==null)
    {
      this.showEmptyValuesAlert();
      return;
    }

    if(this.unit!==this.cookieService.get('unit'))
    {
    this.cookieService.set('unit',this.unit);
    console.log(this.cookieService.get('unit'));
    if(this.unit=='celsius')
    {
      var tmin = Math.round(((parseFloat(this.cookieService.get('tMin')) - 32)*(5/9))).toString();
      var tmax = Math.round(((parseFloat(this.cookieService.get('tMax'))- 32)*(5/9))).toString();
      this.cookieService.set('tMin',tmin);
      this.cookieService.set('tMax',tmax);
    }
    else if(this.unit==="fahrenheit" && this.cookieService.get('unit'))
    {
      this.cookieService.set('unit',this.unit);
      var tmin = Math.round(((parseFloat(this.cookieService.get('tMin')))*(9/5))+32).toString();
      var tmax = Math.round(((parseFloat(this.cookieService.get('tMax'))) *(9/5))+32).toString();
      this.cookieService.set('tMin',tmin);
      this.cookieService.set('tMax',tmax);
    }
  }

  if(this.companyName!==this.cookieService.get('compaName'))
  {
    this.cookieService.set('compaName',this.companyName);
  }
    let alert = this.alertCtrl.create({
      title: 'Preferences saved successfully!',
      buttons: ['Dismiss']
    });
    alert.present();
  
  }

  showEmptyValuesAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Company name cannot be empty.',
      buttons: ['Dismiss']
    });
    alert.present();

  }

  changeTemp(value)
  {
    this.unit=value;
  }

}
