import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  constructor() { }
  public readonly registerUserUrl: string = 'http://localhost:5041/api/AppUser/Registration'
  public readonly loginUserUrl : string = 'http://localhost:5041/api/AppUser/Login'
  public readonly getAllPlayers : string = 'http://localhost:5041/api/AppUser/GetAllPlayers'

}
