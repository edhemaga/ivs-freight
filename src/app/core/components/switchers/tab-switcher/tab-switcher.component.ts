import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-tab-switcher',
  templateUrl: './tab-switcher.component.html',
  styleUrls: ['./tab-switcher.component.scss']
})
export class TabSwitcherComponent implements OnInit {
  @Input() tabs: any[];
  @Input() customClass: string = null;
  activeTab: number;

  @Output() switchClicked = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
    if(this.tabs) {
      this.activeTab = this.tabs[0].id;
    }
  }

  handleChange(event: any) {
    this.switchClicked.emit(event);
    this.activeTab = event.id;
  }

}
