import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import {CookieService} from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import {LoginPage} from '../login/login';

/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})

export class StatsPage {

  @ViewChild('doughnutCentigradeCanvas') doughnutCentigradeCanvas;
  @ViewChild('doughnutFahrenheitCanvas') doughnutFahrenheitCanvas;

  doughnutChart: any;
  a: number;
  tmax: number;
  tmin: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  showCenti: boolean;
  showFahr: boolean;
  payloadData: any[];
  temperatures: number[];
  constructor(public cookieService: CookieService,private deviceService: DeviceService, public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    this.payloadData=[];
    this.temperatures=[];
    this.tmax = parseFloat(this.cookieService.get('tMax'));
    console.log("tMax");
    console.log(this.tmax);
    this.tmin = parseFloat(this.cookieService.get('tMin'));
    console.log("tMin");
    console.log(this.tmin);
    this.a=0;
    this.b=0;
    this.c=0;
    this.d=0;
    this.e=0;
    this.f=0;
    this.showCenti=true;
    this.showFahr=true;
    var macId = this.cookieService.get('machineId');
    var dateMonthString;
    const date = new Date();
    date.setDate(date.getDate()-7);
    date.setMonth(date.getUTCMonth()+1);
    if(date.getUTCMonth()<10)
    {
      dateMonthString = "0"+date.getUTCMonth().toString();
    }
    const utcTime = date.getUTCFullYear().toString()+"-"+dateMonthString+"-"+date.getUTCDate().toString()+"T00:00:00.000Z";
    this.loading();
    this.deviceService.getPayloadData(macId,utcTime).subscribe((payloads:any[])=>{
      this.payloadData=payloads['Payloads'];
      if(this.cookieService.get('unit')=="celsius")
      {
        this.showCenti=false;
        this.showFahr=true;
      for(var i=0;i<this.payloadData.length;i++)
      {
        //this.temperatures.push(this.payloadData[i].Data.temperature); 
        if(parseFloat(this.payloadData[i].Data.temperature)<=this.tmin){
          this.a++
        }else if(parseFloat(this.payloadData[i].Data.temperature)>this.tmin && parseFloat(this.payloadData[i].Data.temperature)<this.tmax){
          this.b++;
        }else if(parseFloat(this.payloadData[i].Data.temperature)>=this.tmax){
          this.c++;
        }
      }
      console.log(this.a);
      console.log(this.b);
      console.log(this.c);
      this.doughnutCentigrade();
      }else if(this.cookieService.get('unit')=="fahrenheit"){
        this.showCenti=true;
        this.showFahr=false;
      setTimeout(()=>{
        for(var i=0;i<this.payloadData.length;i++)
        {
            this.g=0;
            if(this.payloadData[i].Data)
            {
            this.g=(((parseFloat(this.payloadData[i].Data.temperature))*1.8)+32);
            }
            //this.temperatures.push(this.payloadData[i].Data.temperature); 
            if((this.g)<=this.tmin){
              this.d++
            }else if((this.g)>this.tmin && (this.g)<this.tmax){
              this.e++;
            }else if((this.g)>=this.tmax){
              this.f++;
            }
        }
      console.log(this.d);
      console.log(this.e);
      console.log(this.f);
      this.doughnutFahrenheit();
      },2000);
    }
      
    });
  }

  loading(){
    if(this.cookieService.get('unit')=="celsius"){
      let load = this.loadingCtrl.create({
        content:'Loading Please Wait....',
        duration: 3000
      });
      load.present();
    }else{
      let load = this.loadingCtrl.create({
        content:'Loading Please Wait....',
        duration: 5000
      });
      load.present();
    }
  }

  doughnutCentigrade(){
    console.log("centi graph");
    this.doughnutChart = new Chart(this.doughnutCentigradeCanvas.nativeElement, {
      type: 'doughnut',
      data:{
        labels: ["<="+this.tmin+"℃",">"+this.tmin+"℃ & <"+this.tmax+"℃",">="+this.tmax+"℃"],
        datasets: [{
          label: '# of Votes',
          data: [this.a,this.b,this.c],
          backgroundColor: [
            'rgba(255,99,132,0.5)',
            'rgba(54,162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          hoverBackgroundColor:[
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      }
    });
  }

  doughnutFahrenheit(){
    console.log("fahrenheit graph");
    this.doughnutChart = new Chart(this.doughnutFahrenheitCanvas.nativeElement, {
      type: 'doughnut',
      data:{
        labels: ["<="+this.tmin+"°F",">"+this.tmin+"°F & <"+this.tmax+"°F",">="+this.tmax+"°F"],
        datasets: [{
          label: '# of Votes',
          data: [this.d,this.e,this.f],
          backgroundColor: [
            'rgba(255,99,132,0.5)',
            'rgba(54,162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          hoverBackgroundColor:[
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }

  goBar(){
    this.navCtrl.setRoot('BarPage');
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
  }

  goBack()
  {
    this.navCtrl.setRoot('HomePage');
  }
  // this is the place from where line is starting
  
}
