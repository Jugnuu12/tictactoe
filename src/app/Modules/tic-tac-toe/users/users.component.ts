import { Component, HostListener } from '@angular/core';
import { SignalrService } from 'src/app/Services/signalr.service';
import * as signalR from '@microsoft/signalr';
import {UsersSerService} from './users-ser.service'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users : any 
  private hubConnection: signalR.HubConnection;
  constructor(private toastr: ToastrService,private UsersSerServ : UsersSerService,private signalRService: SignalrService) {

    //SignalR
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5041/mailHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build()
  }
  async ngOnInit(): Promise<void> {
   this.GetAllusers()
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
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.signalRService.leavePage();
    console.log("page is closed");
  }

  GetAllusers() {
    this.UsersSerServ.getAllUsers().subscribe(
      (response : any) => {
        if (response.status == true) {
          this.users = response.players
        }
        else {
          this.toastr.error('Error While Players Loading', 'Try Again');
        }
      },
      (error) => {
        this.toastr.error('Error While Players Loading', 'Try Again');
      }
    )
  }
  //send
  sendRequest(userId : any){
    this.signalRService.sendReqForGame(userId)
  }
  
}
