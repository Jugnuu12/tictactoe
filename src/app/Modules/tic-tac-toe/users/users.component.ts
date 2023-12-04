import { Component, HostListener, OnDestroy } from '@angular/core';
import { SignalrService } from 'src/app/Services/signalr.service';
import * as signalR from '@microsoft/signalr';
import { UsersSerService } from './users-ser.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnDestroy {
  users: any;
  notification: string = '';
  gameId: any;

  private hubConnection: signalR.HubConnection;

  constructor(
    private toastr: ToastrService,
    private UsersSerServ: UsersSerService,
    private signalRService: SignalrService,
    private router: Router
  ) {
    // SignalR
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5041/mailHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
  }

  ngOnInit(): void {
    this.GetAllusers();

    // Call the API service function when the app component initializes
    this.startSignalRConnection();
  }

  ngOnDestroy(): void {
    // Ensure to stop the connection when the component is destroyed
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  async startSignalRConnection(): Promise<void> {
    if (this.hubConnection.state === 'Disconnected') {
      await this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connection started successfully.');
          // Implement any logic you need after a successful connection
        })
        .catch((error) => {
          console.error('Error starting SignalR connection:', error);
          throw error; // Propagate the error
        });
    } else {
      console.warn(
        'SignalR connection is already in a connected or connecting state.'
      );
    }

    // Listen for game requests
    this.hubConnection.on(
      'ReceiveGameReq',
      (notification: any, GameID: any, opponantUserId: any) => {
        console.log('ReceiveGameReq is called... ' + notification);
        this.notification = notification;
        this.gameId = GameID;
      }
    );

    this.hubConnection.on(
      'GameReqStatusNotification',
      (gameId: any, GameStatus: any, aponanName: any, aponanUserId: any) => {
        if (GameStatus == 'Accepted') {
          this.notification = `Game request accepted by ${aponanName}. Redirecting to the game...`;
          setTimeout(() => {
            this.router.navigate(['/tic-tac-toe', gameId ,aponanUserId,aponanName]);
          }, 5000);
        } else if (GameStatus == 'Rejected') {
          this.notification = `Game request rejected by ${aponanName}.`;
        }
      }
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.signalRService.leavePage();
    console.log('page is closed');
  }

  GetAllusers() {
    this.UsersSerServ.getAllUsers().subscribe(
      (response: any) => {
        if (response.status == true) {
          this.users = response.players;
        } else {
          this.toastr.error('Error While Players Loading', 'Try Again');
        }
      },
      (error) => {
        this.toastr.error('Error While Players Loading', 'Try Again');
      }
    );
  }

  // send
  sendRequest(userId: any) {
    this.signalRService.sendReqForGame(userId);
  }

  // answer
  AnswerToRequest(id: any, status: any) {
    this.signalRService.AcceptOrReject(id, status);
  }
}
