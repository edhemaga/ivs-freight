import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
} from '@angular/core';

// Enums
import { ChatStringTypeEnum } from '@pages/chat/enums';

@Directive({
    selector: '[appHover]',
})
export class HoverDirective {
    @Input() hoverColor: string = ChatStringTypeEnum.EMPTY;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    // Listen for mouseenter event
    @HostListener('mouseenter') onMouseEnter() {
        this.changeBackgroundColor(this.hoverColor || '');
    }

    // Listen for mouseleave event
    @HostListener('mouseleave') onMouseLeave() {
        this.changeBackgroundColor('');
    }

    private changeBackgroundColor(color: string) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    }
}
