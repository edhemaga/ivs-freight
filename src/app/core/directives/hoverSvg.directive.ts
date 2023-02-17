import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: '[appHoverSvg]',
})
export class HoverSvgDirective {
    public _fill: string = null;
    @Input() set fill(value: string) {
        if (value) {
            this._fill = value;

            this.renderer2.setStyle(
                this.elRef.nativeElement,
                'fill',
                this._fill
            );
        }
    }

    public _fillHover: string = null;
    @Input() set fillHover(value: string) {
        if (value) {
            this._fillHover = value;
        }
    }

    constructor(private elRef: ElementRef, private renderer2: Renderer2) {}

    @HostListener('mouseover')
    onMouseOver() {
        this.renderer2.setStyle(
            this.elRef.nativeElement,
            'fill',
            this._fillHover ? this._fillHover : this._fill
        );
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.renderer2.setStyle(this.elRef.nativeElement, 'fill', this._fill);
    }
}
