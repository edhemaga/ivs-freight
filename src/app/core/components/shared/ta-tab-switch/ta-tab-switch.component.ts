import { Component, Input, OnInit, EventEmitter, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ta-tab-switch',
  templateUrl: './ta-tab-switch.component.html',
  styleUrls: ['./ta-tab-switch.component.scss']
})
export class TaTabSwitchComponent implements OnInit {

  @Input() tabs: any[];
  @Input() type: string = '';
  @Output() switchClicked = new EventEmitter<any>();


  switchItems: any[] = [
    {
      name: 'Day'
    },
    {
      name: 'Week'
    },
    {
      name: 'Month'
    },
    {
      name: 'Year'
    },
    {
      name: 'Schedule'
    },
  ]

  hoverStyle: any = {
    width: '54px',
    x: '2px'
  }
  

  indexSwitch: number = 0;

  constructor(public elem: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    console.log(this.elem.nativeElement.childNodes[0].childNodes[0])
    this.hoverStyle = this.getElementOffset(this.elem.nativeElement.childNodes[0].childNodes[0]);
  }

  switchTab(e, indx, item){

    this.indexSwitch = indx;

    console.log(e.target.getBoundingClientRect())
    const parentItem = e.target.parentNode.getBoundingClientRect();
    const elementItem = e.target.getBoundingClientRect();
    this.hoverStyle = this.getElementOffset(e.target);
    console.log(this.hoverStyle.x);
    this.switchClicked.emit(item);
  }

  getElementOffset(item){
    const parentItem = item.parentNode.getBoundingClientRect();
    const elementItem = item.getBoundingClientRect();
    return {
      x: elementItem.x - parentItem.x,
      width: elementItem.width
    }

  }

}
