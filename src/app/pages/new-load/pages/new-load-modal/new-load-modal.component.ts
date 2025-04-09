import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Enums
import { ActionTypesEnum } from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadService } from '@shared/services/load.service';

// Interface
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Helpers
import { LoadModalHelper } from '@pages/new-load/pages/new-load-modal/helpers';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import {
    CaModalButtonComponent,
    CaModalComponent,
    eModalButtonClassType,
    eModalButtonSize,
} from 'ca-components';

@Component({
    selector: 'app-new-load-modal',
    templateUrl: './new-load-modal.component.html',
    styleUrl: './new-load-modal.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        // Components
        CaModalComponent,
        SvgIconComponent,
        CaModalButtonComponent,
    ],
})
export class NewLoadModalComponent implements OnInit {
    @Input() editData: ILoadModal;

    public isModalValidToSubmit = false;

    // Show spinner when saving modal
    public activeAction = null;

    // Main modal title
    public modalTitle: string;

    // Enums
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public actionTypesEnum = ActionTypesEnum;

    // Icon routes
    public svgRoutes = SharedSvgRoutes;

    constructor(
        private ngbActiveModal: NgbActiveModal,
        private loadService: LoadService
    ) {}

    ngOnInit(): void {
        this.setupInitalData();
    }

    public onModalAction(action: ActionTypesEnum): void {
        // TODO: This will have a lot of actions, close is for testing so far
        if (action === this.actionTypesEnum.CLOSE) {
            this.closeModal();
        }
    }

    private setupInitalData(): void {
        // Before setting the title we should get modal by id to see if modal is active | pending or active
        if (this.editData.isEdit) {
            this.loadService
                .getLoadById(this.editData.id, this.editData.isTemplate)
                .subscribe((load) => {
                    this.modalTitle = LoadModalHelper.generateTitle(
                        this.editData,
                        load.statusType
                    );
                });
        } else {
            // Creating new load
            this.modalTitle = LoadModalHelper.generateTitle(this.editData, {});
        }
    }

    private closeModal(): void {
        this.ngbActiveModal.close();
    }
}
