import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CookieService} from 'ngx-cookie-service';
import {LoginPage} from '../login/login';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the LegendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-legend',
  templateUrl: 'legend.html',
})
export class LegendPage {

  constructor(private localNotifications: LocalNotifications,private alertCtrl: AlertController,private cookieService: CookieService,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LegendPage');
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);


  }

}
