import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ta-details-header-card',
  templateUrl: './ta-details-header-card.component.html',
  styleUrls: ['./ta-details-header-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaDetailsHeaderCardComponent implements OnInit {
  @Input() public cardDetailsName: string = '';
  @Input() public cardDetailsDate: any;
  @Input() public cardDetailsDateTerminated: string = null;
  @Input() public hasSvgHeader: string = '';
  @Input() public tooltipNext: string = '';
  @Input() public tooltipPrevious: string = '';
  @Input() public searchName: string = '';
  @Input() public options: any = [];
  @Input() public optionsDrop: any = [];
  @Input() public statusInactive: number = 1;
  @Input() public haveTwoInput: boolean;
  @Input() public searchInputName: string;
  @Input() public hasArrow: boolean;
  @Input() public optionsId: number;
  @Output() public dropActions = new EventEmitter<any>();
  @Output() selectValue = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter<string>();
  @Input() public dateChecked:string='';
  public inputFormControl: FormControl = new FormControl();

  public selectedDropdown: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.options);
  }
  public onAction(action: string) {

    this.changeEvent.emit(action);
  }

  public onPickItem(): void {
    this.selectedDropdown = true;
  }

  public onSelecItem(value: any): void {
    console.log(value);
    
    this.selectValue.emit(value);
    this.selectedDropdown = false;
  }

  public dropAct(action: any) {
    this.dropActions.emit(action);
  }
}
