import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loadStatusColor',
    standalone: true,
})
export class LoadStatusColorPipe implements PipeTransform {
    transform(
        status: string,
        isBadge?: boolean
    ): { color: string; backgroundColor?: string } {
        status = status.replace(/\s+/g, '');
        const statusGreyColorCondition = status === 'Booked';
        const statusDarkGreyColorCondition = status === 'Unassigned';
        const statusDarkGrey2ColorCondition = ['Hold', 'Revised'].includes(
            status
        );
        const statusGreenColorCondition = status === 'Assigned';
        const statusBlueColorCondition = [
            'RepairDispatched',
            'Dispatched',
        ].includes(status);
        const statusTurquoiseColorCondition = [
            'Arrived',
            'ArrivedPickup',
            'CheckedInPickup',
            'Loading',
        ].includes(status);
        const statusDarkTurquoiseColorCondition = status === 'Loaded';
        const statusRedColorCondition = [
            'ArrivedDelivery',
            'CheckedInDelivery',
            'Offloading',
            'Checked-In',
        ].includes(status);
        const statusDarkRedColorCondition = status === 'Offloaded';
        const statusDarkRed2ColorCondition = [
            'Cancelled',
            'Split',
        ].includes(status);
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
            return isBadge
                ? { color: '#fff', backgroundColor: '#AAAAAA' }
                : { color: '#AAAAAA' };
        } else if (statusDarkGreyColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#919191' }
                : { color: '#919191' };
        } else if (statusGreenColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#50AC25' }
                : { color: '#50AC25' };
        } else if (statusBlueColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#3B73ED' }
                : { color: '#3B73ED' };
        } else if (statusTurquoiseColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#56B4AC' }
                : { color: '#56B4AC' };
        } else if (statusDarkTurquoiseColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#259F94' }
                : { color: '#259F94' };
        } else if (statusRedColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#E66767' }
                : { color: '#E66767' };
        } else if (statusDarkRedColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#DF3C3C' }
                : { color: '#DF3C3C' };
        } else if (statusOrangeColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#F89B2E' }
                : { color: '#F89B2E' };
        } else if (statusYellowColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#DFC66C' }
                : { color: '#DFC66C' };
        } else if (statusDarkYellowColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#BD9F41' }
                : { color: '#BD9F41' };
        } else if (statusDarkGrey2ColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#6c6c6c' }
                : { color: '#6c6c6c' };
        } else if (statusDarkRed2ColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#C20C0C' }
                : { color: '#C20C0C' };
        } else if (statusDarkRed3ColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#C20C0C' }
                : { color: '#C20C0C' };
        }
    }
}
