import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ɵBrowserDomAdapter } from '@angular/platform-browser';

@Directive({
    selector: '[appSelectionColor]',
    providers: [ɵBrowserDomAdapter],
})
export class SelectionColorDirective implements OnInit {
    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private dom: ɵBrowserDomAdapter
    ) {}

    ngOnInit() {
        const dom = this.dom;
        const renderer = this.renderer;
        const root = this.elementRef.nativeElement;

        renderer.addClass(this.elementRef.nativeElement, 'selection-color');

        const color = this.elementRef.nativeElement.style.color;
        if (color) {
            const css =
                    '.selection-color::selection { background-color: ' +
                    this.rgba2hex(color) +
                    '20 !important; color: ' +
                    color +
                    ' }',
                head =
                    document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            head.appendChild(style);

            style.appendChild(document.createTextNode(css));
        }
    }

    rgba2hex(rgb: any) {
        // Choose correct separator
        const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(')')[0].split(sep);

        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);

        if (r.length == 1) {
            r = '0' + r;
        }
        if (g.length == 1) {
            g = '0' + g;
        }
        if (b.length == 1) {
            b = '0' + b;
        }

        return '#' + r + g + b;
    }
}
