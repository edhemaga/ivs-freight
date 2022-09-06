import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appHoverSvg]',
})
export class HoverSvgDirective implements OnChanges {
  @Input() fill: string;
  @Input() fillHover: string;

  constructor(private elRef: ElementRef, private renderer2: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fill?.previousValue !== changes.fill?.currentValue) {
      this.fill = changes.fill?.currentValue;
      this.fillHover = changes.fillHover?.currentValue;
      this.renderer2.setStyle(this.elRef.nativeElement, 'fill', this.fill);
    }
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.renderer2.setStyle(
      this.elRef.nativeElement,
      'fill',
      this.fillHover ? this.fillHover : this.fill
    );
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer2.setStyle(this.elRef.nativeElement, 'fill', this.fill);
  }
}
