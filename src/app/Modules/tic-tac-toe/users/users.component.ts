import { ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { SignalrService } from 'src/app/Services/signalr.service';
import * as signalR from '@microsoft/signalr';
import { UsersSerService } from './users-ser.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConnectionserService } from './connectionser.service'
import { TictactoeserService } from '../tic-tac-toe/tictactoeser.service'
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnDestroy {
  users: any;
  notification: any;
  gameId: any;

  private hubConnection: signalR.HubConnection;
  gameStatus: any;

  constructor(
    private tictacsewr: TictactoeserService,
    private ConnectionserService: ConnectionserService,
    private toastr: ToastrService,
    private UsersSerServ: UsersSerService,
    private signalRService: SignalrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // SignalR
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5041/mailHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.notification = this.ConnectionserService.notification$.subscribe(
      (notification) => {
        this.notification = notification;
      }
    );
    this.ConnectionserService.gameStatus$.subscribe((gameStatus) => {
      if (gameStatus.GameStatus == "Accepted") {
        this.toastr.success(gameStatus.aponanName, " Accepted Your request");
        this.gameStatus = gameStatus;
        const data = {
          gameid: gameStatus.gameId,
          Opponentname: gameStatus.aponanName,
          opponentid: gameStatus.aponanUserId
        }
        sessionStorage.setItem('OpponentData', JSON.stringify(data));
        //setting my data
        const userDataString = localStorage.getItem('userData');
        const userInfo = userDataString ? JSON.parse(userDataString) : null;

        if (!userInfo) {
          console.error("User information not available.");
          return;
        }
        const mydata = {
          gameid: gameStatus.gameId,
          myName: userInfo.userName,
          myId: userInfo.id,
        };
        sessionStorage.setItem('myData', JSON.stringify(mydata));
        //
        setTimeout(() => {
          this.gameStatus = null;
          this.router.navigate(['/tic-tac-toe']);
        }, 5000);
      } else if (gameStatus.GameStatus == "Rejected") {
        this.gameStatus = gameStatus;
        this.toastr.error(gameStatus.aponanName, " Rejected Your request");
        setTimeout(() => {
          this.gameStatus = null;
        }, 5000);
      }
    });
  }
  async ngOnInit(): Promise<void> {
    this.GetAllusers();
    // Call the API service function when the app component initializes
    try {
      await this.startSignalRConnection();
      this.signalRService.openNewPage();
      console.log("openNewPage is called");
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      // Handle connection startup errors here
    }
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
  AnswerToRequest(id: any, status: boolean,opponentId : any,aponanName : any) {
    if (status == true) {
      const userDataString = localStorage.getItem('userData');
      const userInfo = userDataString ? JSON.parse(userDataString) : null;

      if (!userInfo) {
        console.error("User information not available.");
        return;
      }
      const data = {
        gameid: id,
        myName: userInfo.userName,
        myId: userInfo.id,
      };
      const opponentData ={
        gameid: id,
        Opponentname: aponanName,
        opponentid: opponentId,
      }
      sessionStorage.setItem('myData', JSON.stringify(data));
      sessionStorage.setItem('OpponentData', JSON.stringify(opponentData));
      setTimeout(() => {
        this.router.navigate(['/tic-tac-toe']);
      }, 5000);
    }
    this.signalRService.AcceptOrReject(id, status);
  }


}
