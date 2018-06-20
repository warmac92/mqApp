import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserLogin} from '../model/UserLogin';

@Injectable()
export class LoginService {

  private mqApiString = "https://api.machineq.net/v1/";
  
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  
  constructor(private http: HttpClient) {


  }

  login(user: UserLogin){
     return this.http.post(this.mqApiString + 'login',user,{headers: this.headers});
  }

  forgotPassword(username){
    return this.http.post(this.mqApiString+ 'account/emailPasswordReset',username,{headers:this.headers});
  }
}
