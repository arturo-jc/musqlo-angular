import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogInGQL, SignUpGQL, User } from '../../generated/graphql.generated';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  onLogin = new Subject<User>();

  onLogout = new Subject();

  private _user = new BehaviorSubject<User | undefined>(undefined);

  user = this._user.asObservable();

  constructor(
    private signUpGQL: SignUpGQL,
    private logInGQL: LogInGQL,
  ) { }

  signUp(email: string, password: string, username?: string | null) {
    this.signUpGQL.mutate({ email, password, username })
      .subscribe(res => {
        if (!res.data?.signUp) { return; }
        this._user.next(res.data.signUp);
        this.onLogin.next(res.data.signUp);
      });
  }

  login(email: string, password: string) {
    this.logInGQL.fetch({ email, password })
      .subscribe(res => {
        if (!res.data?.logIn) { return; }
        this._user.next(res.data.logIn);
        this.onLogin.next(res.data.logIn);
      });
  }
}
