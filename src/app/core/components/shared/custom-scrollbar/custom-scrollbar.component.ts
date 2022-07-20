import { AfterContentInit, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.scss']
})
export class CustomScrollbarComponent implements OnInit, AfterContentInit {
  @ViewChild('contentHolder') private contentHolder: ElementRef;
  scrollTop: number = 5;
  showScrollbar: boolean = false;
  scrollHeight: number = 0;

  isMouseDown: boolean = false;

  constructor(private ngZone: NgZone, private elRef:ElementRef) { }

  ngOnInit(): void {

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener("mousemove", (e) => {
        if( this.isMouseDown ){
          console.dir(document);
          ///document.scrollingElement.scrollTop = e.clientY;
        }
      });

      this.elRef.nativeElement.addEventListener("scroll", () => {
        console.log("MAIN ELEMENT IS SCROLLING");
      })
    });
  }

  ngAfterContentInit(){
    setTimeout(() => {
      this.calculateBarSizeAndPosition(this.elRef.nativeElement.children[0]);
    }, 500);
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    console.dir(event.target);
    this.calculateBarSizeAndPosition(event.target.scrollingElement);
  }

  calculateBarSizeAndPosition(elem){
    const content_height = elem.scrollHeight;
    const visible_height = window.innerHeight;

    this.showScrollbar = true;
    if (content_height < visible_height) {
      this.showScrollbar = false;
      return;
    }

    const scrollRatio = visible_height / content_height;
    this.scrollTop = elem.scrollTop * scrollRatio;

    this.scrollHeight = scrollRatio * visible_height;
  }

}
