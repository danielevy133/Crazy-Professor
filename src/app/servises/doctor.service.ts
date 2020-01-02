import { Injectable } from '@angular/core'
import { Subscription, BehaviorSubject } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { WaitingList } from '../models/waitingList.model';



@Injectable({ providedIn: 'root' })
export class DoctorService {

  private doctors: Doctor[] = [];
  private doctorsUpdated = new BehaviorSubject<Doctor[]>(this.doctors);
  private doctor: Doctor;
  private doctorUpdated = new BehaviorSubject<Doctor>(this.doctor);
  private headers: HttpHeaders;

  constructor(private router: Router, private http: HttpClient, public sharedService: SharedService, private socket: Socket) {//, private userService: UserService) {
    this.sharedService.getTokenListener().subscribe((headers: HttpHeaders) => {
      this.headers = headers;
    });
  }

  getDoctors() {
    this.http.get<{ message: string, professors: Doctor[] }>('http://localhost:3000/cp/professors/all', { headers: this.headers })
      .subscribe((responseData) => {
        if (responseData.message == 'professors fetched successfully!') {
          for (let doctor of responseData.professors) {
            const newWaitingList = [];
            for (let wait of doctor.waitingList)
              newWaitingList.push({ patient: wait.patient, dateCome: new Date(wait.dateCome), getMassage: wait.getMassage });
            doctor.waitingList = newWaitingList;
          }
          this.doctors = responseData.professors;
          this.doctorsUpdated.next([...this.doctors]);
          this.doctorUpdated.next(this.doctor);
        }
      }, error => {
        alert('Error' + ":" + error.massage);
      });
  }

  addWaitingList(id,doctorUsername,username) {
    this.http.put<{ message: string, wait: WaitingList }>('http://localhost:3000/cp/professors/add_waiting_list', { id: id }, { headers: this.headers })
      .subscribe((responseData) => {
        if (responseData.message == 'sccess!') {
          const newWait: WaitingList = {
            patient: responseData.wait.patient,
            dateCome: new Date(responseData.wait.dateCome),
            getMassage: responseData.wait.getMassage
          }
          const doctor = this.getTheDoctor(doctorUsername);
          doctor.waitingList.push(newWait);
          doctor.availability = false;
          this.doctorsUpdated.next([...this.doctors]);
          this.doctorUpdated.next(this.doctor);
          if (doctor.waitingList.length == 1)
            this.socket.emit('send_massage', { username: username, massage: 'your turn' });
          this.socket.emit('send_massage', { username: doctorUsername, massage: 'new patient' });
          this.socket.emit('get_new_wait', { doctorUsername: doctorUsername, wait: newWait });
        }
      }, error => {
        alert('Error' + ":" + error.massage);
      });
  }

  addToWaitingList(doctorUsername, wait) {
    const newWait: WaitingList = {
      patient: wait.patient,
      dateCome: new Date(wait.dateCome),
      getMassage: wait.getMassage
    }
    const doctor = this.getTheDoctor(doctorUsername);
    doctor.waitingList.push(newWait);
    doctor.availability = false;
    this.doctorsUpdated.next([...this.doctors]);
    this.doctorUpdated.next(this.doctor);
  }

  closeMeeting(patientId) {
    this.http.put<{ message: string, waitingList: WaitingList[] }>('http://localhost:3000/cp/professors/availability', { patientId: patientId }, { headers: this.headers })
      .subscribe((responseData) => {
        if (responseData.message == 'sccess!') {
          if (responseData.waitingList.length > 0) {
            const newWaitingList: WaitingList[] = [];
            for (let wait of responseData.waitingList)
              newWaitingList.push({ patient: wait.patient, dateCome: new Date(wait.dateCome), getMassage: wait.getMassage });
            this.doctor.waitingList = newWaitingList;
            this.doctorsUpdated.next([...this.doctors]);
            this.doctorUpdated.next(this.doctor);
            this.socket.emit('send_massage', { username: this.doctor.waitingList[0].patient.username, massage: 'your turn' });
            this.socket.emit('get_massage', { beforPatient: patientId, username: this.doctor.waitingList[0].patient.username, doctorUsername: this.doctor.user.username });

          } else {
            this.doctor.waitingList = [];
            this.doctorsUpdated.next([...this.doctors]);
            this.doctorUpdated.next(this.doctor);
          }
        }
      });
  }

  deleteWaitingList(id, doctorUsername, wait) {
    this.http.put<{ message: string, Professor: Doctor }>('http://localhost:3000/cp/professors/delete_waiting_list', { id: id }, { headers: this.headers })
      .subscribe((responseData) => {
        if (responseData.message == 'sccess!') {
          this.getTheDoctor(doctorUsername).waitingList.splice(this.getTheDoctor(doctorUsername).waitingList.indexOf(wait), 1);
          this.doctorsUpdated.next([...this.doctors]);
          this.doctorUpdated.next(this.doctor);
          this.socket.emit('delete_appointment', { doctorUsername: doctorUsername, wait: wait});
        }
      });
  }

  deleteWait(doctorUsername, wait) {
    this.getTheDoctor(doctorUsername).waitingList.splice(this.getTheDoctor(doctorUsername).waitingList.indexOf(wait), 1);
    this.doctorsUpdated.next([...this.doctors]);
    this.doctorUpdated.next(this.doctor);
  }

  getMassage(username, doctorUsername, beforPatient) {
    const doctor = this.getTheDoctor(doctorUsername);
    for (let wait of doctor.waitingList) {
      if (beforPatient == wait.patient._id) {
        doctor.waitingList.splice(doctor.waitingList.indexOf(wait), 1);
      }
      if (username == wait.patient.username) {
        wait.getMassage = true;
      }
    }
    this.doctorsUpdated.next([...this.doctors]);
    this.doctorUpdated.next(this.doctor);
  }

  getTheDoctor(username) {
    for (let doctor of this.doctors)
      if (doctor.user.username === username) {
        return doctor;
      }
  }

  getDoctor(username) {
    for (let doctor of this.doctors)
      if (doctor.user.username == username)
        this.doctor = doctor;
    this.doctorUpdated.next(this.doctor);
  }

    getDoctorsUpdateListener() {
      return this.doctorsUpdated.asObservable();
  }

    getDoctorUpdateListener() {
      return this.doctorUpdated.asObservable();
  }

}
