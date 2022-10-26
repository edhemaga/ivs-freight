import { ActivatedRoute, Router } from '@angular/router';
import { OnChanges, SimpleChanges } from '@angular/core';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-ta-details-header',
  templateUrl: './ta-details-header.component.html',
  styleUrls: ['./ta-details-header.component.scss'],
})
export class TaCommonHeaderComponent implements OnInit {
  @Input() headerText: string = null;
  @Input() tooltipHeaderName: string = '';
  @Input() route: string = '';
  @Input() options: any = [];
  @Input() counterData: number = 0;
  @Output() openModalAction = new EventEmitter<any>();
  @Input() hasIcon: boolean = false;
  @Input() hasDateArrow: boolean = false;
  @Input() hidePlus: boolean = true;
  @Input() customText: string = '';
  @Output() changeDataArrowUp = new EventEmitter<any>();
  @Output() changeDataArrowDown = new EventEmitter<any>();
  @Input() hasRequest: boolean;
  @Output() makeRequest = new EventEmitter<any>();
  @Input() arrayIcons: any[] = [];
  @Input() statusInactive: boolean = true;
  @Input() danger: boolean = false;
  @Input() isInactive: boolean = false;
  @Output() public dropActions = new EventEmitter<any>();
  @Input() public optionsId: number;
  @Input() hasDateNav: boolean = true;
  @Input() counterViolation: number;
  @Input() hasArrowDown: boolean;
  @Input() totalCost: any;
  @Input() repairIsOpen: boolean;
  @Input() showRepairHeaderOpen: boolean;
  @Input() loadNames: boolean;
  @Input() secondNameHeader: string = '';
  @Input() countViolation: number;
  @Input() hideCounter: boolean;
  @Input() mainData: any;
  public up: boolean = false;
  public down: boolean = false;
  constructor(private routes: ActivatedRoute) {}

  ngOnInit(): void {}

  public openModal(val: any) {
    this.openModalAction.emit(val);
    console.log('--val--', val)
  }
  public makeRequestFun(req: any) {
    this.makeRequest.emit(req);
  }
  /**Function for drop acitons */
  public dropAct(action: any) {
    this.dropActions.emit(action);
  }
  public changeDataArrowUpFun(val: any) {
    this.up = true;
    if (this.down == true) {
      this.down = false;
    }
    this.changeDataArrowUp.emit(val);
  }
  public changeDataArrowDownFun(val: any) {
    this.down = true;
    if (this.up == true) {
      this.up = false;
    }
    this.changeDataArrowDown.emit(val);
  }
  public trackByIndex(index: number, obj: any): any {
    return index;
  }

  toggleDropdownActions(){
    //console.log('--mainData---', this.mainData);
    let itemData = this.mainData?.data;
    console.log('--itemData---', itemData)
    let diasbleClosedArray;

    if ( this.mainData?.nameDefault == 'Repair Shop Details' ) {
      if ( itemData.status != 1 ) {
        diasbleClosedArray = [0, 3, 4, 5];
      } else if ( itemData.companyOwned ) {
        diasbleClosedArray = [4];
      }
    }

    switch (this.mainData?.nameDefault) {
      case 'Repair Shop Details' : 
        this.options?.actions.map((action, index)=>{
          if ( index == 4 ) {
            if (itemData.pinned != false) {
              action.title = 'Remove from Favourite';
              action.name = 'remove-from-favourite';
              action.blueIcon = true;
            } else {
              action.title = 'Move to Favourite';
              action.name = 'move-to-favourite';
              action.blueIcon = false;
            }
          }

          if ( diasbleClosedArray && diasbleClosedArray.indexOf(index) > -1 ) {
            action.disabled = true;
          } else {
            action.disabled = false;
          }

          if ( index == 10 ) {
            if ( itemData.status != 1) {
              action.title = 'Reopen Business';
              action.greenIcon = true;
              action.redIcon = false;
              action.name = 'open-business';
            } else {
              action.title = 'Close Business';
              action.greenIcon = false;
              action.redIcon = true;
              action.name = 'close-business';
            }
          }

        })
      break;
    }
  
  }
}
