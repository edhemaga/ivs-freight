import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './tooltip.directive';
import { AutoFocusDirective } from './auto-focus.directive';
import { InputFocusDirective } from './input-focus.directive';
import { InputRestrictionDirective } from './input-restriction.directive';
import { TextareaAutosizeDirective } from './TextareaAutosize.directive';

@NgModule({
  declarations: [TooltipDirective,
   // Directive
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    TextareaAutosizeDirective,
  ],
  imports: [CommonModule],
  exports: [TooltipDirective,
    AutoFocusDirective,
    InputFocusDirective,
    InputRestrictionDirective,
    TextareaAutosizeDirective,],
})
export class DirectivesModule {}
