import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input('appTooltip') tooltipTitle: string;
  @Input() position: string;
  @Input() main_id = '';
  @Input() delay = 500;
  @Input() duration = 300;
  @Input() tatooltipvisible = true;
  tooltip: HTMLElement;
  offset = 5;
  @Input() tooltipBackground = '#28529f';
  @Input() tooltipColor = '#fff';
  @Input() zIndex = '2000';
  @Input() borderRadius: string;
  @Input() boxShadow: string;
  @Input() fontWeight: string;
  @Input() fontSize: string;

  constructor(public el: ElementRef, public renderer: Renderer2) {
  }

  public testPos() {
    const page = document.body.offsetWidth;
    const element = this.el.nativeElement.getBoundingClientRect().right;
    return page - element < 100;
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip && !document.getElementById(this.main_id)) {
      if (this.testPos()) {
        this.position = 'bottom-left';
      }
      if (this.tatooltipvisible === true) {
        this.show();
      }
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }

  @HostListener('click') onMouseClick() {
    if (this.tooltip) {
      this.hideOnClick();
    }
  }

  @HostListener('contextmenu') onMouseRightClick() {
    if (this.tooltip) {
      this.hideOnClick();
    }
  }

  public suma(): number {
    return Number(this.delay) + Number(this.duration);
  }

  public show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ta-tooltip-show');
  }

  public hide() {
    this.renderer.removeClass(this.tooltip, 'ta-tooltip-show');
    window.setTimeout(() => {
      if (this.tooltip) {
        this.renderer.removeChild(document.body, this.tooltip);
      }
      this.tooltip = null;
    });
  }

  public hideOnClick() {
    setTimeout(() => {
      this.renderer.removeClass(this.tooltip, 'ta-tooltip-show');
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    });
  }

  public create() {
    this.tooltip = this.renderer.createElement('span');
    this.tooltip.id = this.main_id;

    this.renderer.appendChild(this.tooltip, this.renderer.createText(this.tooltipTitle));

    this.renderer.appendChild(document.body, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ta-tooltip');
    this.renderer.addClass(this.tooltip, `ta-tooltip-${this.position}`);

    this.renderer.setStyle(this.tooltip, 'transition', `${this.duration}ms`);
    this.renderer.setStyle(this.tooltip, 'transition-delay', `${this.delay}ms`);
    this.renderer.setStyle(this.tooltip, 'z-index', this.zIndex);
    this.renderer.setStyle(this.tooltip, 'border-radius', this.borderRadius);
    this.renderer.setStyle(this.tooltip, 'box-shadow', this.boxShadow);
    this.renderer.setStyle(this.tooltip, 'font-weight', this.fontWeight);
    this.renderer.setStyle(this.tooltip, 'font-size', this.fontSize);
    console.log("CREATED")
  }

  public setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();
    const scrollPos =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let top;
    let left;
    let right;

    if (this.position === 'bottom-right') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + hostPos.width / 2;
    }

    if (this.position === 'bottom-right-corner') {
      top = hostPos.bottom + this.offset;
      left = hostPos.left + hostPos.width;
    }

    if (this.position === 'bottom-left') {
      top = hostPos.bottom + this.offset;
      right = document.body.offsetWidth - hostPos.left - hostPos.width / 2;
    }

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    if (this.position === 'bottom-left') {
      this.renderer.setStyle(this.tooltip, 'right', `${right}px`);
    } else {
      this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    }

    this.renderer.setStyle(this.tooltip, 'background', `${this.tooltipBackground}`);
    this.renderer.setStyle(this.tooltip, 'color', `${this.tooltipColor}`);
  }

  ngOnDestroy(): void {
    if (this.tooltip) {
      this.hide();
    }
  }

}
