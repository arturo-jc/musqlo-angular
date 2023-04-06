import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  loginForm = new FormGroup({
    email: new FormControl(undefined),
    password: new FormControl(undefined),
    username: new FormControl(undefined),
  })


}
