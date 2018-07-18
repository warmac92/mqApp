import { Component } from '@angular/core';
import {LoginPage} from '../login/login';
import {CookieService} from 'ngx-cookie-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { DeviceService } from '../../services/device.service';
import { LoadingController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;

/**
 * Generated class for the ScatterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scatter',
  templateUrl: 'scatter.html',
})
export class ScatterPage {

  simData:any;
  payloadData: any[];
  Temp: number[];
  Humid: number[];
  combined: any[];
  showCenti: boolean;
  showFahr: boolean;

  constructor(public loadingCtrl: LoadingController, private deviceService: DeviceService, public angularFireDatabase: AngularFireDatabase, public navCtrl: NavController, public cookieService: CookieService, public navParams: NavParams) {
    this.loading();
    this.payloadData=[];
    this.Temp=[];
    this.Humid=[];
    this.combined=[];
    var dateMonthString;
    var dateDayString;
    this.showCenti=true;
    this.showFahr=true;
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
    if(navParams.get('data')=="0"){
      var simId = '0';
      var macId = this.cookieService.get('machineId');
      console.log(macId);
      this.deviceService.getPayloadData(macId,utcTime).subscribe((payloads:any[])=>{
        this.payloadData=payloads['Payloads'];
        if(this.cookieService.get('unit')=="celsius"){
          for(var i=0; i<this.payloadData.length; i++){
            this.Temp[i] = parseFloat(this.payloadData[i].Data.temperature);
          }
          for(var j=0; j<this.payloadData.length; j++){
            this.Humid[j] = parseFloat(this.payloadData[j].Data.humidity);
          }
          this.combined[0] = ['Temperature','Humidity'];
          setTimeout(()=>{
            for(var z=0; z<this.Humid.length; z++){
              this.combined[z+1] = [this.Temp[z], this.Humid[z]];
            }
          },1000);
        }else{
          for(var i=0; i<this.payloadData.length; i++){
            this.Temp[i] = (((parseFloat(this.payloadData[i].Data.temperature))*1.8)+32);
          }
          for(var j=0; j<this.payloadData.length; j++){
            this.Humid[j] = parseFloat(this.payloadData[j].Data.humidity);
          }
          this.combined[0] = ['Temperature','Humidity'];
          setTimeout(()=>{
            for(var z=0; z<this.Humid.length; z++){
              this.combined[z+1] = [this.Temp[z], this.Humid[z]];
            }
          },1000);
        }
      });
    }else{
      var macId = '0';
      var simId = this.cookieService.get('simulatedId');
      console.log(simId);
      this.angularFireDatabase.object('/Device-Data/0/'+simId+'/').valueChanges().subscribe((fireData:any)=>{
        this.simData = fireData;
        if(this.cookieService.get('unit')=="celsius"){
          for(var i=0; i<this.simData.length; i++){
            this.Temp[i] = this.simData[i].Temperature;
          }
          for(var j=0; j<this.simData.length; j++){
            this.Humid[j] = this.simData[j].Humidity;
          }
          this.combined[0] = ['Temperature','Humidity'];
          setTimeout(()=>{
            for(var z=0; z<this.Humid.length; z++){
              this.combined[z+1] = [this.Temp[z], this.Humid[z]];
            }
          },1000);
        }else{
          for(var i=0; i<this.simData.length; i++){
            this.Temp[i] = (((parseFloat(this.simData[i].Temperature))*1.8)+32);
          }
          for(var j=0; j<this.simData.length; j++){
            this.Humid[j] = this.simData[j].Humidity;
          }
          this.combined[0] = ['Temperature','Humidity'];
          setTimeout(()=>{
            for(var z=0; z<this.Humid.length; z++){
              this.combined[z+1] = [this.Temp[z], this.Humid[z]];
            }
          },1000);
        }
      });
    }
    if(this.cookieService.get('unit')=="celsius"){
      this.showCenti=false;
      this.showFahr=true;
      setTimeout(()=>{
        this.scatterCentigrade();
      },7500);
    }else{
      this.showCenti=true;
      this.showFahr=false;
      setTimeout(()=>{
        this.scatterFahrenheit();
      },7500);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScatterPage');
  }

  scatterCentigrade(){
    console.log("scatter centigrade");
    var data = google.visualization.arrayToDataTable(this.combined,false);
    var options = {
      hAxis: {title: 'Temperature', minValue: 0, maxValue: 60,textStyle:{fontSize:15}},
      vAxis: {title: 'Humidity', minValue: 0, maxValue: 80,textStyle:{fontSize:15}},
      legend: 'none'
    };
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_cel'));
    chart.draw(data, options);
  }

  scatterFahrenheit(){
    console.log("scatter fahrenheit");
    var data = google.visualization.arrayToDataTable(this.combined,false);
    var options = {
      hAxis: {title: 'Temperature', minValue: 0, maxValue: 120,textStyle:{fontSize:15}},
      vAxis: {title: 'Humidity', minValue: 0, maxValue: 80,textStyle:{fontSize:15}},
      legend: 'none'
    };
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_fahr'));
    chart.draw(data, options);
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

  loading(){
    if(this.cookieService.get('unit')=="celsius"){
      let load = this.loadingCtrl.create({
        content:'Loading Please Wait....',
        duration: 7000
      });
      load.present();
    }else{
      let load = this.loadingCtrl.create({
        content:'Loading Please Wait....',
        duration: 7000
      });
      load.present();
    }
  }

  goBack()
  {
    this.navCtrl.setRoot('HomePage');
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
    this.cookieService.delete('xAuthToken'); 

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

}
