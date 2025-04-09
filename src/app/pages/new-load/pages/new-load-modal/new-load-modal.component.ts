// Modules
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Enums
import { eGeneralActions } from '@shared/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Services
import { LoadService } from '@shared/services/load.service';

// Interface
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Helpers
import { LoadModalHelper } from '@pages/new-load/pages/new-load-modal/utils/helpers';

// Models
import { LoadResponse } from 'appcoretruckassist';

// Components
import { SvgIconComponent } from 'angular-svg-icon';
import {
    CaModalButtonComponent,
    CaModalComponent,
    CaLoadStatusComponent,
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
        CaLoadStatusComponent,
    ],
})
export class NewLoadModalComponent implements OnInit {
    @Input() editData: ILoadModal;

    public isModalValidToSubmit = false;

    // Show spinner when saving modal
    public activeAction = null;

    // Main modal title
    public modalTitle: string;

    // Show static data, such as status, load number
    public load: LoadResponse;

    // Enums
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public generalActions = eGeneralActions;

    // Icon routes
    public svgRoutes = SharedSvgRoutes;

    constructor(
        private ngbActiveModal: NgbActiveModal,
        private loadService: LoadService
    ) {}

    ngOnInit(): void {
        this.setupInitalData();
    }

    public onModalAction(action: eGeneralActions): void {
        switch (action) {
            case this.generalActions.CLOSE:
                this.onCloseModal();
                break;

            case this.generalActions.CONVERT_TO_LOAD:
            case this.generalActions.CONVERT_TO_TEMPLATE:
                const isTemplate =
                    action === this.generalActions.CONVERT_TO_TEMPLATE;

                this.editData = {
                    isEdit: false,
                    id: null,
                    isTemplate,
                };

                this.modalTitle = LoadModalHelper.generateTitle(
                    this.editData,
                    {}
                );
                break;
        }
    }

    private setupInitalData(): void {
        // Before setting the title we should get modal by id to see if modal is active | pending or active
        if (this.editData.isEdit) {
            this.loadService
                .getLoadById(this.editData.id, this.editData.isTemplate)
                .subscribe((load) => {
                    // We will use this for some static data
                    this.load = load;

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

    private onCloseModal(): void {
        this.ngbActiveModal.close();
    }
}
