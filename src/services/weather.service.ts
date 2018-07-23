import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(Name){
    return this.http.get('http://api.openweathermap.org/data/2.5/weather?q='+Name+'&units=metric&APPID=44966a6d0d9585ce6157ef02e59e7fd8');
  }
}
