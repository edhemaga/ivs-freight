import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
   selector: 'app-ta-spinner',
   templateUrl: './ta-spinner.component.html',
   styleUrls: ['./ta-spinner.component.scss'],
})
export class TaSpinnerComponent implements OnChanges {
   @Input() size: string; // small, big
   @Input() color: string; // black, gray, white, blueLight, blueDark

   public lottieSpinner: any;

   constructor() {}

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.size?.currentValue != changes.size?.previousValue) {
         this.lottieSpinner = {
            path: `/assets/lottie/ta-lottie-spinner/${
               this.size === 'small' ? '18px' : '32px'
            }/${this.color}.json`,
         };
      }
   }
}
