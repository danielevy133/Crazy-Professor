import { Component, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { Subscription } from 'rxjs';
import { DoctorService } from '../servises/doctor.service';
import { UserService } from '../servises/user.service';

@Component({
  selector: 'cp-our-doctors',
  templateUrl: './our-doctors.component.html',
  styleUrls: ['./our-doctors.component.css']
})
export class OurDoctorsComponent implements OnInit {
  private checked: boolean = true
  private user: boolean = false;
  private userSub: Subscription;
  private tag: string = '';
  private tagSub: Subscription;
  private username: string = '';
  private usernameSub: Subscription;
  private doctors: Doctor[] = [];
  private doctorsSub: Subscription;
  private doctor: Doctor;
  private doctorSub: Subscription;
  constructor(private doctorService: DoctorService, private userService: UserService) {

  }

  ngOnInit() {
    this.doctorService.getDoctors();
    this.doctorsSub = this.doctorService.getDoctorsUpdateListener().subscribe((doctorData: Doctor[]) => {
      this.doctors = doctorData;
    });
    /*
    this.doctorsUnAvailabiltySub = this.doctorService.getDoctorsUnAvailabiltyUpdateListener().subscribe((doctorData: Doctor[]) => {
      this.doctorsUnAvailability = doctorData;
    });
    */
    this.userSub = this.userService.getUserRoleListener().subscribe((connect: boolean[]) => {
      this.user = connect[0];
    });
    this.tagSub = this.userService.getTagListener().subscribe((tag: string) => {
      this.tag = tag;
    });
    this.usernameSub = this.userService.getUserUpdateListener().subscribe((userName: string) => {
      this.username = userName;
    });

  }

  onChange() {
    this.checked = !this.checked;
  }
  
  makeAnAppointment(id, doctorUsername) {
    this.doctorService.addWaitingList(id, doctorUsername, this.username);
  }

}
