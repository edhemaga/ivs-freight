import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoFocusDirective } from './auto-focus.directive';
import { InputFocusDirective } from './input-focus.directive';
import { InputRestrictionDirective } from './input-restriction.directive';
import { TextareaAutosizeDirective } from './TextareaAutosize.directive';
import { HoverSvgDirective } from './hoverSvg.directive';

@NgModule({
    declarations: [
        // Directive
        AutoFocusDirective,
        InputFocusDirective,
        InputRestrictionDirective,
        TextareaAutosizeDirective,
        HoverSvgDirective,
    ],
    imports: [CommonModule],
    exports: [
        AutoFocusDirective,
        InputFocusDirective,
        InputRestrictionDirective,
        TextareaAutosizeDirective,
        HoverSvgDirective,
    ],
})
export class DirectivesModule {}
