import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
} from '@angular/core';

// services
import { SharedService } from '../../../../services/shared/shared.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';

// components
import { SettingsBasicModalComponent } from '../../../modals/company-modals/settings-basic-modal/settings-basic-modal.component';

// enums
import { ConstantStringEnum } from '../../state/enums/constant-string.enum';

// models
import { SignInResponse } from '../../../../../../../appcoretruckassist/model/signInResponse';

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
}
