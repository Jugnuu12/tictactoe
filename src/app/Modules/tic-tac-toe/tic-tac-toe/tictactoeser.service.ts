import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TictactoeserService {
  private opponentdata = new Subject<any>();
  public opponent$ = this.opponentdata.asObservable();

  private mydatas = new Subject<any>();
  public mydata$ = this.mydatas.asObservable();

  constructor() { }
  opponentData(routesdata: any) {
    this.opponentdata.next(routesdata);
  }

  myData(myd: any) {
    this.mydatas.next(myd);
  }
}
