import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    Renderer2,
} from '@angular/core';

import { ShowHidePassConstants } from '../utils/constants/show-hide-pass.constants';
import { ShowHideDirectiveStringEnum } from '../enums/show-hide-directive-string.enum';

@Directive({
    selector: '[appTextToggle]',
    standalone: true,
})
export class TextToggleDirective {
    private hiddenText: string;
    private isVisible: boolean = false;
    private isHovered = false;
    private svg: HTMLElement;
    private tooltip: HTMLElement;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('appTextToggle') set appTextToggle(text: string) {
        this.hiddenText = text;
        this.transformText();
    }

    private createSvg() {
        // Define SVG paths for different states
        let svgPath = ShowHideDirectiveStringEnum.EMPTY_STRING_PLACEHOLDER;
        let hoverSvgPath = ShowHideDirectiveStringEnum.EMPTY_STRING_PLACEHOLDER;

        if (this.isVisible) {
            svgPath = ShowHideDirectiveStringEnum.SVG_EYE;
            hoverSvgPath = ShowHideDirectiveStringEnum.SVG_PASSWORD;
        } else {
            svgPath = ShowHideDirectiveStringEnum.SVG_PASSWORD;
            hoverSvgPath = ShowHideDirectiveStringEnum.SVG_EYE;
        }

        // Create SVG element
        this.svg = this.renderer.createElement(ShowHideDirectiveStringEnum.IMG);
        this.renderer.setAttribute(
            this.svg,
            ShowHideDirectiveStringEnum.SRC,
            this.isHovered ? hoverSvgPath : svgPath
        );
        this.renderer.setAttribute(
            this.svg,
            ShowHideDirectiveStringEnum.ALT,
            ShowHideDirectiveStringEnum.PASSWORD_ICON
        );

        Object.keys(ShowHidePassConstants.SVG_STYLES).forEach(
            (styleKey: string) => {
                this.renderer.setStyle(
                    this.svg,
                    styleKey,
                    ShowHidePassConstants.SVG_STYLES[styleKey]
                );
            }
        );

        // Create tooltip element
        this.tooltip = this.renderer.createElement(
            ShowHideDirectiveStringEnum.SPAN
        );

        const tooltipText = this.isVisible
            ? ShowHideDirectiveStringEnum.HIDE_PASS
            : ShowHideDirectiveStringEnum.SHOW_PASS;
        const tooltipTextNode = this.renderer.createText(tooltipText);

        this.renderer.appendChild(this.tooltip, tooltipTextNode);

        // Loop trough tooltip styles
        Object.keys(ShowHidePassConstants.TOOLTIP_STYLES).forEach(
            (styleKey: string) => {
                this.renderer.setStyle(
                    this.tooltip,
                    styleKey,
                    ShowHidePassConstants.TOOLTIP_STYLES[styleKey]
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
                ShowHideDirectiveStringEnum.LEFT,
                `${tooltipLeft}px`
            );
            this.renderer.setStyle(
                this.tooltip,
                ShowHideDirectiveStringEnum.TOP,
                `${tooltipTop}px`
            );
            this.renderer.setStyle(
                this.tooltip,
                ShowHideDirectiveStringEnum.VISIBILITY,
                ShowHideDirectiveStringEnum.VISIBLE
            );
        });

        this.renderer.listen(this.svg, 'mouseout', () => {
            this.renderer.setStyle(
                this.tooltip,
                ShowHideDirectiveStringEnum.VISIBILITY,
                ShowHideDirectiveStringEnum.HIDDEN
            );
        });

        // Add a click event listener to the SVG element
        this.renderer.listen(
            this.svg,
            ShowHideDirectiveStringEnum.CLICK,
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
            ShowHideDirectiveStringEnum.INNER_HTML,
            ShowHideDirectiveStringEnum.EMPTY_STRING_PLACEHOLDER
        );

        const svg = this.createSvg();

        const textColor = this.isVisible
            ? ShowHideDirectiveStringEnum.COLOR_1
            : ShowHideDirectiveStringEnum.COLOR_2;

        this.renderer.setStyle(
            this.elementRef.nativeElement,
            ShowHideDirectiveStringEnum.COLOR,
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
                ShowHideDirectiveStringEnum.SRC,
                this.isVisible
                    ? ShowHideDirectiveStringEnum.SVG_PASSWORD
                    : ShowHideDirectiveStringEnum.SVG_EYE
            );
        }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.isHovered = false;
        if (this.svg) {
            this.renderer.setAttribute(
                this.svg,
                ShowHideDirectiveStringEnum.SRC,
                this.isVisible
                    ? ShowHideDirectiveStringEnum.SVG_EYE
                    : ShowHideDirectiveStringEnum.SVG_PASSWORD
            );
        }
    }
}
