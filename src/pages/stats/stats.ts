import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import {CookieService} from 'ngx-cookie-service';
import { Chart } from 'chart.js';

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

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCentigradeCanvas') doughnutCentigradeCanvas;
  @ViewChild('doughnutFahrenheitCanvas') doughnutFahrenheitCanvas;

  barChart: any;
  doughnutChart: any;
  a: number;
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
  constructor(public cookieService: CookieService,private deviceService: DeviceService, public navCtrl: NavController, public navParams: NavParams) {

    this.payloadData=[];
    this.temperatures=[];
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
    
    this.deviceService.getPayloadData(macId,utcTime).subscribe((payloads:any[])=>{
      
      this.payloadData=payloads['Payloads'];
      if(this.cookieService.get('unit')=="celsius")
      {
        this.showCenti=false;
        this.showFahr=true;
      for(var i=0;i<this.payloadData.length;i++)
      {
        //this.temperatures.push(this.payloadData[i].Data.temperature); 
        if(parseFloat(this.payloadData[i].Data.temperature)<=-15.00){
          this.a++
        }else if(parseFloat(this.payloadData[i].Data.temperature)>-15.00 && parseFloat(this.payloadData[i].Data.temperature)<25.00){
          this.b++;
        }else if(parseFloat(this.payloadData[i].Data.temperature)>=25.00){
          this.c++;
        }
      }
      console.log(this.a);
      console.log(this.b);
      console.log(this.c);
      }
      
    });

    if(this.cookieService.get('unit')=="celsius"){
    setTimeout(()=>{
      this.doughnutCentigrade();
    }, 4000);
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
          if((this.g)<=0.00){
            this.d++
          }else if((this.g)>0.00 && (this.g)<75.00){
            this.e++;
          }else if((this.g)>=75.00){
            this.f++;
          }
    }
      this.doughnutFahrenheit();
    },6000);
  }
  }

  doughnutCentigrade(){
    this.doughnutChart = new Chart(this.doughnutCentigradeCanvas.nativeElement, {
      type: 'doughnut',
      data:{
        labels: ["<=-15","<-15 & 25>",">=25"],
        datasets: [{
          label: '# of Votes',
          data: [this.a,this.b,this.c],
          backgroundColor: [
            'rgba(255,99,132,0.2)',
            'rgba(54,162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
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
    this.doughnutChart = new Chart(this.doughnutFahrenheitCanvas.nativeElement, {
      type: 'doughnut',
      data:{
        labels: ["<=0","<0 & 75>",">=75"],
        datasets: [{
          label: '# of Votes',
          data: [this.d,this.e,this.f],
          backgroundColor: [
            'rgba(255,99,132,0.2)',
            'rgba(54,162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
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

}
