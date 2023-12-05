import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {FilterPipe} from '../../../pipes/filter.pipe'
import * as signalR from '@microsoft/signalr';
import {SignalrService} from '../../../Services/signalr.service'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @ViewChild('messageContainer', { static: false }) messageContainer: ElementRef | undefined;
  showMwssageDetail: boolean =  false
  searchTerm: string = '';
  messages = [
    { username: 'John', text: 'Hello!', isCurrentUser: false },
    { username: 'Jane', text: 'Hi there!', isCurrentUser: false }
  ];
  private hubConnection: signalR.HubConnection;
  newMessage: string = '';

  constructor(public SignalrService_: SignalrService, private renderer: Renderer2) {
    
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5041/mailHub', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();
    if (this.hubConnection.state === 'Disconnected') {
     this.hubConnection
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

  sendMessage() {
    if (this.newMessage.trim() !== '') {

      this.SignalrService_.SendPrivateMessage(6,this.newMessage); //replace the 6 with opanant id
      // Use setTimeout to wait for DOM update before scrolling
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  }

  private scrollToBottom() {
    if (this.messageContainer) {
      const container = this.messageContainer.nativeElement;
      container.scrollToBottom = container.scrollHeight;
    }
  }
  openChat(user: ChatMessage) {
    this.showMwssageDetail = !this.showMwssageDetail
    console.log('Open chat for:', user.username);
  }
  arrowFun(){
    this.showMwssageDetail = !this.showMwssageDetail
  }
 
}
export interface ChatMessage {
  username: string;
  text: string;
  isCurrentUser: boolean;
  imageUrl?: string; 
  lastMessage?: string;
  onlineStatus?: boolean;
  time?: string;
}
