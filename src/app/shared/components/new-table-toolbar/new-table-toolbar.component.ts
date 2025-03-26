import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';

// models
import {
    IDropdownMenuItem,
    IDropdownMenuOptionEmit,
} from '@ca-shared/components/ca-dropdown-menu/interfaces';

// enums
import { eDropdownMenuColumns } from '@shared/enums';

// components
import { CaDropdownMenuComponent } from 'ca-components';

// services
import { ConfirmationResetService } from '@shared/components/ta-shared-modals/confirmation-reset-modal/services/confirmation-reset.service';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

@Component({
    selector: 'app-new-table-toolbar',
    templateUrl: './new-table-toolbar.component.html',
    styleUrl: './new-table-toolbar.component.scss',
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,

        // components
        SvgIconComponent,
        CaDropdownMenuComponent,
    ],
})
export class NewTableToolbarComponent<T> implements OnInit, OnDestroy {
    // inputs
    @Input() title: string;
    @Input() leftSide: TemplateRef<T>;
    @Input() rightSide: TemplateRef<T>;
    @Input() hasColumnsDropdown: boolean = true;
    @Input() showPlusIcon: boolean = true;
    @Input() hasPlusIcon: boolean = true;
    @Input() isMarginTopDisabled: boolean = false;
    @Input() toolbarDropdownContent: IDropdownMenuItem[];

    // outputs
    @Output() onPlusClick: EventEmitter<boolean> = new EventEmitter();
    @Output() toolbarDropdownAction: EventEmitter<IDropdownMenuOptionEmit> =
        new EventEmitter();

    public destroy$ = new Subject<void>();

    public plusIcon = SharedSvgRoutes.PLUS_ICON;

    constructor(private confirmationResetService: ConfirmationResetService) {}

    ngOnInit(): void {
        this.watchResetConfirmation();
    }

    private watchResetConfirmation(): void {
        const action = {
            type: eDropdownMenuColumns.RESET_TABLE_CONFIRMED_TYPE,
        };

        this.confirmationResetService.getConfirmationResetData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (isTableReset) =>
                    isTableReset && this.toolbarDropdownAction.emit(action)
            );
    }

    public handleDropdownMenuActions(action: IDropdownMenuOptionEmit): void {
        this.toolbarDropdownAction.emit(action);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
