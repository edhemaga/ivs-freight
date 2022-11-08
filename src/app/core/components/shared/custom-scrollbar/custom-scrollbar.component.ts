import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../../../services/shared/shared.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-custom-scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.scss'],
})
export class CustomScrollbarComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('bar', { static: false }) private bar: ElementRef;
  @Output() scrollEvent: EventEmitter<any> = new EventEmitter();
  @Input() scrollBarOptions: any;
  

  scrollTop: number = 5;
  showScrollbar: boolean = false;
  scrollHeight: number = 0;
  scrollRatio: number = 0;
  scrollRatioFull: number = 0;

  isMouseDown: boolean = false;
  startingBarOffsetTop: number = 0;
  barClickPosition: number = 0;
  barClickRestHeight: number = 0;
  private destroy$ = new Subject<void>();
  calculateSizeHeightTimer: any;

  // Table Horizontal Scroll
  tableNotPinedContainer: any;
  tableNotPinedBoundingRect: any;
  tableBarClickPosition: number = 0;
  tableBarClickRestWidth: number = 0;
  tableScrollRatio: number = 0;
  tableScrollRatioFull: number = 0;
  tableScrollWidth: number = 0;

  constructor(
    private ngZone: NgZone,
    private elRef: ElementRef,
    private sharedService: SharedService,
    private chng: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let hasTablePageHeight = false;

    // this.sharedService.emitUpdateScrollHeight
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     hasTablePageHeight = res.tablePageHeight;

    //     this.calculateBarSizeAndPosition(
    //       this.elRef.nativeElement.children[0],
    //       res.tablePageHeight
    //     );
    //   });

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mouseup', () => {
        this.isMouseDown = false;
      });

      document.addEventListener('mousemove', (e) => {
        if (this.isMouseDown) {
          // Regular Scroll
          if (this.scrollBarOptions.showVerticalScrollBar) {
            const offsetBar = e.clientY - this.barClickPosition;
            if (
              offsetBar > -1 &&
              e.clientY + this.barClickRestHeight < window.innerHeight
            ) {
              this.bar.nativeElement.style.transform = `translateY(${offsetBar}px)`;
            }
            this.elRef.nativeElement.children[0].scrollTop =
              (e.clientY - this.barClickPosition) * this.scrollRatioFull;

            if (hasTablePageHeight) {
              this.sharedService.emitTableScrolling.emit(
                (e.clientY - this.barClickPosition) * this.scrollRatioFull
              );
            }
          }
          // Table Scroll
          else {
            const offsetBar = e.clientX - this.tableBarClickPosition;

            if (
              offsetBar > -1 &&
              e.clientX + this.tableBarClickRestWidth <
                this.tableNotPinedBoundingRect.width
            ) {
              this.bar.nativeElement.style.transform = `translateX(${offsetBar}px)`;
              this.scrollEvent.emit({
                eventAction: 'scrolling',
                scrollPosition: offsetBar * this.tableScrollRatioFull
              });
            }
          }
        }
      });

      this.elRef.nativeElement.children[0].addEventListener(
        'scroll',
        this.setScrollEvent.bind(this)
      );

      window.addEventListener('resize', (e: any) => {
        if (!this.isMouseDown && !hasTablePageHeight)
          this.calculateBarSizeAndPosition(
            this.elRef.nativeElement.children[0]
          );
      });
    });
  }

  ngAfterViewInit(): void {
    // Table Scroll
    if (this.scrollBarOptions.showHorizontalScrollBar) {
      setTimeout(() => {
        this.tableNotPinedContainer =
          document.querySelector('.not-pined-columns');

        this.tableNotPinedBoundingRect =
          this.tableNotPinedContainer.getBoundingClientRect();
      }, 100);
    }
  }

  public setScrollEvent(e: any) {
    if (!this.isMouseDown)
      this.calculateBarSizeAndPosition(this.elRef.nativeElement.children[0]);
  }

  setDraggingStart(e: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      this.elRef.nativeElement.children[0].removeEventListener(
        'scroll',
        this.setScrollEvent.bind(this)
      );
    });

    const style = window.getComputedStyle(this.bar.nativeElement);
    const matrix = new DOMMatrixReadOnly(style.transform);

    this.barClickPosition = e.clientY - matrix.m42;
    this.barClickRestHeight = this.scrollHeight - this.barClickPosition;
    this.isMouseDown = true;

    // Table Scroll
    this.tableBarClickPosition = e.clientX - matrix.m41;
    this.tableBarClickRestWidth =
      this.tableScrollWidth - this.tableBarClickPosition;
  }

  calculateBarSizeAndPosition(elem: any, pageHeight?: number) {
    //this.chng.detectChanges();

    setTimeout(() => {
      this.showScrollbar = true;

      // Table Scroll
      if (this.scrollBarOptions.showHorizontalScrollBar) {
        console.log('Ulazi u calculateBarSizeAndPosition');

        const scrollWrapper =  document.querySelector('.not-pined-columns');

        const tableFullWidth = scrollWrapper.scrollWidth;
        const tableVisibleWidth = scrollWrapper.getBoundingClientRect().width;

        this.tableScrollRatio = tableVisibleWidth / tableFullWidth;

        this.tableScrollRatioFull = tableFullWidth / tableVisibleWidth;

        this.tableScrollWidth = this.tableScrollRatio * tableVisibleWidth;

        console.log('Table Full Width')
        console.log(tableFullWidth);

        console.log('Table Visible Width')
        console.log(tableVisibleWidth);

        if (tableFullWidth <= tableVisibleWidth) {
          this.showScrollbar = false;

          this.chng.detectChanges();
        }

        this.scrollEvent.emit({
          eventAction: 'isScrollShowing',
          isScrollBarShowing: this.showScrollbar
        });
      }
      // Regular Scroll
      else {
        const content_height =
          this.elRef.nativeElement.children[0].scrollHeight;
        const visible_height = window.innerHeight;

        if (content_height <= visible_height) {
          this.showScrollbar = false;
          this.chng.detectChanges();
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

      this.chng.detectChanges();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  projectContentChanged(e) {
    clearTimeout(this.calculateSizeHeightTimer);
    this.calculateSizeHeightTimer = setTimeout(() => {
      this.calculateBarSizeAndPosition(this.elRef.nativeElement.children[0]);
    }, 100);
  }
}
