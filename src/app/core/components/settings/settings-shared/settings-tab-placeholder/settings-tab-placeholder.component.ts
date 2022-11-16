import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-tab-placeholder',
  templateUrl: './settings-tab-placeholder.component.html',
  styleUrls: ['./settings-tab-placeholder.component.scss']
})
export class SettingsTabPlaceholderComponent{

  @Input() name: string = null;
  @Input() phone: string = null;
  @Input() email: string = null;
  @Input() address: string = null;

  @Input() companyOwnedSVG: string = null;
  @Input() hasDots: boolean = true;
  @Input() hasNote: boolean = false;
  @Input() hasAttachment: boolean = false;

  @Input() customClass: string = null;

  @Output() onActionEvent: EventEmitter<any> = new EventEmitter<any>();


  public onAction() {
    this.onActionEvent.emit();
  }
}
