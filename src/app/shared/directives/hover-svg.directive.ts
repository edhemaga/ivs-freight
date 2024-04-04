import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
} from '@angular/core';

@Directive({
    selector: '[appHoverSvg]',
    standalone: true,
})
export class HoverSvgDirective {
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

    @Input() set fillHover(value: string) {
        if (value) {
            this._fillHover = value;
        }
    }

    public _fill: string = null;
    public _fillHover: string = null;

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
