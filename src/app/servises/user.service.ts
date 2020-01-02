import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model'
import { error } from 'util';
//import { tokenKey } from '@angular/core/src/view';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { Socket } from 'ngx-socket-io';
import { DoctorService } from './doctor.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private connect: boolean[] = [false, false];
  private userRole = new BehaviorSubject<boolean[]>(this.connect);
  private userName: string = '';
  private userUpdated = new BehaviorSubject<string>(this.userName);
  private headers: HttpHeaders;
  private tag: string = '';
  private tagUpdated = new BehaviorSubject<string>(this.tag);

  constructor(private http: HttpClient, private router: Router, public socket: Socket, public sharedService: SharedService, private doctorService: DoctorService) {
    this.sharedService.getTokenListener().subscribe((headers: HttpHeaders) => {
      this.headers = headers;
    });
    if (this.headers.has("Authorization")) {
      this.connect[0] = true;
      this.userName = localStorage.getItem('name');
      this.userUpdated.next(this.userName);
      this.checkRole();
      if (this.tag == 'doctor') {}
      //  this.doctorService.myWatingList();
    }
  }

  createNewUser(user: User) {
    if (user.password == user.passwordConf) {
      this.http.post<{ message: string, token: string, tag: string }>('http://localhost:3000/cp/users/create', user)
        .subscribe((responseData) => {
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('name', user.username);
          this.tag = responseData.tag;
          this.tagUpdated.next(this.tag);
          if (this.tag == 'doctor') {}
          //  this.doctorService.myWatingList();
          this.connect[0] = true;
          this.connect[1] = false;
          this.userRole.next([...this.connect]);
          this.userName = user.username;
          this.userUpdated.next(this.userName);
          this.sharedService.setToken(responseData.token);
          this.socket.emit('userConnection', user.username);
          this.router.navigate(['/home-page']);
        }, error => {
          alert('Error' + ":" + error.massage);
        });
    } else
      alert('Passwords do not match.');
  }

  logIn(user: User) {
    this.http.post<{ message: string, token: string, tag: string }>('http://localhost:3000/cp/profile', user)
      .subscribe((responseData) => {
        if (responseData.message != 'Wrong Credentials') {
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('name', user.username);
          this.sharedService.setToken(responseData.token);
          /*this.tag = responseData.tag;
          this.tagUpdated.next(this.tag);*/
          this.connect[0] = true;
          this.userName = user.username;
          this.userUpdated.next(this.userName);
          this.checkRole();
          this.socket.emit('userConnection', user.username);
          setTimeout(() => {
            if (this.tag == 'doctor')
              this.doctorService.getDoctor(user.username);
          }, 1000)
          this.router.navigate(['/home-page']);
        } else
          alert(responseData.message);
      }, error => {
        alert('Error' + ":" + error.message);
      });
  }

  logOut() {
    this.socket.emit('disconected', this.userName);
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    this.sharedService.deleteToken();
    this.connect[0] = false;
    this.connect[1] = false;
    this.userRole.next([...this.connect]);
    this.userName = '';
    this.userUpdated.next(this.userName);
    this.router.navigate(['/home-page']);
  }

  checkRole() {
    this.http.get<{ message: string, tag: string }>('http://localhost:3000/cp/users/checkRole', { headers: this.headers })
      .subscribe((responseData) => {
        if (responseData.message == "Admin")
          this.connect[1] = true;
        else
          this.connect[1] = false;
        this.userRole.next([...this.connect]);
        this.tag = responseData.tag;
        this.tagUpdated.next(this.tag);
      });
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  getUserRoleListener() {
    return this.userRole.asObservable();
  }
  getTagListener() {
    return this.tagUpdated.asObservable();
  }
}
