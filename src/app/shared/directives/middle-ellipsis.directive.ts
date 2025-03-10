import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appMiddleEllipsis]',
    standalone: true,
})
export class MiddleEllipsisDirective {
    @Input() set content(value: string) {
        if (value) this.squezeContent(value);
    }

    @Input() beforeEllipsisWidth: number;

    constructor(
        private element: ElementRef,
        private renderer: Renderer2
    ) {}

    private squezeContent(content: string): void {
        const beforeEllipsisText: string = content.substring(0, 4);
        const afterEllipsisText: string = content.substring(4);

        const rootElement: HTMLDivElement = this.element.nativeElement;
        const beforeEllipsisElement: HTMLSpanElement = this.createElement(
            'span',
            'mete-start',
            beforeEllipsisText
        );
        const afterEllipsisElement: HTMLSpanElement = this.createElement(
            'span',
            'mete-end',
            afterEllipsisText
        );

        this.renderer.setAttribute(rootElement, 'class', 'mete');

        this.renderer.appendChild(rootElement, beforeEllipsisElement);
        this.renderer.appendChild(rootElement, afterEllipsisElement);
    }

    private createElement(
        htmlElementName: string,
        className: string,
        markup: string
    ): HTMLElement {
        const element: HTMLElement =
            this.renderer.createElement(htmlElementName);

        element.textContent = markup;

        this.renderer.setAttribute(element, 'class', className);

        return element;
    }
}
