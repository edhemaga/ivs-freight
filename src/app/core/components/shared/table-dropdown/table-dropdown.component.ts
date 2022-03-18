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
    /* Get Main Actions*/
    if (this.options?.mainActions) {
      for (let i = 0; i < this.options.mainActions.length; i++) {
        this.options.mainActions[i].svg = 'edit';
        this.options.mainActions[i].textColor = 'regular-text';
        this.dropContent.push(this.options.mainActions[i]);
      }
    }

    /* Get Other Actions*/
    if (this.options?.otherActions) {
      for (let i = 0; i < this.options.otherActions.length; i++) {
        this.options.otherActions[i].svg = 'add';
        this.options.otherActions[i].textColor = 'regular-text';
        this.dropContent.push(this.options.otherActions[i]);
      }
    }

    /* Get activate Actions*/
    if (this.options?.activateAction) {
      this.options.activateAction.svg = 'activate';
      this.options.activateAction.textColor = 'regular-text';
      this.dropContent.push(this.options.activateAction);
    }

    /* Get Delete Actions*/
    if (this.options?.deleteAction) {
      this.options.deleteAction.svg = 'delete';
      this.options.deleteAction.textColor = 'delete-text';
      this.dropContent.push(this.options.deleteAction);
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
