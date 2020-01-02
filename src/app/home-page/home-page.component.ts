import { Component, OnInit } from '@angular/core';
import { UserService } from '../servises/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../servises/shared.service';

@Component({
  selector: 'cp-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  private username: string='';
  private connectSub: Subscription;
  private userSub: Subscription;
  private user: boolean = false;
  private admin: boolean = false;

  constructor( private userService: UserService, private router: Router, public sharedService: SharedService) { }

  ngOnInit() {
    this.userSub = this.userService.getUserUpdateListener().subscribe((user: string) => {
      this.username = user;
    });

      this.connectSub = this.userService.getUserRoleListener().subscribe((connect: boolean[]) => {
        this.user = connect[0];
        this.admin = connect[1];
    });

  }

  onPie() {
    this.sharedService.viewNavBar(true);
    this.router.navigate(['/pie']);
  }

  onSpenderPie() {
    this.sharedService.viewNavBar(true);
    this.router.navigate(['/big-spenders']);
  }

}
