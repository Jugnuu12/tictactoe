import { Component, Input } from '@angular/core';
import { GameService } from 'src/app/Services/game.service';

@Component({
  selector: 'app-previous-record',
  templateUrl: './previous-record.component.html',
  styleUrls: ['./previous-record.component.scss']
})
export class PreviousRecordComponent {
  history: { player: string, board: (null | "x" | "o")[], winner?: string }[] = [];
  constructor(private gameService: GameService) { }
  ngOnInit() {
    this.history = this.gameService.getHistory();
  }
}
