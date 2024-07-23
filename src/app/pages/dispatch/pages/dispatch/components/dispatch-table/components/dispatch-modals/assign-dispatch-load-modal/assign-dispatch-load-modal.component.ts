import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';

// Svg routes
import { DispatchParkingSvgRoutes } from '@pages/dispatch/pages/dispatch/utils/helpers/dispatch-parking-svg-routes';

// Config
import { AssignDispatchLoadConfig } from '@pages/dispatch/pages/dispatch/utils/config/assign-dispatch-load.config';
import { LoadModalDragAndDrop } from '@pages/load/pages/load-modal/utils/constants/load-modal-draganddrop-config';

// Models
import {
    AssignedLoadListResponse,
    DriverDispatchResponse,
    TrailerMinimalResponse,
    TruckMinimalResponse,
} from 'appcoretruckassist';
import { AssignDispatchCard } from '../../../models/assign-dispatch-card.model';
import {
    CDK_DRAG_CONFIG,
    CdkDragDrop,
    moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-assign-dispatch-load-modal',
    templateUrl: './assign-dispatch-load-modal.component.html',
    styleUrls: ['./assign-dispatch-load-modal.component.scss'],
    providers: [
        { provide: CDK_DRAG_CONFIG, useValue: LoadModalDragAndDrop.Config },
    ],
})
export class AssignDispatchLoadModalComponent implements OnInit {
    // Svg
    public svgIcons = DispatchParkingSvgRoutes;
    
    @Input() editData: {
        data: AssignedLoadListResponse;
        driver: DriverDispatchResponse;
        truck: TruckMinimalResponse;
        trailer: TrailerMinimalResponse;
    };

    // Form
    public assingLoadForm: UntypedFormGroup;

    public loadDispatchesTTDInputConfig =
        AssignDispatchLoadConfig.truckTrailerDriver;

    public assignedCardState: AssignDispatchCard;
    public unassignedCardState: AssignDispatchCard;

    constructor(private formBuilder: FormBuilder) {
        this.assignedCardState = new AssignDispatchCard();
        this.unassignedCardState = new AssignDispatchCard();
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        this.assingLoadForm = this.formBuilder.group({
            dispatchId: [null],
        });
    }

    public trackByIdentity(id: number): number {
        return id;
    }

    public dropAssigned(event: CdkDragDrop<string[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        moveItemInArray(
            this.editData.data.assignedLoads,
            event.previousIndex,
            event.currentIndex
        );
    }

    public dropUnassigned(event: CdkDragDrop<string[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        moveItemInArray(
            this.editData.data.unassignedLoads,
            event.previousIndex,
            event.currentIndex
        );
    }
}
