import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  constructor() { }
  public readonly registerUserUrl: string = 'http://localhost:5041/api/AppUser/Registration'
  public readonly loginUserUrl : string = 'http://localhost:5041/api/AppUser/Login'
  public readonly getAllPlayers : string = 'http://localhost:5041/api/AppUser/GetAllPlayers'
  public readonly getChatList : string = 'http://localhost:5041/api/Chat/getMyChats'
  public readonly getMessageList : string = 'http://localhost:5041/api/Chat/GetMessages'
}
