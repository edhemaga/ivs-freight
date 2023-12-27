// shared.module.ts
import { NgModule } from '@angular/core';
import { TextToggleDirective } from './show-hide-pass.directive';

@NgModule({
    declarations: [TextToggleDirective],
    exports: [TextToggleDirective],
})
export class DirectiveCardModule {}
