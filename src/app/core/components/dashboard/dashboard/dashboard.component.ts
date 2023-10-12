import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
} from '@angular/core';

import { SharedService } from '../../../services/shared/shared.service';
import { ModalService } from '../../shared/ta-modal/modal.service';

import { SettingsBasicModalComponent } from '../../modals/company-modals/settings-basic-modal/settings-basic-modal.component';

import { SignInResponse } from '../../../../../../appcoretruckassist/model/signInResponse';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, AfterViewInit {
    constructor(
        private sharedService: SharedService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.checkIfUserSettingsAreUpdated();
    }

    ngAfterViewInit(): void {
        this.emitUpdateScrollHeight();
    }

    private checkIfUserSettingsAreUpdated(): void {
        const loggedUser: SignInResponse = JSON.parse(
            localStorage.getItem('user')
        );

        if (!loggedUser.areSettingsUpdated) {
            this.modalService.openModal(
                SettingsBasicModalComponent,
                {
                    size: 'medium',
                },
                {
                    type: 'edit-company-first-login',
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
}
