import { Injectable } from '@angular/core';
import { ApolloError, ApolloQueryResult } from '@apollo/client/core';
import { MutationResult } from 'apollo-angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthenticateGQL, LogInGQL, LogInQuery, SignUpGQL, SignUpMutation, User } from '../../generated/graphql.generated';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User | null>(null);

  private _onAuthSuccess = new Subject<User>();

  private _onAuthFail = new Subject();

  private _onLogOut = new Subject();

  user = this._user.asObservable();

  onAuthSuccess = this._onAuthSuccess.asObservable();

  onAuthFail = this._onAuthFail.asObservable();

  onAuthLogout = this._onAuthFail.asObservable();

  lsKeys = {
    tokenExpirationDate: 'tokenExpirationDate',
  }

  constructor(
    private signUpGQL: SignUpGQL,
    private logInGQL: LogInGQL,
    private authenticateGQL: AuthenticateGQL,
    private timeService: TimeService,
  ) { }

  signUp(email: string, password: string, username?: string | null) {
    this.signUpGQL.mutate({ email, password, username })
    .subscribe({
      next: res => this.handleSignUpSuccess(res),
      error: () => this._onAuthFail.next(undefined),
    });
  }

  handleSignUpSuccess(res: MutationResult<SignUpMutation>) {
    if (!res.data?.signUp?.user) { return; }
    this._user.next(res.data.signUp.user);
    this._onAuthSuccess.next(res.data.signUp.user);
    this.tokenExpirationDate = res.data.signUp.tokenExpirationDate;
  }

  login(email: string, password: string) {
    this.logInGQL.fetch({ email, password }).subscribe({
      next: res => {
        if (!res.data?.logIn) { return; }
        this.handleLoginSuccess(res.data.logIn);
      },
      error: () => this._onAuthFail.next(undefined),
    });
  }

  authenticate() {
    this.authenticateGQL.fetch().subscribe({
      next: res => {
        if (!res.data?.authenticate) { return; }
        this.handleLoginSuccess(res.data.authenticate);
      },
      error: () => this._onAuthFail.next(undefined),
    })
  }

  handleLoginSuccess(user: User) {
    this._user.next(user);
    this._onAuthSuccess.next(user);
  }

  autoAuthenticate() {
    if (!this.tokenExpirationDate) { return; }
    if (this.timeService.currentTimeSeconds > this.tokenExpirationDate) { return; }
    this.authenticate();
  }

  private set tokenExpirationDate(time: number | null | undefined) {
    console.log(time);
    if (time) {
      localStorage.setItem(this.lsKeys.tokenExpirationDate, time.toString());
    } else {
      localStorage.removeItem(this.lsKeys.tokenExpirationDate);
    }
  }

  private get tokenExpirationDate() {
    return Number(localStorage.getItem(this.lsKeys.tokenExpirationDate));
  }

}
