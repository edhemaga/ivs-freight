import {
    Directive,
    ElementRef,
    HostListener,
    Renderer2
} from '@angular/core';

@Directive({
    selector: '[appToggleBackground]'
})
export class ToggleBackgroundDirective {
    private isColored = false;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('click') toggleBackgroundColor() {
        if (this.isColored) {
            this.renderer.removeStyle(this.el.nativeElement, 'background-color');
        } else {
            this.renderer.setStyle(this.el.nativeElement, 'background-color', '#E5E5E5');
        }
        this.isColored = !this.isColored;
    }
}
