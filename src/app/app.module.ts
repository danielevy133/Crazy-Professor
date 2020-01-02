import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MatExpansionModule, MatSlideToggleModule } from '@angular/material';

import { HomePageComponent } from './home-page/home-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OurDoctorsComponent } from './our-doctors/our-doctors.component';
import { DoctorService } from './servises/doctor.service';
import { LoginComponent } from './login/login.component';
//import { DoctorScreanComponent } from './doctor-screan/doctor-screan.component';
import { WaitingListComponent } from './waiting-list/waiting-list.component';


const socketIoConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    OurDoctorsComponent,
    LoginComponent,
    SignInComponent,
    HomePageComponent,
  //  DoctorScreanComponent,
    WaitingListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(socketIoConfig),
    MatExpansionModule,
    FormsModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
