import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dispatchStatusColor',
    standalone: true,
})
export class dispatchStatusColorPipe implements PipeTransform {
    transform(
        status: string,
        isDarkColor: boolean
    ): { color: string; backgroundColor?: string } {
        const adjustedStatus = status.replace(/\s+/g, '');

        const statusDarkGreyColorCondition = adjustedStatus === 'DeadHeading';

        const statusDarkGreyColorReversedCondition = adjustedStatus === 'Off';

        const statusLightPurpleColorCondition = adjustedStatus === 'Towing';
        const statusLightYellowColorCondition = adjustedStatus === 'Empty';

        const statusLightOrangeColorCondition = [
            'Repair',
            'DispatchedRepair',
            'LoadedRepair',
        ].includes(adjustedStatus);
        const statusTurquoiseColorCondition = [
            'ArrivedPickup',
            'CheckedInPickup',
            'Loading',
        ].includes(adjustedStatus);
        const statusLightGreenColorCondition = adjustedStatus === 'Available';

        const statusBlueColorCondition = ['Dispatched'].includes(
            adjustedStatus
        );

        const statusDarkTurquoiseColorCondition = ['Loaded'].includes(
            adjustedStatus
        );
        const statusRedColorCondition = [
            'Offloading',
            'ArrivedDelivery',
            'CheckedInDelivery',
            'Checked-In',
        ].includes(adjustedStatus);
        const statusDarkRedColorCondition = [
            'Offloaded',
            'RepairOffloaded',
        ].includes(status);
        const statusDarkRed2ColorCondition = [
            'Cancelled',
            'Cancel',
            'Canceled',
        ].includes(status);

        if (statusDarkGreyColorCondition) {
            return { color: isDarkColor ? '#AAAAAA' : '#919191' };
        } else if (statusDarkGreyColorReversedCondition) {
            return { color: isDarkColor ? '#919191' : '#AAAAAA' };
        } else if (statusBlueColorCondition) {
            return { color: isDarkColor ? '#92B1F5' : '#3B73ED' };
        } else if (statusTurquoiseColorCondition) {
            return { color: isDarkColor ? '#56B4AC' : '#56B4AC' };
        } else if (statusDarkTurquoiseColorCondition) {
            return { color: isDarkColor ? '#86C9C3' : '#259F94' };
        } else if (statusRedColorCondition) {
            return { color: isDarkColor ? '#E66767' : '#E66767' };
        } else if (statusDarkRedColorCondition) {
            return { color: isDarkColor ? '#ED9292' : '#DF3C3C' };
        } else if (statusDarkRed2ColorCondition) {
            return { color: isDarkColor ? ' #F4BEBE' : '#C20C0C' };
        } else if (statusLightGreenColorCondition) {
            return { color: isDarkColor ? '#9ED186' : '#50AC25' };
        } else if (statusLightPurpleColorCondition) {
            return { color: isDarkColor ? '#C999F4' : '#9E47EC' };
        } else if (statusLightOrangeColorCondition) {
            return { color: isDarkColor ? '#FFB097' : '#FF7043' };
        } else if (statusLightYellowColorCondition) {
            return { color: isDarkColor ? '#FAB15C' : '#F89B2E' };
        }
    }
}
