import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import {CookieService} from 'ngx-cookie-service';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import {LoginPage} from '../login/login';
import { AngularFireDatabase } from 'angularfire2/database';

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
  simDate:any;
  currentDate:any;
  payloadData: any[];
  sevenSimData: any[];
  simData:any;
  temperatures: number[];
  constructor(public angularFireDatabase: AngularFireDatabase, public cookieService: CookieService,private deviceService: DeviceService, public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController) {
    this.a=0;
    this.b=0;
    this.c=0;
    this.d=0;
    this.e=0;
    this.f=0;
    this.payloadData=[];
    this.temperatures=[];
    this.showCenti=true;
    this.showFahr=true;
    this.tmax = parseFloat(this.cookieService.get('tMax'));
    this.tmin = parseFloat(this.cookieService.get('tMin'));
    console.log(navParams.get('data'));
    if(navParams.get('data')=="0"){
      var simId ='0';
      var macId = this.cookieService.get('machineId');
      console.log(macId);
    }
    else if(navParams.get('data')=="1")
    {
      var simId = this.cookieService.get('simulatedId');
      var macId='0';
      console.log(simId);
      this.angularFireDatabase.object('/Device-Data/0/'+simId+'/').valueChanges().subscribe((fireData:any)=>{
      this.simData=fireData;
      console.log(fireData);
      this.currentDate = new Date();
      this.currentDate.setDate(this.currentDate.getDate()-7);
      if(this.cookieService.get('unit')=="celsius"){
      this.simCenti();
      setTimeout(()=>{
        this.doughnutCentigrade();
      },1500);
    }else if(this.cookieService.get('unit')=="fahrenheit"){
      this.simFahren();
      setTimeout(()=>{
        this.doughnutFahrenheit();
      },1500);
    }
    });
    }
    var dateMonthString;
    var dateDayString;
    const date = new Date();
    date.setDate(date.getDate()-7);
    date.setMonth(date.getUTCMonth()+1);
    if(date.getUTCMonth()<10)
    {
      dateMonthString = "0"+date.getUTCMonth().toString();
      console.log("ikkada");
      console.log(dateMonthString);
    }else{
      dateMonthString = date.getUTCMonth().toString();
    }
    if(date.getUTCDate()<=9){
      dateDayString = "0"+date.getUTCDate().toString();
    }else{
      dateDayString = date.getUTCDate().toString();
    }
    const utcTime = date.getUTCFullYear().toString()+"-"+dateMonthString+"-"+dateDayString+"T00:00:00.000Z";
    this.loading();
    //if condition to check if request to mqserver should be made
    if(macId!="0"){
    this.deviceService.getPayloadData(macId,utcTime).subscribe((payloads:any[])=>{
      this.payloadData=payloads['Payloads'];
      console.log(this.payloadData);
      if(this.cookieService.get('unit')=="celsius")
      {
        this.showCenti=false;
        this.showFahr=true;
      for(var i=0;i<this.payloadData.length;i++)
      {
        //this.temperatures.push(this.payloadData[i].Data.temperature); 
        if(parseFloat(this.payloadData[i].Data.temperature)>=parseFloat(this.cookieService.get('tMax'))){
          this.c++;
        }else if((parseFloat(this.payloadData[i].Data.temperature)<parseFloat(this.cookieService.get('tMax')) && parseFloat(this.payloadData[i].Data.temperature)>parseFloat(this.cookieService.get('tMin')))){
          this.b++;
        }else if(parseFloat(this.payloadData[i].Data.temperature)<=parseFloat(this.cookieService.get('tMin'))){
          this.a++;
        }
      }
      console.log(this.a, this.b, this.c);
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
      this.doughnutFahrenheit();
      },2000);
    }    
    });
  }
  }

  simFahren(){
    this.showCenti=true;
    this.showFahr=false;
    for(var i=0;i<this.simData.length;i++)
      {
        this.g = 0;
        this.g=(((parseFloat(this.simData[i].Temperature))*1.8)+32);
        this.simDate = new Date(this.simData[i].DateTime);
        if((this.g)<=this.tmin){
          this.d++
        }else if((this.g)>this.tmin && (this.g)<this.tmax){
          this.e++;
        }else if((this.g)>=this.tmax){
          this.f++;
        }
      }
      console.log("idi fahren");
  }

  simCenti(){
    this.showCenti=false;
    this.showFahr=true;
    for(var i=0;i<this.simData.length;i++)
      {
        this.simDate = new Date(this.simData[i].DateTime);
        if(this.simDate >= this.currentDate)
        {
          //console.log(this.simData[i]);
          if(parseFloat(this.simData[i].Temperature)>=parseFloat(this.cookieService.get('tMax'))){
            this.c++;
          }else if((parseFloat(this.simData[i].Temperature)<parseFloat(this.cookieService.get('tMax')) && parseFloat(this.simData[i].Temperature)>parseFloat(this.cookieService.get('tMin')))){
            this.b++;
          }else if(parseFloat(this.simData[i].Temperature)<=parseFloat(this.cookieService.get('tMin'))){
            this.a++;
          }
        }
      }
      console.log("idi centi");
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
    console.log(this.c);
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

  goScatter(){
    if(!this.navParams.get('data')){
    this.navCtrl.setRoot('ScatterPage');
    }else if(this.navParams.get('data')=="0"){
      this.navCtrl.setRoot('ScatterPage', {
        data: "0"
      });
    }else if(this.navParams.get('data')=="1"){
      this.navCtrl.setRoot('ScatterPage', {
        data: "1"
      });
    }
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
  }

  goBack()
  {
    this.navCtrl.setRoot('HomePage');
  }  
}