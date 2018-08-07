import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {CookieService} from 'ngx-cookie-service';
import { LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DeviceService } from '../../services/device.service';

/**
 * Generated class for the VariationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-variations',
  templateUrl: 'variations.html',
})
export class VariationsPage {

  simData : any;
  deviceName : string;
  tempChangeDisplay : any;
  showAC : boolean;
  showNonAC : boolean;
  payloadData : any[];
  combined : any[];
  devices : any;
  temp : any[];
  humid : any[];
  tempChange : any[];
  dateStringArray : string[];

  constructor(public angularFireDatabase: AngularFireDatabase, public loadingCtrl: LoadingController, private deviceService: DeviceService, public navCtrl: NavController, public navParams: NavParams, public cookieService: CookieService) {
    
    var simId;
    var macId;
    this.showAC=true;
    this.showNonAC=true;
    this.combined=[];
    this.temp=[];
    this.devices=[];
    this.humid=[];
    this.tempChange=[];
    this.dateStringArray=[];
    this.payloadData=[];
    this.loading();

    if(navParams.get('data')=="0"){
      simId ='0';
      macId = this.cookieService.get('machineId');
      console.log(macId);
      var dateMonthString;
      var dateDayString;
      const date = new Date();
      date.setDate(date.getDate()-7);
      date.setMonth(date.getUTCMonth()+1);
      if(date.getUTCMonth()<10)
      {
        dateMonthString = "0"+date.getUTCMonth().toString();
      }else{
        dateMonthString = date.getUTCMonth().toString();
      }
      if(date.getUTCDate()<=9){
        dateDayString = "0"+date.getUTCDate().toString();
      }else{
        dateDayString = date.getUTCDate().toString();
      }
      const utcTime = date.getUTCFullYear().toString()+"-"+dateMonthString+"-"+dateDayString+"T00:00:00.000Z";
      console.log(utcTime);
      this.deviceService.getPayloadData(macId,utcTime).subscribe((payloads:any[])=>{
        this.payloadData=payloads['Payloads'];
        console.log(this.payloadData);
      });
        setTimeout(()=>{
          this.mac();
        },6000);
    }else if(navParams.get('data')=="1"){
      macId = '0';
      simId = this.cookieService.get('simulatedId');
      console.log(simId);
      this.angularFireDatabase.object('/Device-Data/0/'+simId+'/').valueChanges().subscribe((fireData:any[])=>{
        this.simData=fireData;
        console.log(this.simData);
          setTimeout(()=>{
            this.sim();
          },3000);
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VariationsPage');
  }

  sim(){
    var i;
    console.log("Sim Centi");
    for(i=12;i<this.simData.length;i++){
      if((parseFloat(this.simData[i].Temperature)-parseFloat(this.simData[i-11].Temperature))>=3 || (parseFloat(this.simData[i].Temperature)-parseFloat(this.simData[i-11].Temperature))<=3){
        this.temp.push(this.simData[i].Temperature);
        this.temp.push(this.simData[i-11].Temperature);
        this.tempChange.push(parseFloat(this.simData[i].Temperature)-parseFloat(this.simData[i-11].Temperature));
      }
      i++;
    }
    // console.log(Math.max(...this.tempChange));
    // console.log(Math.min(...this.tempChange), Math.abs(Math.min(...this.tempChange)));
    if(Math.max(...this.tempChange)>=5 || Math.min(...this.tempChange)<=-5){
      this.showNonAC=false;
      this.showAC=true;
      if(Math.max(...this.tempChange)>Math.abs(Math.min(...this.tempChange))){
        this.tempChangeDisplay = Math.max(...this.tempChange);
      }else{
        this.tempChangeDisplay = Math.min(...this.tempChange);
      }
      this.deviceName = this.cookieService.get('deviceName');
    }else{
      this.showAC=false;
      this.showNonAC=true;
      if(Math.max(...this.tempChange)>Math.abs(Math.min(...this.tempChange))){
        this.tempChangeDisplay = Math.max(...this.tempChange);
      }else{
        this.tempChangeDisplay = Math.min(...this.tempChange);
      }
      this.deviceName = this.cookieService.get('deviceName');
    }
  }

  mac(){
    var i;
    console.log("Mac Centi");
      for(i=12;i<this.payloadData.length;i++){
        if((parseFloat(this.payloadData[i].Data.temperature)-parseFloat(this.payloadData[i-11].Data.temperature))>=3 || (parseFloat(this.payloadData[i].Data.temperature)-parseFloat(this.payloadData[i-11].Data.temperature))<=3){
          this.temp.push(this.payloadData[i].Data.temperature);
          this.temp.push(this.payloadData[i-11].Data.temperature);
          this.tempChange.push(parseFloat(this.payloadData[i].Data.temperature)-parseFloat(this.payloadData[i-11].Data.temperature));
        }
        i++;
      }
      // console.log(Math.max(...this.tempChange));
      // console.log(Math.min(...this.tempChange), Math.abs(Math.min(...this.tempChange)));
      if(Math.max(...this.tempChange)>=5 || Math.min(...this.tempChange)<=-5){
        this.showAC=true;
        this.showNonAC=false;
        if(Math.max(...this.tempChange)>Math.abs(Math.min(...this.tempChange))){
          if(this.cookieService.get('unit')=="celsius"){
            this.tempChangeDisplay = Math.max(...this.tempChange)+"°C";
          }else{
            this.tempChangeDisplay = (((Math.max(...this.tempChange))*1.8)+32)+"°F";
          }
          }else{
            if(this.cookieService.get('unit')=="celsius"){
            this.tempChangeDisplay = Math.min(...this.tempChange)+"°C";
            }else{
              this.tempChangeDisplay = (((Math.min(...this.tempChange))*1.8)+32)+"°F";
            }
          }
        this.deviceName = this.cookieService.get('deviceName');
      }else{
        this.showAC=false;
        this.showNonAC=true;
        if(Math.max(...this.tempChange)>Math.abs(Math.min(...this.tempChange))){
          if(this.cookieService.get('unit')=="celsius"){
            this.tempChangeDisplay = Math.max(...this.tempChange)+"°C";
          }else{
            this.tempChangeDisplay = (((Math.max(...this.tempChange))*1.8)+32)+"°F";
          }
        }else{
          if(this.cookieService.get('unit')=="celsius"){
            this.tempChangeDisplay = Math.min(...this.tempChange)+"°C";
          }else{
            this.tempChangeDisplay = (((Math.min(...this.tempChange))*1.8)+32)+"°F";
          }
        }
        this.deviceName = this.cookieService.get('deviceName');
      }
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
    this.cookieService.delete('xAuthToken'); 
  }

  loading(){
    if(this.cookieService.get('unit')=="celsius"){
      let load = this.loadingCtrl.create({
        content:'Loading Please Wait....',
        duration: 4000
      });
      load.present();
    }else{
      let load = this.loadingCtrl.create({
        content:'Loading Please Wait....',
        duration: 4000
      });
      load.present();
    }
  }

  goBack()
  {
    if(!this.navParams.get('data')){
      this.navCtrl.setRoot('AnalyticsPage');
      }else if(this.navParams.get('data')=="0"){
        this.navCtrl.setRoot('AnalyticsPage', {
          data: "0"
        });
      }else if(this.navParams.get('data')=="1"){
        this.navCtrl.setRoot('AnalyticsPage', {
          data: "1"
        });
      }
  }

}
