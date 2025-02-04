import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Enums
import { ToolbarVariant } from '@shared/enums';

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
  public toolbarVariant = ToolbarVariant;
  // TODO: Maybe add type?
  @Input() data: { title?: string; name?: string; length?: number }[] = [];
  @Input() selectedTab?: string;
  @Input() variant: ToolbarVariantType = ToolbarVariant.Large;

  @Output() tabSelected = new EventEmitter<string>();

  onTabClick(tab: string) {
      this.tabSelected.emit(tab);
  }
}
