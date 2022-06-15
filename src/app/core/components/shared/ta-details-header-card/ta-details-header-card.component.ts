import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ta-details-header-card',
  templateUrl: './ta-details-header-card.component.html',
  styleUrls: ['./ta-details-header-card.component.scss'],
})
export class TaDetailsHeaderCardComponent implements OnInit {
  @Input() cardDetailsName: string = '';
  @Input() cardDetailsDate: any;
  @Input() cardDetailsDateTerminated: string = null;
  @Input() hasSvgHeader: string = '';
  @Input() tooltipNext: string = '';
  @Input() tooltipPrevious: string = '';
  @Input() searchName: string = '';
  @Input() options: any = [];
  @Input() statusInactive: number = 1;
  @Output() selectValue = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter<string>();
  id: number = 0;
  public inputFormControl: FormControl = new FormControl();

  public selectedDropdown: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log(this.options);
  }

  public onAction(action: string) {
    this.changeEvent.emit(action);
  }

  public onPickItem(): void {
    this.selectedDropdown = true;
  }

  public onSelecItem(emit: any): void {
    console.log('FROM DETAILS HEADER CARD');
    console.log(emit);
    this.selectValue.emit(emit);
    this.selectedDropdown = false;
  }
}
