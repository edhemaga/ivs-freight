import { Component, OnInit } from '@angular/core';

import moment from 'moment';

@Component({
   selector: 'app-sph-form-thank-you',
   templateUrl: './sph-form-thank-you.component.html',
   styleUrls: ['./sph-form-thank-you.component.scss'],
})
export class SphFormThankYouComponent implements OnInit {
   public copyrightYear: number;

   constructor() {}

   ngOnInit(): void {
      this.copyrightYear = moment().year();
   }
}
