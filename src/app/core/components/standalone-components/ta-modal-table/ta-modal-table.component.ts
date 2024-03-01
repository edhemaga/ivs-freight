import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// constants
import { ModalTableConstants } from 'src/app/core/utils/constants/modal-table.constants';

@Component({
    selector: 'app-ta-modal-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ta-modal-table.component.html',
    styleUrls: ['./ta-modal-table.component.scss'],
})
export class TaModalTableComponent implements OnInit {
    @Input() isPhoneTable: boolean = false;

    public modalTableForm: UntypedFormGroup;

    public modalTableHeaders: string[];

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();

        this.getConstantData();
    }

    public trackByIdentity = (_: number, item: string): string => item;

    private createForm(): void {
        this.modalTableForm = this.formBuilder.group({
            phoneTableItems: this.formBuilder.array([]),
        });
    }

    private getConstantData(): void {
        if (this.isPhoneTable)
            this.modalTableHeaders =
                ModalTableConstants.PHONE_TABLE_HEADER_ITEMS;
    }
}
