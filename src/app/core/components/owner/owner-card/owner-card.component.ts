import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-owner-card',
   templateUrl: './owner-card.component.html',
   styleUrls: ['./owner-card.component.scss'],
})
export class OwnerCardComponent implements OnInit {
   ownerCard: any[] = [
      {
         unit: '',
      },
   ];

   constructor() {}

   ngOnInit(): void {}
}
