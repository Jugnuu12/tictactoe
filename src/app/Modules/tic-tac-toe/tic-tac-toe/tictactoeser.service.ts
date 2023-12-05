import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TictactoeserService {
  private OpponentMove = new Subject<any>();
  public opponentMove$ = this.OpponentMove.asObservable();

  myData(myd: any) {
    this.OpponentMove.next(myd);
  }
}
