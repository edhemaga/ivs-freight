import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// svg routes
import { DocumentsDrawerSvgRoutes } from '@shared/components/ta-documents-drawer/utils/svg-routes';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaDropdownOptionsComponent } from '@shared/components/ta-dropdown-options/ta-dropdown-options.component';

// enums
import { DocumentsDrawerStringEnum } from '@shared/components/ta-documents-drawer/enums';

// constants
import { DocumentsDrawerConstants } from '@shared/components/ta-documents-drawer/utils/constants';

// models
import { DrawerActionColumn } from '@shared/components/ta-documents-drawer/models';
import { DropdownItem } from '@shared/models/dropdown-item.model';

@Component({
    selector: 'app-ta-documents-drawer',
    templateUrl: './ta-documents-drawer.component.html',
    styleUrls: ['./ta-documents-drawer.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
        TaDropdownOptionsComponent,
    ],
})
export class TaDocumentsDrawerComponent implements OnInit {
    @Input() set isActive(data: boolean) {
        this.isDrawerActive = data;
    }
    @Input() options: DropdownItem[] = [];

    @Output()
    actionsEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    dropdownEmitter: EventEmitter<{ type: string }> = new EventEmitter<{
        type: string;
    }>();

    public documentsDrawerSvgRoutes = DocumentsDrawerSvgRoutes;
    public documentsDrawerStringEnum = DocumentsDrawerStringEnum;

    public isDrawerActive: boolean = false;

    public drawerActionColumns: DrawerActionColumn[] = [];

    public isTagRowExpanded: boolean = false;

    public tags = [
        // dummy w8 for back
        {
            title: 'User Tagged',
            isSelected: false,
        },
        {
            title: 'No Tag',
            isSelected: false,
        },
        {
            title: 'User',
            isSelected: false,
        },
    ];

    constructor() {}

    ngOnInit(): void {
        this.getConstantData();
    }

    public trackByIdentity = (index: number): number => index;

    private getConstantData(): void {
        this.drawerActionColumns =
            DocumentsDrawerConstants.DRAWER_ACTION_COLUMNS;
    }

    public handleActionClick(
        event: Event,
        action: string,
        index?: number
    ): void {
        return; // w8 for drawer component

        event.preventDefault();
        event.stopPropagation();

        switch (action) {
            case DocumentsDrawerStringEnum.OPEN:
                this.handleDrawerOpenCloseClick(true);

                break;
            case DocumentsDrawerStringEnum.DOWNLOAD_ALL:
                break;
            case DocumentsDrawerStringEnum.CLOSE:
                this.handleDrawerOpenCloseClick(false);

                break;
            case DocumentsDrawerStringEnum.TAG:
                this.handleTagClick(index);

                break;
            case DocumentsDrawerStringEnum.EXPAND_COLLAPSE:
                this.handleTagsExpandCollapseClick();

                break;
            default:
                break;
        }
    }

    public handleDropdownClick(event: { type: string }): void {
        this.dropdownEmitter.emit({ type: event.type });
    }

    private handleDrawerOpenCloseClick(isOpenClick: boolean): void {
        this.isDrawerActive = isOpenClick;

        this.actionsEmitter.emit(this.isDrawerActive);
    }

    private handleTagsExpandCollapseClick(): void {
        this.isTagRowExpanded = !this.isTagRowExpanded;
    }

    private handleTagClick(index: number): void {
        this.tags = this.tags.map((tag, tagIndex) =>
            index === tagIndex ? { ...tag, isSelected: !tag.isSelected } : tag
        );
    }
}
