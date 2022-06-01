import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileImagesComponent } from './profile-images.component';
@NgModule({
  declarations: [
    ProfileImagesComponent,
  ],
  exports: [
    ProfileImagesComponent
  ],
  imports: [
      CommonModule
  ]
})
export class ProfileImagesModule { }