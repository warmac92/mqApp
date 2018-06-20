import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Util} from '../constants/util';
@Injectable()
export class DeviceService {

  private mqApiString = "https://api.machineq.net/v1/";
  
 

  constructor(private util : Util,private http: HttpClient) {
  

  }

  getDevice(id)
  {
      return this.http.get(this.mqApiString+'devices/'+id,{headers:this.util.SECURED_HEADER});
  }

  getAllDevices()
  {  
    return this.http.get(this.mqApiString+'devices',{headers:this.util.SECURED_HEADER});
  }

  getAllGateways()
  {
      return this.http.get(this.mqApiString+'gateways',{headers:this.util.SECURED_HEADER});
  }


  getDeviceStats(id)
  {
    return this.http.get(this.mqApiString+'devices/'+id+'/statistics',{headers:this.util.SECURED_HEADER});
  }

  getPayloadData(id)
  {
      return this.http.get(this.mqApiString+'devices/'+id+'/payloads',{headers: this.util.SECURED_HEADER});
  }

}
