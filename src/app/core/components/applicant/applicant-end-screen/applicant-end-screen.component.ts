import { Component, OnInit } from '@angular/core';

import moment from 'moment';

@Component({
   selector: 'app-applicant-end-screen',
   templateUrl: './applicant-end-screen.component.html',
   styleUrls: ['./applicant-end-screen.component.scss'],
})
export class ApplicantEndScreenComponent implements OnInit {
   public currentDate: string;
   public copyrightYear: string;

   public company: any = {
      name: 'JD FREIGHT INC',
      usdot: 245326,
      phoneContact: '(621) 321-2232',
      location: {
         street: '4747 Research Forest Dr # 185',
         city: 'The Woodlands',
         postalCode: 'TX 77381',
         country: 'USA 1',
      },
   };

   constructor() {}

   ngOnInit(): void {
      this.currentDate = moment().format('MM/DD/YY');
      this.copyrightYear = moment().format('YYYY');
   }
}
