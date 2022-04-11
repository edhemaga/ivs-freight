import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ta-input-dropdown',
  templateUrl: './ta-input-dropdown.component.html',
  styleUrls: ['./ta-input-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaInputDropdownComponent implements OnInit {
  public selectedItem?: any;

  @Input() data = [
    { id: 1, name: 'Aleksandar Djordjevic' },
    { id: 2, name: 'Denis Rodman' },
    { id: 3, name: 'James Halpert' },
    { id: 4, name: 'Pamela Beasley' },
  ];
  @Input() dropdownLabel: string = 'Dispatcher';
  @Input() disabled: boolean = false;
  constructor() {}

  ngOnInit() {}
}
