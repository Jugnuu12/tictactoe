import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConnectionserService } from '../Modules/tic-tac-toe/users/connectionser.service';
import { TictactoeserService } from '../Modules/tic-tac-toe/tic-tac-toe/tictactoeser.service';
@Injectable({
  providedIn: 'root'
})
//chnges
export class SignalrService {
  private hubConnection: signalR.HubConnection;
  userInfo: any;
  userId: any;
  userName: any;
  notification: any;
  gameId: any;
 public messages = [
    { username: '', text: '!', isCurrentUser: false },

  ];
  
  constructor(private tictactoe: TictactoeserService, private connectionser: ConnectionserService) {
    this.userInfo = localStorage.getItem('userData');
    const userObject = JSON.parse(this.userInfo);
    this.userId = userObject.id;
    this.userName = userObject.userName;
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5041/mailHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();
    this.startSignalRConnection();

    // this functions is called from backend

    // // Listen for game requests
    this.hubConnection.on(
      'ReceiveGameReq',
      (notification: any, GameID: any, opponantUserId: any) => {
        console.log('ReceiveGameReq is called... ' + notification);
        const data = {
          gameId: GameID,
          notification: notification,
          opponent: opponantUserId
        }
        this.connectionser.sendNotification(data)

      }
    );

    this.hubConnection.on(
      'GameReqStatusNotification',
      (gameId: any, GameStatus: any, aponanName: any, aponanUserId: any) => {
        const data ={
          gameId :gameId,
          GameStatus: GameStatus,
          aponanName:aponanName,
          aponanUserId:aponanUserId
        }
        this.connectionser.gameStatus(data)
      }
    );
    this.hubConnection.on('opponentMove', (board: any, playerName: any) => {
      const data = {
        board : board,
        playerName : playerName
      }
      this.tictactoe.myData(data)
    });

    //message
    //await Clients.Client(Con).SendAsync("ReceivePrivateMessage", messageResult.messageID, messageResult.message, messageResult.chatId, messageResult.senderID, messageResult.date);
    this.hubConnection.on('ReceivePrivateMessage', (message: any) => {
      //push this param to chat-->messages
    debugger
      this.messages.push({ username: 'You', text: message, isCurrentUser: false });
      
    });
    //await Clients.Caller.SendAsync("SendMeasseNotifayMe", "Message has been Sent",  messageResult.messageID, messageResult.message, messageResult.chatId, messageResult.senderID, messageResult.date);
    this.hubConnection.on('SendMeasseNotifayMe', (message: any) => {
      //push this param to chat-->messages 
      debugger
      this.messages.push({ username: 'opponant', text: message, isCurrentUser: true });
    });
  }
  ngOnInit() {

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
      console.warn('SignalR connection is already in a connected or connecting state.');
    }
  }
  openNewPage(): void {

    const brwserInfo = navigator.userAgent;
    this.startSignalRConnection();
    // console.log('User-Agent:', userAgent);
    if (this.hubConnection.state === 'Connected') {
      const userObject = JSON.parse(this.userInfo);
      const userId = userObject.id;
      const userName = userObject.username;
      //its wokring now
      this.hubConnection.invoke('OpenNewPage', userId.toString(), userName, brwserInfo.toString()).catch((error) => {
        console.error('Error JoinPrivateChat:', error);
      });
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
  }
  leavePage(): void {
    const userObject = JSON.parse(this.userInfo);
    const userId = userObject.id;
    const userName = userObject.username;
    const brwserInfo = navigator.userAgent;
    // console.log('User-Agent:', userAgent);
    this.hubConnection.invoke('LeavePage', userId.toString());
  }
  logOut() {
    const brwserInfo = navigator.userAgent;
    const userObject = JSON.parse(this.userInfo);
    const userId = userObject.id;
    // console.log('User-Agent:', userAgent);
    if (this.hubConnection.state === 'Connected') {
      this.hubConnection.invoke('LeaveApplication', userId.toString(), brwserInfo.toString()).catch((error) => {
        console.error('Error JoinPrivateChat:', error);
      });
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
    // this.userContextService.logout(); // this is removing current user data
    // this.router.navigateByUrl('/');
  }
  //snd req for game
  sendReqForGame(ToUserId: any) {
    this.hubConnection.invoke('CreateGameBoard', this.userId, this.userName, ToUserId)
  }

  AcceptOrReject(GameId: any, Status: boolean) {
    this.hubConnection.invoke('AcceptOrReject', GameId, Status)
  }
  
  myGameMove(board: any, playerName: any, CUrrentUserid: any, OpponantUserId: any) {
    this.hubConnection.invoke('GameMove', board, playerName, CUrrentUserid, OpponantUserId)
  }


  //mesage
  SendPrivateMessage(recipientUserId: any, message: any): void {  //recipientUserId is int 
    debugger;
    const userObject = JSON.parse(this.userInfo);
    const userId = userObject.id;
    if (message.trim() == "" || message.trim() == null) {
      return
    }
    // Ensure that the connection is in the 'Connected' state before sending the message
    if (this.hubConnection.state === 'Connected') {

      // Call a server-side hub method to send the private message
      this.hubConnection.invoke('SendPrivateMessage', userId, recipientUserId, message)
        .catch((error) => {
          console.error('Error sending private message:', error);
        });
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }

  }
}
