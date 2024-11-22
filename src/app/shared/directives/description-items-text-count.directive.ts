import {
    Directive,
    Input,
    ElementRef,
    Renderer2,
    AfterViewInit,
} from '@angular/core';

@Directive({
    selector: '[appDescriptionItemsTextCount]',
    standalone: true,
})
export class DescriptionItemsTextCountDirective implements AfterViewInit {
    @Input('appDescriptionItemsTextCount')
    set items(value: string[]) {
        this._items = value;

        this.updateItems();
    }

    @Input() itemSpecialStylesIndexArray: number[] = [];
    @Input() containerWidth: number;
    @Input() separator: string = '•';

    private _items: string[] = [];

    constructor(private element: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit(): void {
        this.updateItems();
    }

    private updateItems(): void {
        const container = this.element.nativeElement;

        // clear the container and set styles
        this.renderer.setProperty(container, 'innerHTML', '');

        this.renderer.setStyle(container, 'display', 'inline-block');
        this.renderer.setStyle(container, 'overflow', 'hidden');
        this.renderer.setStyle(container, 'white-space', 'nowrap');

        let currentWidth = 0;
        let overflowCount = 0;

        for (let i = 0; i < this._items.length; i++) {
            const item = this._items[i];
            const isLastItem = i === this._items.length - 1;

            // create span for the item
            const itemSpan = this.createSpan(item, i);
            const itemWidth = this.getTextWidth(item);
            const separatorWidth = isLastItem
                ? 0
                : this.getTextWidth(` ${this.separator} `);

            // check if item and separator fit
            if (
                currentWidth + itemWidth + separatorWidth <=
                this.containerWidth
            ) {
                this.renderer.appendChild(container, itemSpan);
                currentWidth += itemWidth;

                // add separator if not the last item
                if (!isLastItem) {
                    const separatorSpan = this.createSpan(
                        ` ${this.separator} `
                    );

                    this.renderer.setStyle(
                        separatorSpan,
                        'margin',
                        '0 4px 0 4px'
                    );

                    this.renderer.appendChild(container, separatorSpan);

                    currentWidth += separatorWidth;
                }
            } else {
                // handle truncation
                const remainingSpace = this.containerWidth - currentWidth;

                if (remainingSpace > 0) {
                    const truncatedSpan = this.createSpan(item, i);

                    this.renderer.setStyle(truncatedSpan, 'overflow', 'hidden');
                    this.renderer.setStyle(
                        truncatedSpan,
                        'text-overflow',
                        'ellipsis'
                    );
                    this.renderer.setStyle(
                        truncatedSpan,
                        'max-width',
                        `${remainingSpace}px`
                    );

                    this.renderer.appendChild(container, truncatedSpan);
                }

                // count remaining items as overflow
                overflowCount = this._items.length - i;

                break;
            }
        }

        // add overflow count if necessary
        if (overflowCount > 0) {
            const overflowContainer = this.renderer.createElement('div');

            this.renderer.addClass(overflowContainer, 'items-counter-count');

            const overflowSpan = this.createSpan(
                `+${overflowCount}`,
                null,
                true
            );

            this.renderer.appendChild(overflowContainer, overflowSpan);
            this.renderer.appendChild(container, overflowContainer);
        }
    }

    private createSpan(
        text: string,
        index?: number,
        isOverflowCountSpan?: boolean
    ): HTMLElement {
        const span = this.renderer.createElement('span');

        this.renderer.setProperty(span, 'textContent', text);

        this.renderer.addClass(span, 'text-color-black-2');
        this.renderer.addClass(
            span,
            isOverflowCountSpan ? 'text-size-11' : 'text-size-14'
        );
        this.renderer.addClass(
            span,
            isOverflowCountSpan ? 'ta-font-medium' : 'ta-font-regular'
        );

        this.renderer.setStyle(span, 'white-space', 'nowrap');

        // apply special style if the index is in itemSpecialStylesIndexArray
        if (this.itemSpecialStylesIndexArray.includes(index))
            this.renderer.addClass(span, 'text-color-blue-18');

        return span;
    }

    private getTextWidth(text: string): number {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        const style = getComputedStyle(this.element.nativeElement);

        context.font = `${style.fontSize} ${style.fontFamily}`;

        return context.measureText(text).width;
    }
}
