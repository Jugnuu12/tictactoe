import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConstantService } from 'src/app/Services/constant.service';

@Injectable({
  providedIn: 'root'
})
export class UsersSerService {
  constructor(private http: HttpClient, private ConstantSer: ConstantService) { }

  getAllUsers(): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const model = '';
    return this.http.post<HttpResponse<any>>(this.ConstantSer.getAllPlayers, model, { headers });
  }

}
