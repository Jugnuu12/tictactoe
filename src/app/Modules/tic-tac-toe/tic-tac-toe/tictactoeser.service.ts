import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TictactoeserService {
  private OpponentMove = new Subject<any>();
  public opponentMove$ = this.OpponentMove.asObservable();

  private gameWin = new Subject<any>();
  public gameWinner$ = this.gameWin.asObservable();

  myData(myd: any) {
    this.OpponentMove.next(myd);
  }
  gameWinners(data: any){
    this.gameWin.next(data);
  }
}
