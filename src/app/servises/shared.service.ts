import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SharedService {

  private navBar: boolean = false;
  private navBarUpdated = new BehaviorSubject<boolean>(this.navBar);
  private headers = new HttpHeaders();
  private headerUpdated = new BehaviorSubject<HttpHeaders>(this.headers);

  constructor() {
    if (localStorage.getItem('token') != null) {
      this.setToken(localStorage.getItem('token'));
    }
  }

  setToken(token) {
    if (this.headers.has("Authorization"))
      this.headers = this.headers.set("Authorization", token);
    else
      this.headers = this.headers.append("Authorization", token);
    this.headerUpdated.next(this.headers);
  }

  deleteToken() {
    this.headers = this.headers.delete("Authorization");
    this.headerUpdated.next(this.headers);
  }

  viewNavBar(bool) {
    this.navBar = bool;
    this.navBarUpdated.next(this.navBar);
  }

  getViewNavBarListener() {
    return this.navBarUpdated.asObservable();
  }

  getTokenListener() {
    return this.headerUpdated.asObservable();
  }
} 
