import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../servises/user.service';
import { DoctorService } from '../servises/doctor.service';
import { Doctor } from '../models/doctor.model';
import { Socket } from 'ngx-socket-io';
import { WaitingList } from '../models/waitingList.model';

@Component({
  selector: 'cp-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  private username: string = '';
  private userSub: Subscription;
  private doctor: Doctor;
  private doctorSub: Subscription;
  private user: boolean = false;
  private connectSub: Subscription;
  private tag: string = '';
  private tagSub: Subscription;
  private nameApp: string = "Crazy Professor";
  private pictureURL: string = "https://comps.gograph.com/ggb/65992534"
  constructor(private router: Router, private userService: UserService, private doctorService: DoctorService, private socket: Socket) {
    this.socket.on('newMassage', function (massage) {
      alert(massage.massage);
    });
    this.socket.on('newWait', function (massage) {
      doctorService.addToWaitingList(massage.doctorUsername, massage.wait);
    });
    this.socket.on('getMassage', function (massage) {
      doctorService.getMassage(massage.username, massage.doctorUsername, massage.beforPatient);
    });
    this.socket.on('deleteAppointment', function (massage) {
      doctorService.deleteWait(massage.doctorUsername, massage.wait);
    });
  }

  ngOnInit(): void {
    this.doctorService.getDoctors();
    this.connectSub = this.userService.getUserRoleListener().subscribe((connect: boolean[]) => {
      this.user = connect[0];
    });
    this.tagSub = this.userService.getTagListener().subscribe((tag: string) => {
      this.tag = tag;
    });
    this.doctorSub = this.doctorService.getDoctorUpdateListener().subscribe((doctor: Doctor) => {
      this.doctor = doctor;
    });
    this.userSub = this.userService.getUserUpdateListener().subscribe((username: string) => {
      this.username = username;
    });
    setTimeout(() => {
      if (this.tag == 'doctor')
        this.doctorService.getDoctor(this.username);
    }, 500)

  }

  onLogOut() {
    this.userService.logOut();
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSignIn() {
    this.router.navigate(['/sign']);
  }

  onHome() {
    this.router.navigate(['/home-page']);
  }

  onDoctors() {
    this.router.navigate(['/our-doctors']);
  }
}
