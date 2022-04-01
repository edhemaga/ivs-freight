import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaNoteComponent } from './ta-note.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  declarations: [TaNoteComponent],
  imports: [CommonModule, NgbModule, PipesModule],
  exports: [TaNoteComponent],
})
export class TaNoteModule {}
