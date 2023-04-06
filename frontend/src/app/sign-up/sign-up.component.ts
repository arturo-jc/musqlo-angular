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
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    username: new FormControl(''),
  })

  constructor(
    private signUpGQL: SignUpGQL,
  ) {}

  signUp() {
    const { email, password, username } = this.loginForm.value;

    if (!email || !password) { return; }

    this.signUpGQL.mutate({ email, password, username })
      .subscribe((res) => console.log(res));
  }
}
