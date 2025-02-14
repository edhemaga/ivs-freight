import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Enums
import { eGeneralActions } from '@shared/enums';

// Models
import { FuelStopResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-fuel-details',
    templateUrl: './fuel-details.component.html',
    styleUrls: ['./fuel-details.component.scss'],
})
export class FuelDetailsComponent implements OnInit {
    public fuelConfig: any[] = [];
    public fuelDrop: any;
    constructor(private actRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.fuelConf(this.actRoute.snapshot.data.fuelSingle);

        this.initTableOptions();
    }
    /**Function for dots in cards */
    public initTableOptions(): void {
        this.fuelDrop = {
            disabledMutedStyle: null,
            toolbarActions: {
                hideViewMode: false,
            },
            config: {
                showSort: true,
                sortBy: '',
                sortDirection: '',
                disabledColumns: [0],
                minWidth: 60,
            },
            actions: [
                {
                    title: 'Edit',
                    name: eGeneralActions.EDIT,
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    show: true,
                },

                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'truck',
                    text: 'Are you sure you want to delete truck(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    danger: true,
                    show: true,
                },
            ],
            export: true,
        };
    }
    /**Function return id */
    public identity(index: number, item: any): number {
        return item.id;
    }

    fuelConf(data: FuelStopResponse) {
        this.fuelConfig = [
            {
                id: 0,
                name: 'Fuel Stop Detail',
                template: 'general',
                data: data,
            },
            {
                id: 1,
                name: 'Transaction',
                template: 'transaction',
                icon: true,
                length: 25,
                customText: 'Date',
                status: false,
                data: data,
            },
            {
                id: 2,
                name: 'Fuelled Vehicle',
                template: 'fuel-vehicle',
                length: 18,
                hide: true,
                status: true,
                customText: 'Cost',
                data: data,
            },
        ];
    }
}
