import { FormControl } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, Output, ElementRef, AfterViewInit, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ta-tab-switch',
  templateUrl: './ta-tab-switch.component.html',
  styleUrls: ['./ta-tab-switch.component.scss']
})
export class TaTabSwitchComponent 
implements OnInit, AfterViewInit, OnChanges {

  @Input() tabs: any[];
  @Input() type: string = '';
  @Output() switchClicked = new EventEmitter<any>();
  @ViewChild('t2') t2: any;

  public date1: FormControl = new FormControl();
  public date2: FormControl = new FormControl();
  tooltip: any;

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
  data1Valid: boolean;
  data2Valid: boolean;

  constructor(public elem: ElementRef, public det: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.date1.valueChanges.subscribe(data => {
      this.data1Valid = data!!;
    });

    this.date2.valueChanges.subscribe(data => {
      this.data2Valid = data!!;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if(changes.tabs){
      setTimeout(() => {
        this.setSwitchActive(changes.tabs.currentValue);
      }, 0)
    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.setSwitchActive(this.tabs);
    }, 350);
    
  }

  public setSwitchActive(tabs){
    const selectedIndex = tabs.findIndex(item => item.checked);

    this.indexSwitch = selectedIndex == -1 ? 0 : selectedIndex;
    
    this.hoverStyle = this.getElementOffset(this.elem.nativeElement.childNodes[0].childNodes[this.indexSwitch]);
  
    this.det.detectChanges();
  }

  switchTab(e, indx, item, t2){
    this.indexSwitch = indx;

    this.tabs.map(item => item.checked = false);
    item.checked = true;
    this.hoverStyle = this.getElementOffset(e.target);
    this.switchClicked.emit(item);
    t2.open();
    this.tooltip = t2;
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
    this.tooltip.close();
  }

}
