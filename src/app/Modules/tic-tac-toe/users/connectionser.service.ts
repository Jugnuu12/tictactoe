import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionserService {
  private notificationSubject = new Subject<any>();
  public notification$ = this.notificationSubject.asObservable();

  private gameStatusSubject = new Subject<any>();
  public gameStatus$ = this.gameStatusSubject.asObservable();

  constructor() {}

  sendNotification(notification: any) {
    this.notificationSubject.next(notification);
  }

  gameStatus(status: any) {
    this.gameStatusSubject.next(status);
  }

}
