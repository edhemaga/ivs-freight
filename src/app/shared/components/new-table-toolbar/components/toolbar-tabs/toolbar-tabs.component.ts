import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Enums
import { ToolbarVariant } from '@shared/enums';
import { IToolbarTabs } from '@shared/models/IToolbarTabs';

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
  @Input() variant: ToolbarVariantType = ToolbarVariant.Large;

  @Output() tabSelected = new EventEmitter<string>();

  public toolbarVariant = ToolbarVariant;

  onTabClick(tab: string) {
      this.tabSelected.emit(tab);
  }
}
