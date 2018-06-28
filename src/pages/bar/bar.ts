import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import {CookieService} from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import {MyCustomPayload} from '../../model/MyCustomPayload';
/**
 * Generated class for the BarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bar',
  templateUrl: 'bar.html',
})
export class BarPage {

  @ViewChild('barCentigradeCanvas') barCentigradeCanvas;
  @ViewChild('barFahrenheitCanvas') barFahrenheitCanvas;

  dateStringArray:string[];
  barChart: any;
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
  fah7:number[];
  macId:any;
  showCenti: boolean;
  showFahr: boolean;
  payloadData:any[];
  myCustomPayloadData:MyCustomPayload[];
  constructor(public cookieService: CookieService,private deviceService: DeviceService,public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams) {
    this.payloadData=[];
    this.myCustomPayloadData=[];
    this.fah7=[];
    this.loading();
    this.showCenti=true;
    this.showFahr=true;
    this.macId;

    this.dateStringArray=[];
    for(var i=0;i<7;i++)
    {
    var dateForPopArry = new Date();
    dateForPopArry.setDate(dateForPopArry.getDate()-i);
    this.dateStringArray.push(dateForPopArry.getDate().toString()+"-"+dateForPopArry.getMonth().toString());
    console.log(this.dateStringArray);
    }
    this.dateStringArray.reverse();
    console.log(this.dateStringArray);
    setTimeout(()=>{
      this.day1=parseInt(this.dateStringArray[0]);
      this.day2=parseInt(this.dateStringArray[1]);
      this.day3=parseInt(this.dateStringArray[2]);
      this.day4=parseInt(this.dateStringArray[3]);
      this.day5=parseInt(this.dateStringArray[4]);
      this.day6=parseInt(this.dateStringArray[5]);
      this.day7=parseInt(this.dateStringArray[6]);
      console.log(this.day1,this.day2,this.day3,this.day4,this.day5,this.day6,this.day7)
    },1500);
    if(this.cookieService.get('unit')=="celsius"){
      this.showFahr=true;
      this.showCenti=false;
    setTimeout(() => {
      this.barCentigrade();
    }, 5000);
    }else if(this.cookieService.get('unit')=="fahrenheit"){
      this.showCenti=true;
      this.showFahr=false;
      setTimeout(()=>{
        this.getMaxTemperaturesFahrenheit();
        setTimeout(() => {
          this.barFahrenheit();
        }, 1000);
      },5000);
    }
    setTimeout(()=>{
      this.getMaxTemperatures();
    },999);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarPage');
  }

  getMaxTemperaturesFahrenheit(){
    //console.log(this.myCustomPayloadData[0].maxTemp);
    for(var j=0; j<7;j++){
    this.fah7[j]=(((parseFloat(this.myCustomPayloadData[j].maxTemp))*1.8)+32);
    console.log(this.fah7[j]);
    }
  }

  getMaxTemperatures(){
    this.macId = this.cookieService.get('machineId');
   //getting utc date 7 days before current date in users time zone to pass to payload api as starttime
    var dateMonthString;
    const date = new Date();
    date.setDate(date.getDate()-7);
    date.setMonth(date.getUTCMonth()+1);
    if(date.getUTCMonth()<10)
    {
      dateMonthString = "0"+date.getUTCMonth().toString();
    }
    const utcTime = date.getUTCFullYear().toString()+"-"+dateMonthString+"-"+date.getUTCDate().toString()+"T00:00:00.000Z";
    console.log(utcTime);
    this.deviceService.getPayloadData(this.macId,utcTime).subscribe((data)=>{

      this.payloadData = data['Payloads'];
      for(var i=0;i<this.payloadData.length;i++)
      {
       var currentDate = new Date(this.payloadData[i].Time);
       this.payloadData[i].Time = currentDate.getDate() + "-" + currentDate.getMonth();
       //xconsole.log(this.payloadData[i].Time);
      }

      for(var i=0;i<this.dateStringArray.length;i++)
      {
        var myCurrentPayload = new MyCustomPayload();
        myCurrentPayload.date=this.dateStringArray[i];
        myCurrentPayload.temperatures= [0];
        myCurrentPayload.maxTemp=0;
        this.myCustomPayloadData.push(myCurrentPayload);
      }


      for(var i=0;i<this.myCustomPayloadData.length;i++)
      {
        for(var j=0;j<this.payloadData.length;j++)
        {
          if(this.payloadData[j].Time===this.myCustomPayloadData[i].date)
          {
            if(this.payloadData[j].Data.temperature==null || !this.payloadData[j].Data.temperature)
            {
              this.payloadData[j].Data.temperature=0;
            }
            this.myCustomPayloadData[i].temperatures.push(parseFloat(this.payloadData[j].Data.temperature));
          }
        }
      }

      for(var i=0;i<this.myCustomPayloadData.length;i++)
      {
       
         this.myCustomPayloadData[i].maxTemp = Math.max(...this.myCustomPayloadData[i].temperatures);
      }
      
      
    });

  setTimeout(()=>{
    console.log(this.payloadData);
    console.log(this,this.myCustomPayloadData);
   },5000);
  }

  loading(){
    let load = this.loadingCtrl.create({
      content:'Loading Please Wait....',
      duration: 5000
    });
    load.present();
  }

  goStat(){
    this.navCtrl.setRoot('StatsPage');
  }

  barCentigrade(){
    this.barChart = new Chart(this.barCentigradeCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: this.dateStringArray,
        datasets: [{
          label: 'Max Temperature',
          data: [this.myCustomPayloadData[0].maxTemp,this.myCustomPayloadData[1].maxTemp,this.myCustomPayloadData[2].maxTemp,this.myCustomPayloadData[3].maxTemp,this.myCustomPayloadData[4].maxTemp,this.myCustomPayloadData[5].maxTemp,this.myCustomPayloadData[6].maxTemp],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(143, 225, 99, 0.5)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 206, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            scaleLabel:{
              display:true,
              labelString:'Temperature'
            },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            scaleLabel:{
              display:true,
              labelString:'Day'
            }
          }]
        }
      }
    });

  }

  barFahrenheit(){
    this.barChart = new Chart(this.barFahrenheitCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dateStringArray,
        datasets: [{
          label: 'Maximum Temperature in Fahrenheit',
          data: [this.fah7[0],this.fah7[1],this.fah7[2],this.fah7[3],this.fah7[4],this.fah7[5],this.fah7[6]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(143, 225, 99, 0.5)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 206, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

  }

}
