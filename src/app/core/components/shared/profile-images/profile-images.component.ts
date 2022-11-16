import { NameInitialsPipe } from './../../../pipes/nameinitials';
import { Component, Input, OnInit } from '@angular/core';

@Component({
   selector: 'app-profile-images',
   templateUrl: './profile-images.component.html',
   styleUrls: ['./profile-images.component.scss'],
   providers: [NameInitialsPipe],
})
export class ProfileImagesComponent implements OnInit {
   textColors: string[] = [
      '#6D82C7',
      '#4DB6A2',
      '#E57373',
      '#E3B00F',
      '#BA68C8',
      '#BEAB80',
      '#81C784',
      '#FF8A65',
      '#64B5F6',
      '#F26EC2',
      '#A1887F',
      '#919191',
   ];

   imageColor: string[] = [
      '#6D82C780',
      '#4DB6A280',
      '#E5737380',
      '#E3B00F80',
      '#BA68C880',
      '#BEAB8080',
      '#81C78480',
      '#FF8A6580',
      '#64B5F680',
      '#F26EC280',
      '#A1887F80',
      '#91919180',
   ];

   backgroundColors: string[] = [
      '#DAE0F1',
      '#D2EDE8',
      '#F9DCDC',
      '#F8EBC2',
      '#EED9F1',
      '#EFEADF',
      '#DFF1E0',
      '#FFE2D8',
      '#D8ECFD',
      '#FCDAF0',
      '#E7E1DF',
      '#E3E3E3',
   ];

   @Input() indx: number;
   @Input() size: string;
   @Input() name: any;
   @Input() type: string = 'driver';
   @Input() showHoverAnimation: boolean = true;

   constructor() {}

   ngOnInit(): void {}
}
