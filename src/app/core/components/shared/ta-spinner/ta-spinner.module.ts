import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaSpinnerComponent } from './ta-spinner.component';
import { LottieModule } from 'ngx-lottie';

@NgModule({
    declarations: [TaSpinnerComponent],
    imports: [CommonModule, LottieModule],
    exports: [TaSpinnerComponent],
})
export class TaSpinnerModule {}
