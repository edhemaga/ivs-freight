import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { DetailsDataService } from '../../../services/details-data/details-data.service';

@Component({
  selector: 'app-details-page-dropdown',
  templateUrl: './details-dropdown.html',
  styleUrls: ['./details-dropdown.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsDropdownComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() id: number;
  @Input() customClassDropDown: string;
  @Input() hasVericalDots: boolean;
  @Input() data: any;
  @Input() public placement: string = 'bottom-right';
  @Output() dropDownActions: EventEmitter<any> = new EventEmitter();
  dropContent: any[] = [];
  tooltip: any;
  dropDownActive: number = -1;

  constructor(
    private DetailsDataService: DetailsDataService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.options?.currentValue) {
      this.options = changes.options.currentValue;
      this.setDropContent();
    }

    if (changes?.id?.currentValue) {
      this.id = changes.id.currentValue;
    }
  }

  ngOnInit(): void {}

  toggleDropdown(tooltip: any) {
    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ data: this.dropContent });
      if ( this.data ){
        this.DetailsDataService.setNewData(this.data);
      }
    }

    this.dropDownActive = tooltip.isOpen() ? this.id : -1;
  }

  setDropContent() {
    /* Drop Down Actions*/
    if (this.options.length) {
      for (let i = 0; i < this.options.length; i++) {
        this.dropContent.push(this.options[i]);
      }
    }
  }
  /**Function retrun id */
  public identity(index: number, item: any): number {
    return item.id;
  }
  onAction(action: any) {
    this.dropDownActions.emit({
      id: this.id,
      data: this.data,
      type: action.name,
    });

    this.tooltip.close();
  }
}
