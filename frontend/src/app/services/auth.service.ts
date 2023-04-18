import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Subject } from 'rxjs';
import { AuthenticateGQL, AuthenticateOutput, LogInGQL, LogInQuery, LogOutGQL, SignUpGQL, SignUpMutation as res, User } from '../../generated/graphql.generated';
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

  isAuthenticated = this._user.pipe(map(user => Boolean(user)));

  onAuthSuccess = this._onAuthSuccess.asObservable();

  onAuthFail = this._onAuthFail.asObservable();

  onLogout = this._onLogout.asObservable();

  redirectUrl: string | undefined;

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

  logOut() {
    this.logOutGQL.fetch().subscribe({
      next: () => this._onLogout.next(null),
      error: () => this._onAuthFail.next(null),
    })
  }

  handleAuthSuccess(authenticateOutput: AuthenticateOutput | undefined | null) {
    if (!authenticateOutput) { return; }

    const authenticatedUser = this.getAuthenticatedUser(authenticateOutput);

    this.loadUser(authenticatedUser);

    this._tokenExpirationDate = this.calculateExpirationDate(authenticateOutput?.expiresIn);
  }

  loadUser(loadUser?: User | null ) {
    if (!loadUser) { return; }
    this._user.next(loadUser);
    this._onAuthSuccess.next(loadUser);
  }

  async checkAuth(): Promise<true> {
    if (!this._tokenExpirationDate) {
      return true;
    }

    if (this.timeService.currentTimeSeconds > this._tokenExpirationDate) {
      this._tokenExpirationDate = undefined;
      return true;
    }

    try {
      const res = await firstValueFrom(this.authenticateGQL.fetch());

      this.handleAuthSuccess(res.data?.authenticate);

    } catch(e) {
      this._onAuthFail.next(null);
    }

    return true;
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

  reset() {
    this._user.next(null);
    this._tokenExpirationDate = undefined;
  }

  getAuthenticatedUser(authenticateOutput: AuthenticateOutput | null | undefined): User | null {
    if (!authenticateOutput) { return null; }
    return {
      id: authenticateOutput.userId,
      email: authenticateOutput.userEmail,
      username: authenticateOutput.username,
    }
  }
}
