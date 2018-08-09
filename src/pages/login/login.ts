import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {UserLogin} from '../../model/UserLogin';
import {LoginService} from '../../services/login.service';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {CookieService} from 'ngx-cookie-service';
import { TouchID } from '@ionic-native/touch-id';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {


  account: UserLogin;
  stayLoggedIn : boolean;
  showForgotPassword : boolean;
  touchIdAvail:boolean;
  constructor(public plt: Platform,private touchId: TouchID,private cookieService: CookieService,private toastCtrl: ToastController,private alertCtrl: AlertController,private loginService: LoginService, public navCtrl: NavController, public navParams: NavParams) {
    if(this.plt.is('ios'))
    {
      this.touchIdAvail=true;
    }
    else
    {
      this.touchIdAvail=false;
    }

    console.log(this.plt);
    this.account = {
      username: '',
      password: ''
    }

    this.showForgotPassword = false;

    if(this.cookieService.get('stayLoggedIn'))
    {
     var stayLogged =  this.cookieService.get('stayLoggedIn');

     if(stayLogged=="true")
     {
      this.stayLoggedIn=true;
      if(this.cookieService.get('username')!==null && this.cookieService.get('password')!==null)
      {
        this.account.username = this.cookieService.get('username');
        this.account.password = this.cookieService.get('password');
      }
     }
     else
     {
      this.stayLoggedIn=false;
      this.account.username='';
      this.account.password='';
     }
    }
    else
    {
      this.stayLoggedIn=false;
      this.account.username='';
      this.account.password='';
    }
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      subTitle: 'Username and password are required for login',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentFailedAlert(){
    let alert = this.alertCtrl.create({
      title: 'Invalid Login',
      subTitle: 'Please enter correct username and password',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentFailedAlertTouchID(){
    let alert = this.alertCtrl.create({
      title: 'Invalid Login',
      subTitle: 'Username and password are required for using touch-id/face-id for the first time',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Logged in successfully',
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  presentTouchIdNotAvailableAlert()
  {
    let alert = this.alertCtrl.create({
      title: 'Touch/Face-ID Not Supported',
      subTitle: 'Touch and Face-ID is only supported by iOS devices',
      buttons: ['Dismiss']
    });
    alert.present();
    
  }

  signinWithTouchId()
  {

      if(this.account.username=='' || this.account.password=='')
      {
        this.presentFailedAlertTouchID();
      }
      else
      {
      this.touchId.verifyFingerprint('Scan your Face/Touch-ID please')
      .then(
        res => {
          this.loginService.login(this.account).subscribe((data:any)=>{
            if(data && data.token)
            {
              this.cookieService.set('stayLoggedIn',"true");
              this.cookieService.set('username',this.account.username);
              this.cookieService.set('password',this.account.password);
              this.cookieService.set('xAuthToken',data.token);
              this.presentToast();
              this.navCtrl.setRoot('HomePage');
            }
          },
        err=>{
          console.log(err);
          if(err.error.error=="Invalid login attempt")
          {
            this.presentFailedAlert();
          }
          else
          {
            this.showError();
          }
          
        })
      },
        err => console.error('Error', err)
      );
       
      }
    }
    

 

  doLogin() {
    if(this.stayLoggedIn==true)
    {
      this.cookieService.set('username',this.account.username);
      this.cookieService.set('password',this.account.password);
    }
    if(this.account.username=='' ||this.account.password=='')
    {
      this.presentAlert();
      return;
    }
    this.loginService.login(this.account).subscribe((data:any)=>{
      if(data && data.token)
      {
        this.cookieService.set('xAuthToken',data.token);
        this.presentToast();
        this.navCtrl.setRoot('HomePage');
      }
    },
  err=>{
    console.log(err);
    if(err.error.error=="Invalid login attempt")
    {
      this.presentFailedAlert();
    }
    else
    {
      this.showError();
    }
    
  })
}

showError()
{
  let alert = this.alertCtrl.create({
    title: 'Internet connection lost!',
    subTitle: 'Please make sure that you are connected to the internet.',
    buttons: ['Dismiss']
  });
  alert.present();
}

stayLogged(value)
{ 
  if(value==true)
  {
    this.cookieService.set('stayLoggedIn',"true");
    this.cookieService.set('username',this.account.username);
    this.cookieService.set('password',this.account.password);
  }
  else
  {
    this.cookieService.set('stayLoggedIn',"false");
    this.cookieService.delete('username');
    this.cookieService.delete('password');
  }

}

openPage(p)
{
  this.navCtrl.push(p);
}

showForgot()
{
  this.showForgotPassword = !this.showForgotPassword;
}

showForgotPasswordSuccess()
{
  let alert = this.alertCtrl.create({
    title: 'Password reset email sent successfully!',
    subTitle: 'Please check email associated to your username.',
    buttons: ['Dismiss']
  });
  alert.present();

}

showForgotPasswordFailure()
{
  let alert = this.alertCtrl.create({
    title: 'Some problem occoured!',
    subTitle: 'Some problem occoured while resetting password.',
    buttons: ['Dismiss']
  });
  alert.present();
}

doForgotPassword()
{
  var username = {
    Username : this.account.username
  };
  this.loginService.forgotPassword(username).subscribe((data:any)=>{
    console.log(data);
    if(data.response == true)
    {
      this.showForgotPasswordSuccess();
    }
    else
    {
      this.showForgotPasswordFailure();
    }
  },err=>{
      this.showError();
  })

}




}
