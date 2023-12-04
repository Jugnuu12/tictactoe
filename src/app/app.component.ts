import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showSplash: boolean = true;

  constructor(private toastr: ToastrService, private router: Router) {

  }
  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
      if (localStorage.getItem('token')) {
        this.toastr.success('Welcome Back')
        this.router.navigate(['/Users']);
      }
      else {
        this.router.navigate(['/login']);
      }
    }, 6800);
  }
}
