import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ILoginData } from '../shared/models/login.model';
import { IRegisterData } from '../shared/models/register.model';
import { IUser } from '../shared/models/user.model';



@Injectable()
export class AuthService {
  private redirectUrl: string = '/';
  private user$ = new BehaviorSubject<IUser>(null);
  private user: IUser;

  constructor(private router: Router, private http: HttpClient) { }

  set RedirectUrl(value: string) {
    this.redirectUrl = value;
  }

  get RedirectUrl() {
    return this.redirectUrl;
  }

  set User(value: IUser) {
    this.user = value;
  }

  get User() {
    return this.user;
  }

  setUser(user: IUser) {
    this.user = user;
    this.user$.next(user);
  }

  userStatus(): Observable<IUser> {
    return this.user$.asObservable();
  }

  register(data: IRegisterData): Observable<IUser> {
    return this.http.post<IUser>(environment.apiUrl + 'auth/register', data);
  }

  login(data: ILoginData): Observable<IUser> {
    return this.http.post<IUser>(environment.apiUrl + 'auth/login', data);
  }

  logout() {
    localStorage.removeItem('token');
    this.setUser(null);
    this.router.navigate(['/auth']);
  }

  checkUser(): boolean | Observable<boolean> {
    if (this.user)
      return true;
    var token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['auth/login']);
      return false;
    }
    return this.http.get<IUser>(environment.apiUrl + 'auth/checkUser').pipe(
      map(res => {
        if (res && res.name) {
          localStorage.setItem('token', res.token);
          this.setUser(res);
          return true;
        }
        else {
          localStorage.removeItem('token');
          this.router.navigate(['auth/login']);
          return false;
        }
      })
    );
  }
}
