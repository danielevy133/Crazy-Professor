import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OurDoctorsComponent } from './our-doctors/our-doctors.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomePageComponent } from './home-page/home-page.component';
//import { DoctorScreanComponent } from './doctor-screan/doctor-screan.component';
import { WaitingListComponent } from './waiting-list/waiting-list.component';
const routes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent },
  { path: 'our-doctors', component: OurDoctorsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign', component: SignInComponent },
  { path: 'waiting_list/:doctur.username', component: WaitingListComponent },
  //{ path: 'doctor-screan', component: DoctorScreanComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
