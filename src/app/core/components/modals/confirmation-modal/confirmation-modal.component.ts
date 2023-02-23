import { ImageBase64Service } from '../../../utils/base64.image';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { ProfileImagesComponent } from '../../shared/profile-images/profile-images.component';

export interface Confirmation {
    template: string; // examples: driver, broker, shipper, cdl.....
    type:
        | 'delete'
        | 'multiple delete'
        | 'hire'
        | 'activate'
        | 'deactivate'
        | 'info'; // if type is info => subtype must be: archive | ban list | dnu | void;
    id?: number; // id for item
    data?: any;
    array?: any[]; // multiple array of objects
    subType?: 'archive' | 'ban list' | 'dnu' | 'cdl void' | 'mark'; // if subType set, must set and subTypeStatus (except when subType: cdl void)
    subTypeStatus?: 'move' | 'remove'; // example: move -> 'Move to Ban List', remove -> 'Remove from Ban List', void -> void
    cdlStatus?: 'New' | 'Renew' | 'Activate';
    image?: boolean; // has image or not
    svg?: boolean; // has svg or not
    rating?: boolean; // has rating or not
    modalHeader?: boolean;
}
@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        TaModalComponent,
        TaInputDropdownComponent,
        ProfileImagesComponent,

        // Pipe
        formatDatePipe,
    ],
})
export class ConfirmationModalComponent implements OnInit {
    @Input() editData: Confirmation;
    public cdlForm: FormGroup;
    selectedCdl: any;

    constructor(
        public imageBase64Service: ImageBase64Service,
        private ngbActiveModal: NgbActiveModal,
        private confirmationDataSubject: ConfirmationService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.cdlForm = this.formBuilder.group({
            cdlId: [null],
        });
    }

    public onModalAction(data: any) {
        // Multiple Delete
        if (this.editData.type === 'multiple delete') {
            this.confirmationDataSubject.sendConfirmationData({
                ...data,
                array: data.array.map((item) => item.id),
            });
        } else {
            if (!this.selectedCdl) {
                this.confirmationDataSubject.sendConfirmationData(data);
            } else {
                data['data']['newCdlID'] = this.selectedCdl.id;
                this.confirmationDataSubject.sendConfirmationData(data);
            }
        }

        this.ngbActiveModal.close();
    }

    public onSelectDropdown(event: any, action: string) {
        if (action === 'cdl') {
            this.selectedCdl = event;
        }
    }

    public identity = (index: number, _: any): number => index;
}
