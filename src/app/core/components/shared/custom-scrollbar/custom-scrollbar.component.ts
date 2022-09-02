import {
  AfterContentInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-custom-scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.scss'],
})
export class CustomScrollbarComponent implements OnInit, AfterContentInit {
  @ViewChild('bar', { static: false }) private bar: ElementRef;
  scrollTop: number = 5;
  showScrollbar: boolean = false;
  scrollHeight: number = 0;
  scrollRatio: number = 0;
  scrollRatioFull: number = 0;

  isMouseDown: boolean = false;
  startingBarOffsetTop: number = 0;
  barClickPosition: number = 0;
  barClickRestHeight: number = 0;

  constructor(
    private ngZone: NgZone,
    private elRef: ElementRef,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.sharedService.emitUpdateScrollHeight.subscribe((res) => {
      this.calculateBarSizeAndPosition(this.elRef.nativeElement.children[0]);
    });

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mouseup', () => {
        this.isMouseDown = false;
      });
      document.addEventListener('mousemove', (e) => {
        if (this.isMouseDown) {
          const offsetBar = e.clientY - this.barClickPosition;
          if (
            offsetBar > -1 &&
            e.clientY + this.barClickRestHeight < window.innerHeight
          ) {
            this.bar.nativeElement.style.transform = `translateY(${offsetBar}px)`;
          }
          document.scrollingElement.scrollTop =
            (e.clientY - this.barClickPosition) * this.scrollRatioFull;
        }
      });

      document.addEventListener('scroll', this.setScrollEvent.bind(this));
      window.addEventListener('resize', (e: any) => {
        if (!this.isMouseDown)
          this.calculateBarSizeAndPosition(e.target.document.scrollingElement);
      });
    });
  }

  public setScrollEvent(e: any) {
    if (!this.isMouseDown)
      this.calculateBarSizeAndPosition(e.target.scrollingElement);
  }

  setDraggingStart(e: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      document.removeEventListener('scroll', this.setScrollEvent.bind(this));
    });

    const style = window.getComputedStyle(this.bar.nativeElement);
    const matrix = new DOMMatrixReadOnly(style.transform);
    this.barClickPosition = e.clientY - matrix.m42;
    this.barClickRestHeight = this.scrollHeight - this.barClickPosition;
    this.isMouseDown = true;
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.calculateBarSizeAndPosition(this.elRef.nativeElement.children[0]);
    }, 500);
  }

  calculateBarSizeAndPosition(elem) {
    const content_height = elem.scrollHeight;
    const visible_height = window.innerHeight;

    this.showScrollbar = true;

    if (content_height <= visible_height) {
      this.showScrollbar = false;
      return;
    }

    this.scrollRatio = visible_height / content_height;
    this.scrollRatioFull = content_height / visible_height;
    this.scrollTop = elem.scrollTop * this.scrollRatio;

    if (this.bar) {
      this.bar.nativeElement.style.transform = `translateY(${this.scrollTop}px)`;
    }

    this.scrollHeight = this.scrollRatio * visible_height;
  }
}
