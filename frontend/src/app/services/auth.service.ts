import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthenticateGQL, LogInGQL, LogInQuery, LogOutGQL, SignUpGQL, SignUpMutation, User } from '../../generated/graphql.generated';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User | null>(null);

  private _onAuthSuccess = new Subject<User>();

  private _onAuthFail = new Subject<null>();

  private _onLogout = new Subject<null>();

  user = this._user.asObservable();

  onAuthSuccess = this._onAuthSuccess.asObservable();

  onAuthFail = this._onAuthFail.asObservable();

  onLogout = this._onAuthFail.asObservable();

  lsKeys = {
    tokenExpirationDate: 'tokenExpirationDate',
  }

  constructor(
    private logInGQL: LogInGQL,
    private authenticateGQL: AuthenticateGQL,
    private signUpGQL: SignUpGQL,
    private logOutGQL: LogOutGQL,
    private timeService: TimeService,
  ) { }

  signUp(email: string, password: string, username?: string | null) {
    this.signUpGQL.mutate({ email, password, username }).subscribe({
      next: res => this.handleAuthSuccess(res.data?.signUp),
      error: () => this._onAuthFail.next(null),
    });
  }

  logIn(email: string, password: string) {
    this.logInGQL.fetch({ email, password }).subscribe({
      next: res => this.handleAuthSuccess(res.data?.logIn),
      error: () => this._onAuthFail.next(null),
    })
  }

  authenticate() {
    this.authenticateGQL.fetch().subscribe({
      next: res => this.loadUser(res.data?.authenticate),
      error: () => this._onAuthFail.next(null),
    })
  }

  logOut() {
    this.logOutGQL.mutate().subscribe({
      next: () => this.handleLogout(),
      error: () => this._onAuthFail.next(null),
    })
  }

  handleAuthSuccess(handleAuthSuccess: SignUpMutation['signUp'] | LogInQuery['logIn']) {
    this.loadUser(handleAuthSuccess?.user);
    this._tokenExpirationDate = this.calculateExpirationDate(handleAuthSuccess?.expiresIn);
  }

  loadUser(loadUser?: User | null ) {
    if (!loadUser) { return; }
    this._user.next(loadUser);
    this._onAuthSuccess.next(loadUser);
  }

  handleLogout() {
    this._user.next(null);
    this._tokenExpirationDate = undefined;
    this._onLogout.next(null);
  }

  autoAuthenticate() {
    if (!this._tokenExpirationDate) { return; }
    if (this.timeService.currentTimeSeconds > this._tokenExpirationDate) {
      this._tokenExpirationDate = undefined;
      return;
    }
    this.authenticate();
  }

  calculateExpirationDate(expiresIn: number | undefined | null) {
    if (!expiresIn) { return; }
    return this.timeService.currentTimeSeconds + expiresIn;
  }

  private set _tokenExpirationDate(tokenExpirationDate: number | undefined) {
    if (tokenExpirationDate) {
      localStorage.setItem(this.lsKeys.tokenExpirationDate, tokenExpirationDate.toString());
    } else {
      localStorage.removeItem(this.lsKeys.tokenExpirationDate);
    }
  }

  private get _tokenExpirationDate() {
    return Number(localStorage.getItem(this.lsKeys.tokenExpirationDate));
  }

}
