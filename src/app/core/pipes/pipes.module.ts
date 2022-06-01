import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { formatDatePipe } from './formatDate.pipe';
import { formatEinPipe } from './formatEin.pipe';
import { formatPhonePipe } from './formatPhone.pipe';
import { formatSsnPipe } from './formatSsn.pipe';

@NgModule({
<<<<<<< HEAD
  declarations: [		SafeHtmlPipe,
    formatDatePipe,
    formatPhonePipe,
    formatEinPipe,
    formatSsnPipe ],
  imports: [CommonModule],
  exports: [SafeHtmlPipe,
    formatDatePipe,
    formatPhonePipe,
    formatEinPipe,
    formatSsnPipe]
=======
  declarations: [SafeHtmlPipe],
  imports: [CommonModule],
  exports: [SafeHtmlPipe],
>>>>>>> develop
})
export class PipesModule {}
