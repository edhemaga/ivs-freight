import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { ScrolllStrategy } from './strategy';

function factory(dir: VirtualScrollComponent) {
  return dir.scrollStrategy;
}

@Component({
  selector: 'app-virtual-scroll',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  providers: [
    {
        provide: VIRTUAL_SCROLL_STRATEGY,
        useFactory: factory,
        deps: [forwardRef(() => VirtualScrollComponent)],
    },
],
})
export class VirtualScrollComponent implements OnInit {


  scrollStrategy: ScrolllStrategy = new ScrolllStrategy(
    0,
    0
); 

  @Input() data: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }


  onScrollChanged(e){
    console.log("SCROLLING", e);
  }

}
