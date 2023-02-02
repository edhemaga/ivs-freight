import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
@Component({
  selector: 'app-virtual-scroll',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss']
})
export class VirtualScrollComponent implements OnInit {
  @Input() data: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }


  onScrollChanged(e){
    console.log("SCROLLING", e);
  }

}
