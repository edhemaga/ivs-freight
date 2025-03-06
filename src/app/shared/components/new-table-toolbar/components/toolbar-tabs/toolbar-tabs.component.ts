import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Enums
import { eToolbarVariant } from '@shared/enums';
import { IToolbarTabs } from '@shared/models/toolbar-tabs.interface';

// Types
import { ToolbarVariantType } from '@shared/types';

@Component({
  selector: 'app-toolbar-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar-tabs.component.html',
  styleUrl: './toolbar-tabs.component.scss'
})
export class ToolbarTabsComponent {
  @Input() data: IToolbarTabs[] = [];
  @Input() selectedTab?: string;
  @Input() variant: ToolbarVariantType = eToolbarVariant.Large;

  @Output() tabSelected = new EventEmitter<string>();

  public toolbarVariant = eToolbarVariant;

  onTabClick(tab: string) {
      this.tabSelected.emit(tab);
  }
}
