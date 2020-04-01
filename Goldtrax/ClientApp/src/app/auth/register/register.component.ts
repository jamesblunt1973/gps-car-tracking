import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { UiService } from '../../core/ui.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe';
import { IRegisterData } from '../../shared/models/register.model';
import { Subscription } from 'rxjs';

@AutoUnsubscribe
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  model: IRegisterData = {
    cell: '',
    gender: null,
    name: '',
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
  register() {
    this.loading = true;
    let sub = this.authService.register(this.model).pipe(
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
        this.uiService.showSuccessSnack('ثبت نام با موفقیت انجام شد.');
        // 4- redirect
        this.router.navigate([this.authService.RedirectUrl]);
        this.authService.RedirectUrl = '/'; // reset 
      }, error => {
        console.log(error);
        var str = 'خطا به هنگام ثبت نام. ';
        if (typeof error.error === 'string')
          str += error.error;
        this.uiService.showErrorSnack(str);
    });
    this.subscriptions.push(sub);
  }
}
