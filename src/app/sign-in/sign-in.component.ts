import { Component } from '@angular/core';
import { UserService } from '../servises/user.service';
import { User } from '../models/user.model'
 
@Component({
  selector: 'cp-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent{
 
  constructor(private userService: UserService) { }

  ngSingIn(username, password, passwordconf, tag, firstName, lastName) {
    const SignInUser: User = {
      _id: 'nevermind',
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      password: password.value,
      passwordConf: passwordconf.value,
      tag: tag.value
    };
    this.userService.createNewUser(SignInUser);
  }

 }
