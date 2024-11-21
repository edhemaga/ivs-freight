import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dropdownLoadStatusColor',
    standalone: true,
})
export class DropdownLoadStatusColorPipe implements PipeTransform {
    transform(
        status: string,
        isBadge?: boolean
    ): { color: string; backgroundColor?: string } {
        if(!status) return;
        const adjustedStatus = status.replace(/\s+/g, '');

        const statusGreyColorCondition = adjustedStatus === 'Booked';
        const statusDarkGreyColorCondition = adjustedStatus === 'Unassigned';
        const statusDarkGrey2ColorCondition = [
            'InvoicedHold',
            'Hold',
            'HoldFactoring',
            'Revised',
            'RevisedFactoring',
        ].includes(adjustedStatus);

        const statusGreenColorCondition = status === 'Assigned';
        const statusBlueColorCondition = [
            'RepairDispatched',
            'Dispatched',
        ].includes(status);
        const statusTurquoiseColorCondition = [
            'Arrived',
            'ArrivedPickup',
            'CheckedInPickup',
            'CheckedIn',
            'Loading',
        ].includes(adjustedStatus);
        const statusDarkTurquoiseColorCondition = [
            'Loaded',
            'RepairLoaded',
        ].includes(adjustedStatus);
        const statusRedColorCondition = [
            'ArrivedDelivery',
            'CheckedInDelivery',
            'Offloading',
            'Checked-In',
            'Tonu',
        ].includes(status);
        const statusDarkRedColorCondition = [
            'Offloaded',
            'RepairOffloaded',
        ].includes(status);
        const statusDarkRed2ColorCondition = [
            'Cancelled',
            'Split',
            'LoadCanceled',
        ].includes(status);
        const statusOrangeColorCondition = status === 'Delivered';
        const statusYellowColorCondition = [
            'Invoiced',
            'Paid',
            'InvoicedFactoring',
            'TonuInvoiced',
            'TonuInvoicedFactoring',
        ].includes(adjustedStatus);
        const statusDarkYellowColorCondition = [
            'Claim',
            'Unpaid',
            'ShortPaid',
            'TonuUnpaid',
            'TonuClaim',
            'TonuClaimFactoring',
            'ClaimFactoring',
            'UnpaidFactoring',
            'RevisedUnpaid',
            'RevisedUnpaidFactoring',
            'RevisedClaim',
            'RevisedClaimFactoring',
            'TonuUnpaidFactoring',
        ].includes(adjustedStatus);
        const statusMildDarkYellowColorCondition = [
            'ShortPaidFactoring',
            'RevisedPaid',
            'RevisedShortPaidFactoring',
            'RevisedShortPaid',
            'TonuShortPaid',
            'TonuShortPaidFactoring',
            'TonuPaid',
            'TonuPaidFactoring',
            'RevisedPaidFactoring',
            'PaidFactoring',
        ].includes(adjustedStatus);

        if (statusGreyColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#919191' }
                : { color: '#919191' };
        } else if (statusDarkGreyColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#CCCCCC' }
                : { color: '#CCCCCC' };
        } else if (statusGreenColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#9ED186' }
                : { color: '#9ED186' };
        } else if (statusBlueColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#FF906D' }
                : { color: '#92B1F5' };
        } else if (statusTurquoiseColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#56B4AC' }
                : { color: '#56B4AC' };
        } else if (statusDarkTurquoiseColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#FF906D' }
                : { color: '#86C9C3' };
        } else if (statusRedColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#E66767' }
                : { color: '#E66767' };
        } else if (statusDarkRedColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#FF906D' }
                : { color: '#ED9292' };
        } else if (statusOrangeColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#FAB15C' }
                : { color: '#FAB15C' };
        } else if (statusYellowColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#b370f0' }
                : { color: '#DFC66C' };
        } else if (statusDarkYellowColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#BD9F41' }
                : { color: '#BD9F41' };
        } else if (statusDarkGrey2ColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#DAAD4F' }
                : { color: '#DADADA' };
        } else if (statusDarkRed2ColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#F4BEBE' }
                : { color: '#F4BEBE' };
        } else if (statusMildDarkYellowColorCondition) {
            return isBadge
                ? { color: '#2F2F2F', backgroundColor: '#CDB255' }
                : { color: '##CDB255' };
        }
    }
}
