import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-table-dropdown',
  templateUrl: './table-dropdown.component.html',
  styleUrls: ['./table-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDropdownComponent implements OnInit, OnChanges {
  @Input() options: any;
  @Input() id: number;
  @Output() dropDownActions: EventEmitter<any> = new EventEmitter();
  dropContent: any[] = [];
  tooltip: any;

  constructor() {}

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
    }
  }

  setDropContent() {
    /* Drop Down Actions*/

    if (this.options.length) {
      for (let i = 0; i < this.options.length; i++) {
        this.dropContent.push(this.options[i]);
      }
    }
  }

  onAction(action: any) {
    this.dropDownActions.emit({
      id: this.id,
      type: action.name,
    });

    this.tooltip.close();
  }
}
