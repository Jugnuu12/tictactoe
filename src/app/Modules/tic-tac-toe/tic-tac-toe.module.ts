import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicTacToeRoutingModule } from './tic-tac-toe-routing.module';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { PreviousRecordComponent } from './previous-record/previous-record.component';
import { ChatComponent } from './chat/chat.component';
import {FormsModule, ReactiveFormsModule,} from '@angular/forms';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [
    TicTacToeComponent,
    PreviousRecordComponent,
    ChatComponent,
    UsersComponent,
    
  ],
  imports: [
    CommonModule,
    TicTacToeRoutingModule,
    FormsModule
  ]
})
export class TicTacToeModule { }
