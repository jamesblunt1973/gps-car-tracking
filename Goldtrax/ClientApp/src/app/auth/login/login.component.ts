import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe';
import { ILoginData } from '../../shared/models/login.model';
import { Subscription } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  model: ILoginData = {
    password: '',
    userName: ''
  };
  save = false;
  loading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private uiService: UiService,
    private authService: AuthService) { }
  login() {
    this.loading = true;
    let sub = this.authService.login(this.model).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(res => {
      // 1- save data to local storage
      if (this.save)
        localStorage.setItem('token', res.token);
      // 2- set user data
      this.authService.setUser(res);
      // 3- show snackbar
      let msg = '';
      if (res.gender !== null)
        msg = (res.gender ? 'آقای ' : 'خانم ') + res.name + ' عزیز، خوش آمدید';
      else
        msg = res.name;
      this.uiService.showSuccessSnack(msg);
      // 4- redirect
      this.router.navigate([this.authService.RedirectUrl]);
      this.authService.RedirectUrl = '/'; // reset 
    }, error => {
      let str = 'خطا به هنگام ورود. ';
      if (error.error?.status === 401)
        str = 'نام کاربری یا کلمه عبور اشتباه است';
      this.uiService.showErrorSnack(str);
      console.log(error);
    });
    this.subscriptions.push(sub);
  }
}
