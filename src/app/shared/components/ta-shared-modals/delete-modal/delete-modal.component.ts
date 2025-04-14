import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Components
import { CaModalComponent } from 'ca-components';

// Interfaces
import { IModalData } from './interfaces/modal-data.interface';

@Component({
    selector: 'app-delete-modal',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,

        // Components
        CaModalComponent,
    ],
    templateUrl: './delete-modal.component.html',
    styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
    @Input() modalData: IModalData;
	@Input() template: TemplateRef<null>;

    sharedSvgRoutes = SharedSvgRoutes;

	constructor(private ngbActiveModal: NgbActiveModal,) {}

	public onModalAction(isDoAction?: boolean): void {
		this.ngbActiveModal.close(isDoAction);
	}

}
