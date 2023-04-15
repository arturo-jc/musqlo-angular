import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

type AuthType = 'login' | 'signup';

interface AuthForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  username?: FormControl<string | null>;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  authForm = new FormGroup<AuthForm>({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
  });

  authType!: AuthType;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.setAuthType();

    if (this.authType === 'signup') {
      this.authForm.addControl('username', new FormControl(''));
    };
  }

  setAuthType() {
    const [ urlFragment ] = this.route.snapshot.url;
    const { path } = urlFragment;
    this.authType = path as AuthType;
  }

  authenticate() {
    const { email, password, username } = this.authForm.value;

    if (!email || !password) { return; }

    if (this.authType === 'login') {
      this.authService.login(email, password);
    } else if (this.authType === 'signup') {
      this.authService.signUp(email, password, username);
    }
  }

}
