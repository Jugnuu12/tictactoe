import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { ConstantService } from 'src/app/Services/constant.service';

@Injectable({
  providedIn: 'root'
})
export class ChatservicesService {
  constructor(private http: HttpClient, private ConstantSer: ConstantService) { }
  // getChatList(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.http.get<any>(this.ConstantSer.getChatList, { headers });
  // }

  // getMessageList(): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.http.get<any>(this.ConstantSer.getMessageList, { headers });
  // }
}
