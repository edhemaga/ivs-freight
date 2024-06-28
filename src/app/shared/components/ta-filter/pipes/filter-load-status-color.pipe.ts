import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterLoadStatusColor',
    standalone: true,
})
export class FilterLoadStatusPipe implements PipeTransform {
    transform(status: string): { background: string } {
        const statusDarkGreyColorCondition = ['Booked', 'Hold'].includes(
            status
        );
        const statusGreyColorCondition = ['Unassigned', 'Revised'].includes(
            status
        );
        const statusGreenColorCondition = status === 'Assigned';
        const statusBlueColorCondition = status === 'Dispatched';
        const statusDarkTurquoiseColorCondition = [
            'ArrivedPickup',
            'CheckedInPickup',
            'Loading',
        ].includes(status);
        const statusTurquoiseColorCondition = status === 'Loaded';
        const statusDarkRedColorCondition = [
            'ArrivedDelivery',
            'CheckedInDelivery',
            'Offloading',
        ].includes(status);
        const statusRedColorCondition = ['Offloaded', 'Tonu'].includes(status);
        const statusDarkRed2ColorCondition = status === 'Cancelled';
        const statusOrangeColorCondition = status === 'Delivered';
        const statusOrange2ColorCondition = status === 'Repair';
        const statusYellowColorCondition = status === 'Invoiced';
        const statusYellow2ColorCondition = status === 'Paid';
        const statusYellow3ColorCondition = status === 'Unpaid';
        const statusYellow4ColorCondition = status === 'ShortPaid';
        const statusDarkYellowColorCondition = status === 'Claim';

        if (statusGreyColorCondition) {
            return {
                background: '#AAAAAA',
            };
        } else if (statusDarkGreyColorCondition) {
            return {
                background: '#919191',
            };
        } else if (statusGreenColorCondition) {
            return {
                background: '#77BF56',
            };
        } else if (statusBlueColorCondition) {
            return {
                background: '#6692F1',
            };
        } else if (statusTurquoiseColorCondition) {
            return {
                background: '#56B4AC',
            };
        } else if (statusDarkTurquoiseColorCondition) {
            return {
                background: '#259F94',
            };
        } else if (statusRedColorCondition) {
            return {
                background: '#E66767',
            };
        } else if (statusDarkRedColorCondition) {
            return {
                background: '#DF3C3C',
            };
        } else if (statusOrangeColorCondition) {
            return {
                background: '#FAB15C',
            };
        } else if (statusOrange2ColorCondition) {
            return {
                background: '#FF906D',
            };
        } else if (statusYellowColorCondition) {
            return {
                background: '#DFC66C',
            };
        } else if (statusYellow2ColorCondition) {
            return {
                background: '#D6BC61',
            };
        } else if (statusYellow3ColorCondition) {
            return {
                background: '#C5A84A',
            };
        } else if (statusYellow4ColorCondition) {
            return {
                background: '#CDB255',
            };
        } else if (statusDarkYellowColorCondition) {
            return {
                background: '#BD9F41',
            };
        } else if (statusDarkRed2ColorCondition) {
            return {
                background: '#ED9292',
            };
        }
    }
}
