import { Component } from '@angular/core';
import { GameService } from 'src/app/Services/game.service';
import { ActivatedRoute } from '@angular/router';

class Player {
  state: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const winStates = [
  [1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 0, 1, 0, 0],
  [1, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 1]
]

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent {
  player1 = new Player('Bibi');
  player2 = new Player('Ganz');
  moveCounter = 0;
  currnetPlayer = this.player1;
  board: (null | "x" | "o")[] = [null, null, null, null, null, null, null, null, null];
  history: { player: string, index: number, move: 'x' | 'o', winner?: string }[] = [];

  winner: string | undefined = '';
  winSomeOne = false;

  constructor(private gameService: GameService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.checkRoute()
  }
  checkRoute() {
    this.route.snapshot.url[0]?.path === 'tic-tac-toe';
  }
  move(index: number, player: Player) {
    if (this.player1.state[index] === 0 && this.player2.state[index] === 0) {
      player.state[index] = 1;
      this.moveCounter++;
      const moveSymbol = this.currnetPlayer === this.player1 ? 'x' : 'o';
      this.board[index] = moveSymbol;
      this.gameService.addMove(player.name, [...this.board], this.winner);
      if (this.moveCounter > 4) {
        this.checkWin(this.currnetPlayer);
      }
      this.currnetPlayer = this.switchCurrentPlayer();
    } else {
      alert("can't move");
    }
  }
  switchCurrentPlayer() {
    return this.currnetPlayer === this.player1 ? this.player2 : this.player1;
  }

  checkWin(player: Player) {
    winStates.map(state => {
      const res = state.map((currElement, index) => {
        return player.state[index] * currElement;
      })
      if (state.toString().includes(res.toString())) {
        this.endGame(player);
      }
    })
  }

  restartGame() {
    this.winner = '';
    this.winSomeOne = false;
    this.player1 = new Player('Bibi');
    this.player2 = new Player('Ganz');
    this.board = [null, null, null, null, null, null, null, null, null];
    this.moveCounter = 0;
  }
  endGame(player: Player) {
    this.winner = player.name + ' Wins!';
    this.winSomeOne = true;
    this.history[this.history.length - 1].winner = this.winner;
  }
}
