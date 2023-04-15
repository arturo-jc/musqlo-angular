import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { BehaviorSubject, filter, map, Subject } from 'rxjs';
import { AuthenticateGQL, LogInGQL, LogInQuery, SignUpGQL, SignUpMutation, User } from '../../generated/graphql.generated';
import { TimeService } from './time.service';
import { notEmpty } from '../shared/utils';

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
    this.signUpGQL.mutate({ email, password, username }).subscribe({
      next: res => this.handleSignUpSuccess(res),
      error: () => this._onAuthFail.next(undefined),
    });
  }

  login(email: string, password: string) {
    this.logInGQL.fetch({ email, password }).subscribe({
      next: res => this.handleLoginSuccess(res.data?.logIn),
      error: () => this._onAuthFail.next(undefined),
    })
  }

  authenticate() {
    this.authenticateGQL.fetch().subscribe({
      next: res => this.handleLoginSuccess(res.data?.authenticate),
      error: () => this._onAuthFail.next(undefined),
    })
  }

  handleSignUpSuccess(res: MutationResult<SignUpMutation>) {
    this.handleLoginSuccess(res.data?.signUp?.user);
    this._tokenExpirationDate = res.data?.signUp?.tokenExpirationDate;
  }

  handleLoginSuccess(user?: User | null ) {
    if (!user) { return; }
    this._user.next(user);
    this._onAuthSuccess.next(user);
  }

  autoAuthenticate() {
    if (!this._tokenExpirationDate) { return; }
    if (this.timeService.currentTimeSeconds > this._tokenExpirationDate) { return; }
    this.authenticate();
  }

  private set _tokenExpirationDate(time: number | null | undefined) {
    if (time) {
      localStorage.setItem(this.lsKeys.tokenExpirationDate, time.toString());
    } else {
      localStorage.removeItem(this.lsKeys.tokenExpirationDate);
    }
  }

  private get _tokenExpirationDate() {
    return Number(localStorage.getItem(this.lsKeys.tokenExpirationDate));
  }

}
