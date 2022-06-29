import { FormControl } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, Output, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ta-tab-switch',
  templateUrl: './ta-tab-switch.component.html',
  styleUrls: ['./ta-tab-switch.component.scss']
})
export class TaTabSwitchComponent implements OnInit, AfterViewInit {

  @Input() tabs: any[];
  @Input() type: string = '';
  @Output() switchClicked = new EventEmitter<any>();
  @ViewChild('t2') t2: any;

  public date1: FormControl = new FormControl();
  public date2: FormControl = new FormControl();

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
    setTimeout(() => {
      this.hoverStyle = this.getElementOffset(this.elem.nativeElement.childNodes[0].childNodes[0]);
    }, 350);
  }

  switchTab(e, indx, item){

    this.indexSwitch = indx;
    this.hoverStyle = this.getElementOffset(e.target);
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

  closeCustomPopover(){
    this.t2.close();
  }

}
