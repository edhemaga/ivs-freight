import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// decorators
import { Titles } from 'src/app/core/utils/application.decorators';

// services
import { SharedService } from '../../../services/shared/shared.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { DashboardService } from '../state/services/dashboard.service';

// components
import { SettingsBasicModalComponent } from '../../modals/company-modals/settings-basic-modal/settings-basic-modal.component';

// enums
import { ConstantStringEnum } from '../state/enum/constant-string.enum';

// models
import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';

@Titles()
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent
    implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private sharedService: SharedService,
        private modalService: ModalService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.checkIfUserSettingsAreUpdated();

        this.getOverallCompanyDuration();
    }

    ngAfterViewInit(): void {
        this.emitUpdateScrollHeight();
    }

    ngOnChanges(): void {}

    private checkIfUserSettingsAreUpdated(): void {
        const loggedUser: SignInResponse = JSON.parse(
            localStorage.getItem(ConstantStringEnum.USER)
        );

        if (!loggedUser.areSettingsUpdated) {
            this.modalService.openModal(
                SettingsBasicModalComponent,
                {
                    size: ConstantStringEnum.MEDIUM,
                },
                {
                    type: ConstantStringEnum.MODAL_TYPE,
                },
                null,
                false
            );
        }
    }

    private emitUpdateScrollHeight(): void {
        setTimeout(() => {
            this.sharedService.emitUpdateScrollHeight.emit(true);
        }, 200);
    }

    private getOverallCompanyDuration(): void {
        this.dashboardService
            .getOverallCompanyDuration()
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
