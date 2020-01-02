import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../servises/doctor.service';
import { Doctor } from '../models/doctor.model';
import { Subscription } from 'rxjs';
import { WaitingList } from '../models/waitingList.model';
import { UserService } from '../servises/user.service';

@Component({
  selector: 'cp-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {
  private doctor: Doctor;
  private doctorsSub: Subscription;
  private username: string;
  private usernameSub: Subscription;
  private tag: string = '';
  private tagSub: Subscription;

  constructor(private _route: ActivatedRoute, private doctorService: DoctorService, private userService: UserService) { }

  ngOnInit() {
    this.doctorService.getDoctor(this._route.snapshot.params['doctur.username']);
    this.doctorsSub = this.doctorService.getDoctorUpdateListener().subscribe((doctor: Doctor) => {
      this.doctor = doctor;
    });
    this.tagSub = this.userService.getTagListener().subscribe((tag: string) => {
      this.tag = tag;
    });
    this.usernameSub = this.userService.getUserUpdateListener().subscribe((username: string) => {
      this.username = username;
    });
  }
 
  deleteApointment(wait, daotorId, doctorUsername) {
    this.doctorService.deleteWaitingList(daotorId, doctorUsername, wait);
  }

  finishMeeting(patientId) {
    this.doctorService.closeMeeting(patientId);
  }
  
}
