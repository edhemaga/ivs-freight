import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loadStatusColor',
    standalone: true,
})
export class LoadStatusColorPipe implements PipeTransform {
    transform(status: string): { color: string } {
        const statusGreyColorCondition = status === 'Booked';
        const statusDarkGreyColorCondition = status === 'Unassigned';
        const statusDarkGrey2ColorCondition = ['Hold', 'Revised'].includes(
            status
        );
        const statusGreenColorCondition = status === 'Assigned';
        const statusBlueColorCondition = status === 'Dispatched';
        const statusTurquoiseColorCondition = [
            'ArrivedPickup',
            'CheckedInPickup',
            'Loading',
        ].includes(status);
        const statusDarkTurquoiseColorCondition = status === 'Loaded';
        const statusRedColorCondition = [
            'ArrivedDelivery',
            'CheckedInDelivery',
            'Offloading',
        ].includes(status);
        const statusDarkRedColorCondition = status === 'Offloaded';
        const statusDarkRed2ColorCondition = status === 'Cancelled';
        const statusDarkRed3ColorCondition = status === 'Tonu';
        const statusOrangeColorCondition = status === 'Delivered';
        const statusYellowColorCondition = ['Invoiced', 'Paid'].includes(
            status
        );
        const statusDarkYellowColorCondition = [
            'Claim',
            'Unpaid',
            'ShortPaid',
        ].includes(status);

        if (statusGreyColorCondition) {
            return {
                color: '#AAAAA',
            };
        } else if (statusDarkGreyColorCondition) {
            return {
                color: '#919191',
            };
        } else if (statusGreenColorCondition) {
            return {
                color: '#50AC25',
            };
        } else if (statusBlueColorCondition) {
            return {
                color: '#3B73ED',
            };
        } else if (statusTurquoiseColorCondition) {
            return {
                color: '#56B4AC',
            };
        } else if (statusDarkTurquoiseColorCondition) {
            return {
                color: '#259F94',
            };
        } else if (statusRedColorCondition) {
            return {
                color: '#E66767',
            };
        } else if (statusDarkRedColorCondition) {
            return {
                color: '#DF3C3C',
            };
        } else if (statusOrangeColorCondition) {
            return {
                color: '#F89B2E',
            };
        } else if (statusYellowColorCondition) {
            return {
                color: '#DFC66C',
            };
        } else if (statusDarkYellowColorCondition) {
            return {
                color: '#BD9F41',
            };
        } else if (statusDarkGrey2ColorCondition) {
            return {
                color: '#6c6c6c',
            };
        } else if (statusDarkRed2ColorCondition) {
            return {
                color: '#C20C0C',
            };
        } else if (statusDarkRed3ColorCondition) {
            return {
                color: '#C20C0C',
            };
        }
    }
}
