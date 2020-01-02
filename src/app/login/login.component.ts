import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../servises/user.service';

@Component({
  selector: 'cp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  user: boolean = false;
  constructor(private router: Router, private userService: UserService) { }

  ngLogin(username, password) {
    const loginUser: User = {
      _id: 'nevermind',
      firstName: 'nevermind',
      lastName: 'nevermind',
      tag: 'nevermind',
      username: username.value,
      password: password.value,
      passwordConf: 'nevermind'
    };
    this.userService.logIn(loginUser);
  }
}
