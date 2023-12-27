import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
} from '@angular/core';

import { ConstantStringDirectiveEnum } from '../utils/enums/directive.enums';
import { DirectiveConstants } from '../utils/constants/directive.constants';

@Directive({
    selector: '[appTextToggle]',
})
export class TextToggleDirective {
    private hiddenText: string;
    private isVisible: boolean = false;
    private isHovered = false;
    private svg: HTMLElement;
    private tooltip: HTMLElement;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @Input('appTextToggle') set appTextToggle(text: string) {
        this.hiddenText = text;
        this.transformText();
    }

    private createSvg() {
        // Define SVG paths for different states
        let svgPath = ConstantStringDirectiveEnum.EMPTY_STRING_PLACEHOLDER;
        let hoverSvgPath = ConstantStringDirectiveEnum.EMPTY_STRING_PLACEHOLDER;

        if (this.isVisible) {
            svgPath = ConstantStringDirectiveEnum.SVG_EYE;
            hoverSvgPath = ConstantStringDirectiveEnum.SVG_PASSWORD;
        } else {
            svgPath = ConstantStringDirectiveEnum.SVG_PASSWORD;
            hoverSvgPath = ConstantStringDirectiveEnum.SVG_EYE;
        }

        // Create SVG element
        this.svg = this.renderer.createElement(ConstantStringDirectiveEnum.IMG);
        this.renderer.setAttribute(
            this.svg,
            ConstantStringDirectiveEnum.SRC,
            this.isHovered ? hoverSvgPath : svgPath
        );
        this.renderer.setAttribute(
            this.svg,
            ConstantStringDirectiveEnum.ALT,
            ConstantStringDirectiveEnum.PASSWORD_ICON
        );

        Object.keys(DirectiveConstants.SVG_STYLES).forEach(
            (styleKey: string) => {
                this.renderer.setStyle(
                    this.svg,
                    styleKey,
                    DirectiveConstants.SVG_STYLES[styleKey]
                );
            }
        );

        // Create tooltip element
        this.tooltip = this.renderer.createElement(
            ConstantStringDirectiveEnum.SPAN
        );

        const tooltipText = this.isVisible
            ? ConstantStringDirectiveEnum.HIDE_PASS
            : ConstantStringDirectiveEnum.SHOW_PASS;
        const tooltipTextNode = this.renderer.createText(tooltipText);

        this.renderer.appendChild(this.tooltip, tooltipTextNode);

        // Loop trough tooltip styles
        Object.keys(DirectiveConstants.TOOLTIP_STYLES).forEach(
            (styleKey: string) => {
                this.renderer.setStyle(
                    this.tooltip,
                    styleKey,
                    DirectiveConstants.TOOLTIP_STYLES[styleKey]
                );
            }
        );

        // Append tooltip to the host element
        this.renderer.appendChild(this.elementRef.nativeElement, this.tooltip);

        // Add mouseover and mouseout event listeners to show/hide tooltip
        this.renderer.listen(this.svg, 'mouseover', () => {
            const svgRect = this.svg.getBoundingClientRect();
            const svgCenter = svgRect.left + svgRect.width / 2 - 70;
            const tooltipWidth = this.tooltip.offsetWidth;
            const tooltipLeft = svgCenter - tooltipWidth / 2;
            const tooltipTop = svgRect.bottom + 10;

            this.renderer.setStyle(
                this.tooltip,
                ConstantStringDirectiveEnum.LEFT,
                `${tooltipLeft}px`
            );
            this.renderer.setStyle(
                this.tooltip,
                ConstantStringDirectiveEnum.TOP,
                `${tooltipTop}px`
            );
            this.renderer.setStyle(
                this.tooltip,
                ConstantStringDirectiveEnum.VISIBILITY,
                ConstantStringDirectiveEnum.VISIBLE
            );
        });

        this.renderer.listen(this.svg, 'mouseout', () => {
            this.renderer.setStyle(
                this.tooltip,
                ConstantStringDirectiveEnum.VISIBILITY,
                ConstantStringDirectiveEnum.HIDDEN
            );
        });

        // Add a click event listener to the SVG element
        this.renderer.listen(
            this.svg,
            ConstantStringDirectiveEnum.CLICK,
            (event: Event) => {
                event.stopPropagation();
                this.isVisible = !this.isVisible;
                this.transformText();
            }
        );

        return this.svg;
    }

    private transformText() {
        const text = this.isVisible
            ? this.hiddenText
            : '●'.repeat(this.hiddenText.length);

        // Create a text node for the password characters
        const textNode = this.renderer.createText(text);

        // Clear the existing content
        this.renderer.setProperty(
            this.elementRef.nativeElement,
            ConstantStringDirectiveEnum.INNER_HTML,
            ConstantStringDirectiveEnum.EMPTY_STRING_PLACEHOLDER
        );

        const svg = this.createSvg();

        const textColor = this.isVisible
            ? ConstantStringDirectiveEnum.COLOR_1
            : ConstantStringDirectiveEnum.COLOR_2;

        this.renderer.setStyle(
            this.elementRef.nativeElement,
            ConstantStringDirectiveEnum.COLOR,
            textColor
        );

        // Append SVG and textNode to the host element
        this.renderer.appendChild(this.elementRef.nativeElement, svg);
        this.renderer.appendChild(this.elementRef.nativeElement, textNode);
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (this.svg && !this.svg.contains(event.target as Node)) {
            this.isHovered = false;
            this.transformText();
        }
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.isHovered = true;
        if (this.svg) {
            this.renderer.setAttribute(
                this.svg,
                ConstantStringDirectiveEnum.SRC,
                this.isVisible
                    ? ConstantStringDirectiveEnum.SVG_PASSWORD
                    : ConstantStringDirectiveEnum.SVG_EYE
            );
        }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.isHovered = false;
        if (this.svg) {
            this.renderer.setAttribute(
                this.svg,
                ConstantStringDirectiveEnum.SRC,
                this.isVisible
                    ? ConstantStringDirectiveEnum.SVG_EYE
                    : ConstantStringDirectiveEnum.SVG_PASSWORD
            );
        }
    }
}
