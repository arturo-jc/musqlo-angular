import { Injectable } from '@angular/core';
import { ApolloError, ApolloQueryResult } from '@apollo/client/core';
import { MutationResult } from 'apollo-angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogInGQL, LogInQuery, SignUpGQL, SignUpMutation, User } from '../../generated/graphql.generated';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User | undefined>(undefined);

  private _onAuthSuccess = new Subject<User>();

  private _onAuthFail = new Subject();

  private _onLogOut = new Subject();

  user = this._user.asObservable();

  onAuthSuccess = this._onAuthSuccess.asObservable();

  onAuthFail = this._onAuthFail.asObservable();

  onAuthLogout = this._onAuthFail.asObservable();

  constructor(
    private signUpGQL: SignUpGQL,
    private logInGQL: LogInGQL,
  ) { }

  signUp(email: string, password: string, username?: string | null) {
    this.signUpGQL.mutate({ email, password, username })
    .subscribe({
      next: res => this.handleSignUpSuccess(res),
      error: () => this._onAuthFail.next(undefined),
    });
  }

  handleSignUpSuccess(res: MutationResult<SignUpMutation>) {
    if (!res.data?.signUp) { return; }
    this._user.next(res.data.signUp);
    this._onAuthSuccess.next(res.data.signUp);
  }

  login(email: string, password: string) {
    this.logInGQL.fetch({ email, password }).subscribe({
      next: res => this.handleLoginSuccess(res),
      error: () => this._onAuthFail.next(undefined),
    });
  }

  handleLoginSuccess(res: ApolloQueryResult<LogInQuery>) {
    if (!res.data?.logIn) { return; }
    this._user.next(res.data.logIn);
    this._onAuthSuccess.next(res.data.logIn);
  }

}
