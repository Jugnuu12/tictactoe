import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { PreviousRecordComponent } from './previous-record/previous-record.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', pathMatch : 'full', component: UsersComponent },
  { path: 'Users', component: UsersComponent },
  { path: 'tic-tac-toe',component: TicTacToeComponent },
  { path: 'previous-record', component: PreviousRecordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicTacToeRoutingModule { }
