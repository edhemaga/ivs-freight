import { CardRows } from '@shared/models/card-models/card-rows.model';

export class DriverApplicantCardsModalData {
    static frontDataLoad: CardRows[] = [
        {
            title: 'Status',
            key: 'tableRev',
            secondKey: 'title',
            selected: true,
        },
        {
            title: 'Application Process',
            key: 'tableApplicantProgress',
            selected: true,
        },
        {
            title: 'CDL Detail • Expiration',
            key: 'tableCdlDetailExpiration',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },
        {
            title: 'Medical Exp.',
            key: 'tableMedicalData',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
            selected: true,
        },
    ];
    static backDataLoad: CardRows[] = [
        {
            title: 'Date of Birth',
            key: 'tableDOB',
            selected: true,
        },
        {
            title: 'Phone',
            key: 'phone',
            selected: true,
        },
        {
            title: 'Email',
            key: 'email',
            selected: true,
        },
        {
            title: 'Date Added',
            key: 'tableAdded',
            selected: true,
        },
    ];
    static allDataLoad: CardRows[] = [
        {
            title: 'Date of Birth',
            key: 'tableDOB',
        },
        {
            title: 'SSN No.',
            key: 'ssn',
        },
        {
            title: 'Phone',
            key: 'phone',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Status',
            key: 'tableRev',
            secondKey: 'title',
        },
        {
            title: 'Address',
            key: 'tableAddress',
        },
        {
            title: 'Application Process',
            key: 'tableApplicantProgress',
        },
        {
            title: 'CDL Detail',
            isDropdown: true,
            values: [
                {
                    title: 'CDL Detail • Number',
                    secondTitle: 'Number',
                    key: 'tableCdlDetailNumber',
                },
                {
                    title: 'CDL Detail • State',
                    secondTitle: 'State',
                    key: 'tableCdlDetailState',
                },
                {
                    title: 'CDL Detail • Endorsment',
                    secondTitle: 'Endorsment',
                    key: 'tableCdlDetailEndorsment',
                },
                {
                    title: 'CDL Detail • Restriction',
                    secondTitle: 'Restriction',
                    key: 'tableCdlDetailRestriction',
                },
                {
                    title: 'CDL Detail • Expiration',
                    secondTitle: 'Expiration',
                    key: 'tableCdlDetailExpiration',
                    secondKey: 'expirationDaysText',
                    thirdKey: 'percentage',
                },
            ],
        },
        {
            title: 'Medical Exp.',
            key: 'tableMedicalData',
            secondKey: 'expirationDaysText',
            thirdKey: 'percentage',
        },
        {
            title: 'Date Invited',
            key: 'tableInvited',
        },
        {
            title: 'Date Accepted',
            key: 'tableAccepted',
        },
        {
            title: 'Date Added',
            key: 'tableAdded',
        },
        {
            title: 'Date Archived',
            key: 'tableArchived',
        },
        {
            title: 'Date Added',
            key: 'tableAdded',
        },
        {
            title: 'Date Edited',
            key: 'updatedAt',
        },
    ];
}
