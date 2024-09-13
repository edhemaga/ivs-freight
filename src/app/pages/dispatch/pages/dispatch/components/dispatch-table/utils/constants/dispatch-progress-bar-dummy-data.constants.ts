import { DispatchProgressBarData } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-progress-bar-data.model';

export class DispatchProgressBarDummyData {
    static dispatchProgressData: DispatchProgressBarData = {
        currentPosition: 50,
        mileageInfo: '226.3 mi',
        currentStop: {
            type: 'currentStop',
            heading: 'Current Location',
            position: 50,
            location: 'Philadelphia, PA',
            mileage: '',
        },
        gpsTitle: '128.4 mi',
        gpsInfo: {
            gpsheading: 'MOVING - SOUTH',
            gpsTime: '3:47',
        },
        mileagesPercent: '59%',
        gpsProgress: [
            {
                type: 'start',
                heading: 'Origin',
                position: 0,
                location: 'Springdale, DA',
                mileage: '305.7 mi ago',
                time: '05/09/21 04:00 PM',
            },
            {
                type: 'pickup',
                heading: 'Pickup (1)',
                position: 20,
                location: 'Ocala, FL',
                mileage: '225.6 mi ago',
                time: '05/09/21 06:00 PM',
            },
            {
                type: 'pickup',
                heading: 'Pickup (2)',
                position: 40,
                location: 'Atlanta, GA',
                mileage: '225.6 mi ago',
                time: '05/09/21 07:00 PM',
            },
            {
                type: 'pickup',
                heading: 'Pickup (3)',
                position: 60,
                location: 'Milwaukee, WI',
                mileage: '325.6 mi ago',
                time: '05/09/21 09:00 PM',
            },
            {
                type: 'delivery',
                heading: 'Delivery (1)',
                position: 80,
                location: 'Louisville, KY',
                mileage: '50.7 mi ago',
                time: '05/09/21 11:00 PM',
            },
            {
                type: 'delivery',
                heading: 'Delivery (2)',
                position: 100,
                location: 'Louisville, KY',
                mileage: '50.7 mi ago',
                time: '05/09/21 11:00 PM',
            },
        ],
    };
}
