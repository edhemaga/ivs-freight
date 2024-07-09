import moment from 'moment';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatTimePipe } from '@shared/pipes/format-time.pipe';

// models
import { LoadStopLastStatus } from '@pages/load/pages/load-details/components/load-details-item/models/load-stop-last-status.model';
import { StopItemsHeaderItem } from '@pages/load/pages/load-details/components/load-details-item/models/stop-items-header-item.model';

export class LoadDetailsItemHelper {
    static getStopHeaderItems(loadStatus: string): string[] {
        return [
            '#',
            'LOCATION, TYPE',
            'SHIPPER, ADDRESS',
            'CONTACT, PHONE',
            'DATE, TIME',
            loadStatus !== 'Pending' ? 'CHECK-IN' : null,
            'LEG',
        ].filter((headerItemText) => headerItemText);
    }

    static getStopItemsHeaderItems(): StopItemsHeaderItem[] {
        return [
            {
                title: '#',
            },
            {
                title: 'DESCRIPTION',
            },
            {
                title: 'QUANTITY',
            },
            {
                title: '°F',
                icon: 'assets/svg/common/load/ic_temperature.svg',
            },
            {
                title: 'lbs',
                icon: 'assets/svg/common/ic_weight.svg',
                iconMargin: '3px',
            },
            {
                title: 'ft',
                icon: 'assets/svg/common/load/ic_length.svg',
                iconMargin: '2px',
            },
            {
                title: 'ft',
                icon: 'assets/svg/common/load/ic_height.svg',
            },
            {
                title: 'ft',
                icon: 'assets/svg/common/load/ic_tarp.svg',
                iconMargin: '3px',
            },
            {
                icon: 'assets/svg/common/load/ic_stackable.svg',
            },
            {
                title: 'SECURE',
            },
            {
                title: 'BOL NO',
            },
            {
                title: 'PICKUP NO',
            },
            {
                title: 'SEAL NO',
            },
            {
                title: 'CODE ',
            },
        ];
    }

    static removeNumbersFromStatusString(statusString: string) {
        const regex = /\d+/g;

        return statusString.replace(regex, '');
    }

    static checkStopOrderOrder(statusId: number): string {
        if (statusId === 46 || statusId === 48 || statusId === 50)
            return '#56B4AC';

        if (statusId === 3) return '#259F94';

        if (statusId === 47 || statusId === 49) return '#E66767';

        if (statusId === 5) return '#DF3C3C';
    }

    static createStopLastStatus(
        stopType: string,
        statusString: string,
        dateTimeFrom: string,
        dateTimeTo?: string,
        formatDatePipe?: FormatDatePipe,
        formatTimePipe?: FormatTimePipe
    ): LoadStopLastStatus {
        let lastStatus: string;
        let lastStatusTime: string;

        if (dateTimeTo) {
            const formatedDateFrom = formatDatePipe.transform(dateTimeFrom);
            const formatedTimeFrom = formatTimePipe.transform(dateTimeFrom);
            const formatedTimeTo = formatTimePipe.transform(dateTimeTo);

            const dateTo = moment(dateTimeTo);
            const duration = moment.duration(dateTo.diff(dateTimeFrom));

            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();

            lastStatus = `${formatedDateFrom} 
                                        ${days || hours || minutes ? ' • ' : ''}
                    	                ${days ? days + ' d' : ''} 
                                        ${hours ? hours + ' h' : ''} 
                                        ${minutes ? minutes + 'm' : ''}`;
            lastStatusTime = `${formatedTimeFrom} - ${formatedTimeTo}`;
        } else {
            const firstSpaceIndex = statusString.indexOf(' ');
            const secondSpaceIndex = statusString.indexOf(
                ' ',
                firstSpaceIndex + 1
            );

            const now = moment();
            const duration = moment.duration(now.diff(dateTimeFrom));

            const days = duration.days();
            const hours = duration.hours();
            const minutes = duration.minutes();

            lastStatus = statusString
                .slice(
                    0,
                    stopType === 'Delivery' ? secondSpaceIndex : firstSpaceIndex
                )
                .trim()
                .toUpperCase();

            lastStatusTime = `${days ? days + ' d' : ''} 
                              ${hours ? hours + ' h' : ''} 
                              ${minutes ? minutes + ' min ago' : ''}`;

            if (
                stopType === 'Delivery' &&
                (lastStatus === 'LOADED' || lastStatus === 'LOADING')
            )
                lastStatus = 'OFF' + lastStatus;
        }

        return {
            lastStatus,
            lastStatusTime,
        };
    }
}
