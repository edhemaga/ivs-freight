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
        const adjustedStatus = status.replace(/\s+/g, '');

        const statusGreyColorCondition = adjustedStatus === 'Booked';
        const statusDarkGreyColorCondition = [
            'Unassigned',
            'DeadHeading',
            'Off',
        ].includes(adjustedStatus);

        const statusLightPurpleColorCondition = adjustedStatus === 'Towing';
        const statusLightYellowColorCondition = adjustedStatus === 'Empty';

        const statusLightRedColorCondition = adjustedStatus === 'Cancel';
        const statusLightOrangeColorCondition = [
            'Repair',
            'DispatchedRepair',
        ].includes(adjustedStatus);

        const statusLightGreenColorCondition = adjustedStatus === 'Available';
        const statusDarkGrey2ColorCondition = [
            'InvoicedHold',
            'Hold',
            'HoldFactoring',
            'Revised',
            'RevisedFactoring',
        ].includes(adjustedStatus);
        const statusGreenColorCondition = ['Assigned', 'Available'].includes(
            adjustedStatus
        );
        const statusBlueColorCondition = [
            'RepairDispatched',
            'Dispatched',
        ].includes(adjustedStatus);
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
        ].includes(adjustedStatus);
        const statusDarkRedColorCondition = [
            'Tonu',
            'Offloaded',
            'RepairOffloaded',
        ].includes(status);
        const statusDarkRed2ColorCondition = [
            'Cancelled',
            'Split',
            'LoadCancelled',
        ].includes(status);
        const statusDarkRed3ColorCondition = status === 'Tonu';
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
                ? { color: '#fff', backgroundColor: '#b370f0' }
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
        } else if (statusMildDarkYellowColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#CDB255' }
                : { color: '#CDB255' };
        } else if (statusLightGreenColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#9ED186' }
                : { color: '#9ED186' };
        } else if (statusLightPurpleColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#C999F4' }
                : { color: '#C999F4' };
        } else if (statusLightRedColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#F4BEBE' }
                : { color: '#F4BEBE' };
        } else if (statusLightOrangeColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#FF7043' }
                : { color: '#FF7043' };
        } else if (statusLightYellowColorCondition) {
            return isBadge
                ? { color: '#fff', backgroundColor: '#FAB15C' }
                : { color: '#FAB15C' };
        }
    }
}
