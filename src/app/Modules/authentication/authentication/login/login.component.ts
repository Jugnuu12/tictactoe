import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private toastr: ToastrService, private loginSer: LoginService, private route: Router) { }
  userData = {
    email: '',
    password: ''
  };
  model: any;

  onSubmit() {
    this.fillmodel()
    this.loginSer.loginUser(this.model).subscribe(
      (response) => {
        if (response.status == true) {
          this.toastr.success('Login Successfully', 'Have fun!');
          localStorage.setItem('token', response.token);
          localStorage.setItem('userData', JSON.stringify(response.userData));
          this.route.navigate(['/Users']);
        }
        else {
          this.toastr.error('Login not Successful', 'Try Again');
        }
      },
      (error) => {
        console.log('error')
      }
    )
  }
  fillmodel() {
    this.model = {
      email: this.userData.email,
      password: this.userData.password
    }
  }
}
