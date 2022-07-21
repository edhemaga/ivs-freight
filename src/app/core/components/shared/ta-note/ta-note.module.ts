import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaNoteComponent } from './ta-note.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtmlPipe } from 'src/app/core/pipes/safe-html.pipe';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppTooltipeModule } from '../../shared/app-tooltip/app-tooltip.module';
import { TaNoteContainerComponent } from '../ta-note/ta-note-container/ta-note-container.component';

@NgModule({
  declarations: [TaNoteComponent, TaNoteContainerComponent],
  imports: [CommonModule, NgbModule, PipesModule, AngularSvgIconModule, AppTooltipeModule],
  exports: [TaNoteComponent, TaNoteContainerComponent],
})
export class TaNoteModule {}
