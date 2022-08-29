import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DriversItemStore } from '../../driver/state/driver-details-state/driver-details.store';

@Component({
  selector: 'app-ta-details-header-card',
  templateUrl: './ta-details-header-card.component.html',
  styleUrls: ['./ta-details-header-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaDetailsHeaderCardComponent implements OnInit, OnChanges {
  @Input() public cardDetailsName: string = '';
  @Input() public cardDetailsDate: any;
  @Input() public cardDetailsDateTerminated: string = null;
  @Input() public hasSvgHeader: string = '';
  @Input() public tooltipNext: string = '';
  @Input() public tooltipPrevious: string = '';
  @Input() public searchName: string = '';
  @Input() public options: any = [];
  @Input() public optionsSecondInput: any = [];
  @Input() public optionsDrop: any = [];
  @Input() public statusInactive: number = 1;
  @Input() public haveTwoInput: boolean;
  @Input() public searchInputName: string;
  @Input() public hasArrow: boolean;
  @Input() public optionsId: number;
  @Input() public sortOptions: string;

  @Output() public dropActions = new EventEmitter<any>();
  @Output() selectValue = new EventEmitter<string>();
  @Output() selectValueStore = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter<string>();
  @Input() public dateChecked: string = '';
  @Input() public lastEdit: string = '';
  public inputFormControl: FormControl = new FormControl();

  public selectedDropdown: boolean = false;
  public selectedDropdownSecond: boolean = false;
  public hideLeftArrow: boolean;
  public hideRightArrow: boolean;
  public routeId: number;
  constructor(private driverItemStore: DriversItemStore) {}
  ngOnChanges(changes: SimpleChanges) {}
  ngOnInit(): void {
    // this.hideArrowOnStart();
  }

  public hideArrowOnStart() {
    let driverId;
    let last = this.options.at(-1);
    setTimeout(() => {
      driverId = this.driverItemStore.getValue().ids[0];
    }, 100);
    let first = this.options.at(0);

    if (first.id == driverId) {
      this.hideLeftArrow = true;
    } else {
      this.hideLeftArrow = false;
    }
    if (last.id == driverId) {
      this.hideRightArrow = true;
    } else {
      this.hideRightArrow = false;
    }
  }
  public onAction(action: string) {
    this.hideArrowOnStart();
    this.changeEvent.emit(action);
  }

  public onPickItem(): void {
    if (this.options.length > 1) {
      this.selectedDropdown = true;
    }
  }

  public onPickSecondInput(): void {
    if (this.optionsSecondInput.length > 1) {
      this.selectedDropdownSecond = true;
    }
  }

  public onSelectItem(value: any) {
    if (this.optionsSecondInput.length > 1) {
      this.selectedDropdownSecond = !this.selectedDropdownSecond;
      this.selectValueStore.emit(value);
    }
  }
  public onSelecItem(value: any): void {
    if (this.options.length > 1) {
      this.selectedDropdown = !this.selectedDropdown;
      this.selectValue.emit(value);
    }
  }

  public dropAct(action: any) {
    this.dropActions.emit(action);
  }
}
