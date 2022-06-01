import { NameInitialsPipe } from './../../../pipes/nameinitials';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileImagesComponent } from './profile-images.component';
@NgModule({
  declarations: [
    ProfileImagesComponent,
    NameInitialsPipe
  ],
  exports: [
    ProfileImagesComponent
  ],
  imports: [
      CommonModule
  ],
  providers: [NameInitialsPipe]
})
export class ProfileImagesModule { }