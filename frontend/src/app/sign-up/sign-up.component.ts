import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUpGQL } from '../../generated/graphql.generated';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  loginForm = new FormGroup({
    email: new FormControl(undefined, [ Validators.required, Validators.email ]),
    password: new FormControl(undefined, [ Validators.required, Validators.minLength(8) ]),
    username: new FormControl(undefined),
  })

  constructor(
    signUpGQL: SignUpGQL,
  ) {}

  signUp() {
  }
}
