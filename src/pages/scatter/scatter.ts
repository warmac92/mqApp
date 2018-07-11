import { Component } from '@angular/core';
import {LoginPage} from '../login/login';
import {CookieService} from 'ngx-cookie-service';
import { AngularFireDatabase } from 'angularfire2/database';
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

  constructor(public angularFireDatabase: AngularFireDatabase, public navCtrl: NavController, public cookieService: CookieService, public navParams: NavParams) {
    if(navParams.get('data')=="0"){
      var simId = '0';
      var macId = this.cookieService.get('machineId');
      console.log(macId);
    }else{
      var macId = '0';
      var simId = this.cookieService.get('simulatedId');
      console.log(simId);
      this.angularFireDatabase.object('/Device-Data/0/'+simId+'/').valueChanges().subscribe((fireData:any)=>{
        this.simData = fireData;
        console.log(fireData);
      });
    }
    console.log(navParams.get('data'));
    setTimeout(()=>{
      this.scatterCentigrade();
    },1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScatterPage');
  }

  scatterCentigrade(){
    var data = google.visualization.arrayToDataTable([
      ['Temperature', 'Humidity'],
      [ 6,      42],
      [ 34,      45],
      [ 21,     34],
      [ 44,      51],
      [ 30,      33.5],
      [ 16.5,    17]
    ]);
    var options = {
      title: 'Temperature vs. Humidity',
      hAxis: {title: 'Temperature', minValue: 0, maxValue: 55},
      vAxis: {title: 'Humidity', minValue: 0, maxValue: 55},
      legend: 'none'
    };
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
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

  goBack()
  {
    this.navCtrl.setRoot('HomePage');
  }

  logout()
  {
    this.navCtrl.setRoot(LoginPage);
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
