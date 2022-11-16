import { Component, OnDestroy, OnInit } from '@angular/core';

import moment from 'moment';

@Component({
   selector: 'app-thank-you-component',
   templateUrl: './thank-you.component.html',
   styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit, OnDestroy {
   public email: string;
   public copyrightYear: number;

   constructor() {}

   ngOnInit(): void {
      this.email = JSON.parse(localStorage.getItem('thankYouEmail'));
      this.copyrightYear = moment().year();
   }

   ngOnDestroy(): void {
      localStorage.removeItem('thankYouEmail');
   }
}
