import { DetailsDropdownOptions } from '@shared/models/details-dropdown-options.model';
import { DetailsConfig } from '@shared/models/details-config.model';

export class DriverDetailsHelper {
    static getDetailsDropdownOptions(status: number): DetailsDropdownOptions {
        return {
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
                    name: 'edit',
                    svg: 'assets/svg/truckassist-table/dropdown/content/edit.svg',
                    disabled: !status,
                    iconName: 'edit',
                },
                {
                    title: 'border',
                },
                {
                    title: 'Send Message',
                    name: 'dm',
                    svg: 'assets/svg/common/ic_dm.svg',
                    show: !!status,
                    disabled: !status,
                    iconName: 'dm',
                },
                {
                    title: 'Add New',
                    svg: 'assets/svg/common/dropdown-arrow.svg',
                    iconName: 'add-new',
                    disabled: !status,
                    subType: [
                        { subName: 'CDL', actionName: 'CDL' },
                        {
                            subName: 'Test (Drug, Alcohol)',
                            actionName: 'Drug & Alcohol',
                        },
                        { subName: 'Medical Exam', actionName: 'Medical' },
                        { subName: 'MVR', actionName: 'MVR' },
                    ],
                },
                {
                    title: 'Request',
                    svg: 'assets/svg/common/dropdown-arrow.svg',
                    iconName: 'add-new',
                    disabled: !status,
                    subType: [
                        {
                            subName: 'Background Check',
                            actionName: 'Background Check',
                        },
                        { subName: 'Medical Exam', actionName: 'Medical' },
                        {
                            subName: 'Test (Drug, Alcohol)',
                            actionName: 'Drug & Alcohol',
                        },
                        { subName: 'MVR', actionName: 'MVR' },
                    ],
                },
                {
                    title: 'border',
                },
                {
                    title: 'Share',
                    name: 'share',
                    svg: 'assets/svg/common/share-icon.svg',
                    iconName: 'share',
                    show: true,
                },
                {
                    title: 'Print',
                    name: 'print',
                    svg: 'assets/svg/common/ic_fax.svg',
                    iconName: 'print',
                    show: true,
                },
                {
                    title: 'border',
                },
                {
                    title: !status ? 'Activate' : 'Deactivate',
                    name: !status ? 'activate' : 'deactivate',
                    iconName: 'activate-item',
                    svg: 'assets/svg/common/ic_deactivate.svg',
                    activate: !status,
                    deactivate: !!status,
                    show: true,
                    redIcon: !!status,
                    blueIcon: !status,
                },
                {
                    title: 'Delete',
                    name: 'delete-item',
                    type: 'driver',
                    text: 'Are you sure you want to delete driver(s)?',
                    svg: 'assets/svg/common/ic_trash_updated.svg',
                    iconName: 'delete',
                    danger: true,
                    show: true,
                    redIcon: true,
                },
            ],
            export: true,
        };
    }

    static getDriverDetailsConfig(
        driverData: any,
        driverStatus: boolean,
        hasDangerCdl: boolean,
        hasDangerMedical: boolean,
        hasDangerMvr: boolean
    ): DetailsConfig[] {
        return [
            {
                id: 0,
                name: 'Driver Detail',
                template: 'general',
                data: driverData,
            },
            {
                id: 1,
                name: 'CDL',
                template: 'cdl',
                req: false,
                status: driverStatus,
                hasDanger: hasDangerCdl,
                length: driverData?.cdls?.length,
                businessOpen: true,
                data: driverData?.cdls,
            },
            {
                id: 2,
                name: 'Drug & Alcohol',
                template: 'drug-alcohol',
                req: true,
                status: driverStatus,
                hasDanger: false,
                length: driverData?.tests?.length,
                businessOpen: true,
                data: driverData?.tests,
            },
            {
                id: 3,
                name: 'Medical',
                template: 'medical',
                req: true,
                status: driverStatus,
                hasDanger: hasDangerMedical,
                length: driverData?.medicals?.length,
                businessOpen: true,
                data: driverData?.medicals,
            },
            {
                id: 4,
                name: 'MVR',
                template: 'mvr',
                req: true,
                status: driverStatus,
                hasDanger: hasDangerMvr,
                length: driverData?.mvrs?.length,
                businessOpen: true,
                data: driverData?.mvrs,
            },
        ];
    }
}
