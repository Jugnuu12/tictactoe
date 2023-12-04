import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
//chnges
export class SignalrService {
  private hubConnection: signalR.HubConnection;
  userInfo: any;
  userId: any;
  userName: any;

  constructor() {
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
    this.hubConnection.on('ReceiveGameReq', (notification: any, GameID: any, opponantUserId: any) => {
      console.log("ReceiveGameReq is called... " + notification)
      debugger
      //notifay current user about game req send by someone
    });
    this.hubConnection.on('GameReqStatusNotification', (gameId: any, GameStatus: any, aponanName: any, aponanUserId: any) => {
      // accept ---> navigation to gamebord
      // rejact --> notifay that req is rejacted
    });
    this.hubConnection.on('opponentMove', (board: any, playerName: any) => {
      //push that move to game arry
    });

    //message
    //await Clients.Client(Con).SendAsync("ReceivePrivateMessage", messageResult.messageID, messageResult.message, messageResult.chatId, messageResult.senderID, messageResult.date);
    this.hubConnection.on('ReceivePrivateMessage', (messageID: any, message: any, chatId: any, senderID: any, date: any) => {
      //push this param to chat-->messages 
    });
    //await Clients.Caller.SendAsync("SendMeasseNotifayMe", "Message has been Sent",  messageResult.messageID, messageResult.message, messageResult.chatId, messageResult.senderID, messageResult.date);
    this.hubConnection.on('SendMeasseNotifayMe', (StatusMessage: any, messageID: any, message: any, chatId: any, senderID: any, date: any) => {
      //push this param to chat-->messages 
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

  AcceptOrReject(GameId: any, Status: any) {
    this.hubConnection.invoke('AcceptOrReject', GameId, Status)
  }
  myGameMove(board: any, playerName: any, CUrrentUserid: any, OpponantUserId: any) {
    const userObject = JSON.parse(this.userInfo);
    const userId = userObject.id;
    const userName = userObject.userName;
    this.hubConnection.invoke('GameMove', board, playerName, userId, OpponantUserId)
  }


  //mesage
  SendPrivateMessage(recipientUserId: any, message: any): void {  //recipientUserId is int 
    if (message.trim() == "" || message.trim() == null) {
      return
    }
    // Ensure that the connection is in the 'Connected' state before sending the message
    if (this.hubConnection.state === 'Connected') {

      // Call a server-side hub method to send the private message
      this.hubConnection.invoke('SendPrivateMessage', this.userInfo.id, recipientUserId, message)
        .catch((error) => {
          console.error('Error sending private message:', error);
        });
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }

  }
}
