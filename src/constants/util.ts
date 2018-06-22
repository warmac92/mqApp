import {CookieService} from 'ngx-cookie-service';
import {HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';


@Injectable()
export class Util {

  constructor(private cookieService: CookieService) {
  }


  public  get SECURED_HEADER(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'authorization': this.cookieService.get('xAuthToken')
    })
  };

}
