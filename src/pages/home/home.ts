import { Component,OnDestroy,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceService } from '../../services/device.service';
import { WeatherService } from '../../services/weather.service';
import { DeviceInfo } from '../../model/DeviceInfo';
import { AlertController } from 'ionic-angular';
import {LoginPage} from '../login/login';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {CookieService} from 'ngx-cookie-service';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral} from '@agm/core';
import { AngularFireDatabase } from 'angularfire2/database';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  devices:any[];
  gateways:any[];
  panel:DeviceInfo[];
  show:boolean[];
  date: Date;
  tMin:number;
  machineId:any;
  simulatedId:any;
  tMax:number;
  hMin:number;
  hMax:number;
  userLat:number;
  userLong:number;
  weatherData:any;
  iconObject:string;
  companyName:string;
  unit:string;
  online:boolean;
  setIntervalId:any;
  defaultZoom:number;
  defaultLat:number;
  defaultLong:number;
  defaultLevels:any;
  Name: any[];
  fireDevices:any;
  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(public angularFireDatabase: AngularFireDatabase, private localNotifications: LocalNotifications, private geolocation: Geolocation,private cookieService: CookieService,private alertCtrl: AlertController,private weatherService: WeatherService,private deviceService: DeviceService,public navCtrl: NavController, public navParams: NavParams) {
   this.date = new Date();
   this.defaultLat=41.58;
   this.defaultLong=-72.545812;
   this.online = window.navigator.onLine;
   this.defaultZoom=7;
   if(!this.cookieService.get('compaName')){
      this.companyName = "Acme Inc.";
    }else{
       this.companyName = this.cookieService.get('compaName');
    }

   this.geolocation.getCurrentPosition().then((resp)=>{
    this.userLat = resp.coords.latitude;
    this.userLong = resp.coords.longitude;
    this.iconObject= 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png';
  }).catch((error)=>{
  })

  if(!this.cookieService.get('unit'))
  {
    this.cookieService.set('unit',"celsius");
  }

  if(this.cookieService.get('unit')=="celsius"){
  
    this.unit="°C";
  }else{
    this.unit="°F";
  }
    if(!this.cookieService.get('tMin') || !this.cookieService.get('tMax') || !this.cookieService.get('hMin') || !this.cookieService.get('hMax') || !this.cookieService.get('unit'))
    {
      this.cookieService.set('tMin',"32");
      this.cookieService.set('tMax',"100");
      this.cookieService.set('hMin',"10");
      this.cookieService.set('hMax',"90");
    }
      this.tMin = parseFloat(this.cookieService.get('tMin'));
      this.tMax = parseFloat(this.cookieService.get('tMax'));
    
  this.updateData();

  this.setIntervalId= setInterval(()=>{
    this.updateData();
   },50000)
  }

  ionViewDidLoad() {
    
  }

  ngOnDestroy()
  {
    console.log('onDestroy Triggered');
    if (this.setIntervalId) {
      clearInterval(this.setIntervalId);
    }
  }

  mapReadyFun(event)
  {
    console.log(event);
      const bounds: LatLngBounds = new google.maps.LatLngBounds();
      setTimeout(()=>{
        for (var i=0;i<this.panel.length;i++) {
          bounds.extend(new google.maps.LatLng(this.panel[i].lat, this.panel[i].long));
          event.fitBounds(bounds);
          this.defaultLevels=event;

        }
      },2000);
      
  
  }

  mapReadyFunTwo(event)
  {
    console.log(event);
      const bounds: LatLngBounds = new google.maps.LatLngBounds();
        for (var i=0;i<this.panel.length;i++) 
        {
          bounds.extend(new google.maps.LatLng(this.panel[i].lat, this.panel[i].long));
          event.fitBounds(bounds);
          this.defaultLevels=event;
        }
  }

  updateData()
  {
    this.date = new Date();
    this.panel=[];
    this.show=[];

    this.deviceService.getAllGateways().subscribe((gatewaysFromApi:any[])=>{
      
      this.gateways=gatewaysFromApi['Gateways'];
      //console.log(this.gateways);
      this.deviceService.getAllDevices().subscribe((devicesFromApi:any[])=>{
        this.devices=devicesFromApi['Devices'];
        //console.log(this.devices);
        for(var i=0;i<this.devices.length;i++)
        { let currentPanel = new DeviceInfo();
          currentPanel.isSimulated =false;
          this.show[i]=false;
          currentPanel.lat = parseFloat(this.gateways[i].Coordinates.X);
          currentPanel.long = parseFloat(this.gateways[i].Coordinates.Y);
          currentPanel.id = this.devices[i].DevEUI;
          currentPanel.name = this.devices[i].Name;
          currentPanel.water = Math.random();
          if(currentPanel.water<0.45 && currentPanel.water>=0)
           {
               currentPanel.waterStatus="NO WATER";
           }
          else if(currentPanel.water>=0.45 && currentPanel.water<0.75)
          {
            currentPanel.waterStatus="RAIN";
            this.rainingLocal();
          }
          else
          {
            currentPanel.waterStatus = "FLOODING";
            this.floodingLocal();
          }
          this.deviceService.getDevice(this.devices[i].DevEUI).subscribe((deviceInf:any)=>{
            
            if(deviceInf.Payload[0].Data.temperature)
            {
              //console.log(this.cookieService.get('unit'));
              if(this.cookieService.get('unit')=="celsius"){
                currentPanel.temperature = deviceInf.Payload[0].Data.temperature;
              }else{
                currentPanel.temperature = ((deviceInf.Payload[0].Data.temperature)*(9/5) + (32) );
              }
            }
            else
            {
              currentPanel.temperature = 0;
            }

            if(deviceInf.Payload[0].Data.humidity)
            {
              currentPanel.humidity= deviceInf.Payload[0].Data.humidity;
            }
            else
            {
              currentPanel.humidity = 0;
            }
            // currentPanel.lat= this.gateways[i].Coordinates.X;

            if(currentPanel.temperature > this.tMax)
            {
              currentPanel.color="salmon";
              this.maxTempLocal();
            }
            else if(currentPanel.temperature < this.tMin)
            {
              currentPanel.color="lightblue";
              this.minTempLocal();
            }
            else
            {
              currentPanel.color="white";
            }
            
          });

          this.deviceService.getDeviceStats(this.devices[i].DevEUI).subscribe((deviceStats:any)=>{
            currentPanel.healthStatus=deviceStats.HealthState;
            currentPanel.batteryLevel=deviceStats.BatteryLevel;
            currentPanel.uplink=deviceStats.Last24HUplinkCount;
            currentPanel.downlink = deviceStats.Last24HDownlinkCount;
          })
          this.panel.push(currentPanel);
        } 
        this.deviceDataFireBase();
      });
    },
  err=>{
    console.log(err.error.error);
    if(err.error.error==="valid token required.")
    {
      let alert = this.alertCtrl.create({
        title: 'Token Expired',
        subTitle: 'Please re-login to the application.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.setRoot(LoginPage);
    }
    else if(!this.online){
      let alert = this.alertCtrl.create({
        title: 'Internet connection lost!',
        subTitle: 'Please make sure that you are connected to the internet.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.setRoot(LoginPage);
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: 'Service temporarily down!',
        subTitle: 'Please contact machineQ support at machineq_support@comcast.com.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.setRoot(LoginPage);
    }
  });
    console.log(this.panel);
  }

  maxTempLocal(){//notification
    this.localNotifications.schedule({
      text: 'Temperature is above the set limit of '+this.cookieService.get('tMax'),
      title: 'mQApp',
      trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
   });
  }

  rainingLocal(){
    this.localNotifications.schedule({
      text: 'It is currently raining',
      title: 'mQApp',
      trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
   });
  }

  floodingLocal(){
    this.localNotifications.schedule({
      text: 'It is currently flooding',
      title: 'mQApp',
      trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
   });
  }

  minTempLocal(){
    this.localNotifications.schedule({
      text: 'Temperature is below the set limit of '+this.cookieService.get('tMin'),
      title: 'mQApp',
      trigger: {at: new Date(new Date().getTime() + 3600)},
      led: 'FF0000',
      sound: null
   });
  }

  toogleAccordion(i)
  { setTimeout(() => {
    if (document.getElementById((i) + '')) {
      document.getElementById((i) + '').scrollIntoView({ behavior: "smooth", block: "start" });
    }

  }, 500);
    if(i!=="doNotToggle")
  {
    this.show[i]=!this.show[i];

    for(var j=0;j<this.show.length;j++)
    {
      if(j!=i)
      {
        this.show[j]=false;
      }
    }
  }
  }

  deviceDataFireBase(){
    this.angularFireDatabase.object('/Devices/').valueChanges().subscribe((fireDevices:any[])=>{
      this.fireDevices=fireDevices;
      if(!this.cookieService.get('cities')){
        var citylength = 5;
      }else{
      var citylength = parseInt(this.cookieService.get('cities'));}
      console.log(this.fireDevices)
      for(var k=0; k<citylength;k++)
      {
      let currentFirePanel = new DeviceInfo();
      currentFirePanel.isSimulated = true;
      currentFirePanel.name = fireDevices[k].Name;
      currentFirePanel.id = fireDevices[k].Id;
      currentFirePanel.batteryLevel = fireDevices[k].BatteryLevel;
      currentFirePanel.healthStatus = fireDevices[k].HealthStatus;
      currentFirePanel.lat =parseFloat(fireDevices[k].Lattitude);
      currentFirePanel.long = parseFloat(fireDevices[k].Longitude);
      currentFirePanel.uplink = fireDevices[k].UpLink;
      currentFirePanel.water = Math.random();
      if(currentFirePanel.water<0.45 && currentFirePanel.water>=0)
      {
        currentFirePanel.waterStatus="NO WATER";
      }
      else if(currentFirePanel.water>=0.45 && currentFirePanel.water<0.75)
      {
        currentFirePanel.waterStatus="RAIN";
        this.rainingLocal();
      }
      else
      {
        currentFirePanel.waterStatus = "FLOODING";
        this.floodingLocal();
      }
      currentFirePanel.downlink = fireDevices[k].DownLink;
      console.log('NAME'+' '+currentFirePanel.name);
      var nameToApi = currentFirePanel.name.split(',')[0];
      this.weatherService.getWeather(nameToApi).subscribe((data:any)=>{
        if(this.cookieService.get('unit')=="celsius"){
          currentFirePanel.temperature=data.main.temp;
          currentFirePanel.humidity=data.main.humidity;
        }else{
          currentFirePanel.temperature = ((data.main.temp)*(9/5) + (32) );
          currentFirePanel.humidity=data.main.humidity;
        }
        if(currentFirePanel.temperature > this.tMax)
        {
          currentFirePanel.color="salmon";
          this.maxTempLocal();
        }
        else if(currentFirePanel.temperature < this.tMin)
        {
          currentFirePanel.color="lightblue";
          this.minTempLocal();
        }
        else
        {
          currentFirePanel.color="white";
        }
      });
    
      this.panel.push(currentFirePanel);
      }
    });
  }

  showStats(i,id,isSim)
  {
   
    if(!isSim)
    {
    this.machineId=id;
    this.cookieService.set('machineId',this.machineId);
    console.log(this.cookieService.get('machineId'));
    this.navCtrl.setRoot('StatsPage', {
      data: "0"
    });
    }
    else
    { //add code to retrieve 7 days data for simulated site
      this.simulatedId=id;
      this.cookieService.set('simulatedId',this.simulatedId);
      console.log(this.cookieService.get('simulatedId'));
      this.navCtrl.setRoot('StatsPage', {
        data: "1"
      });    
    }
  }

  openPage()
  {
    let alert = this.alertCtrl.create({
      title: 'Coming soon!',
      subTitle: 'Functionality is coming soon.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);   
  }

  resetView(value)
  {
    value=this.defaultLevels;
    this.mapReadyFunTwo(value);
  }
}
