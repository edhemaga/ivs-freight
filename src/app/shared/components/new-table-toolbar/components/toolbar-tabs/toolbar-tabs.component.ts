import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Enums
import { eToolbarVariant } from '@shared/enums';

// Interface
import { IToolbarTabs } from '@shared/interfaces';

// Types
import { ToolbarVariantType } from '@shared/types';

// Pipes
import { ToolbarTabsClassPipe } from '@shared/components/new-table-toolbar/components/toolbar-tabs/pipes/toolbar-tabs-class-pipe';

@Component({
    selector: 'app-toolbar-tabs',
    imports: [
        CommonModule,

        // Pipes
        ToolbarTabsClassPipe,
    ],
    templateUrl: './toolbar-tabs.component.html',
    styleUrl: './toolbar-tabs.component.scss',
    standalone: true,
})
export class ToolbarTabsComponent {
    @Input() data: IToolbarTabs[] = [];
    @Input() selectedTab?: string;
    @Input() variant: ToolbarVariantType = eToolbarVariant.Large;

    @Output() tabSelected = new EventEmitter<string>();

    public toolbarVariant = eToolbarVariant;

    public onTabClick(tab: string) {
        if (tab !== this.selectedTab) this.tabSelected.emit(tab);
    }
}
