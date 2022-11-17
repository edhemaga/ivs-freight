import { HttpParams } from '@angular/common/http';
import {
    dateFormat,
    formatPhoneNumber,
} from '../../app/core/helpers/formating';
/// <reference types="@types/googlemaps" />
declare var google: any;

/* Doppler Radar */
export function imageMapType(rad: any) {
    return new google.maps.ImageMapType({
        getTileUrl(tile, zoom) {
            return (
                `http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/${rad.nexrad}/` +
                zoom +
                '/' +
                tile.x +
                '/' +
                tile.y +
                '.png?' +
                new Date().getTime()
            );
        },
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.0,
        name: 'NEXRAD',
    });
}

/*User object maping*/

// TODO: dodati type za user
export function mapUserData(user: any): any {
    if (user.firstName && user.lastName) {
        user.firstName =
            user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.firstName;
    }

    if (user.userType === 'master' || user.baseUserType === 'master') {
        user.userType = `Owner`;
    }

    if (
        user.userType === 'cmp_admin' ||
        user.userType === 'pwd_admin' ||
        user.userType === 'tmp_admin'
    ) {
        user.userType = user.userType ? `admin` : user.userType;
    }

    if (
        user.userType === 'cmp_dispatcher' ||
        user.userType === 'pwd_dispatcher' ||
        user.userType === 'tmp_dispatcher'
    ) {
        user.userType = user.userType ? `dispatcher` : user.userType;
    }

    if (user.userType) {
        user.userType = user.userType
            ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1)
            : user.userType;
    }

    if (user.dateValue) {
        user.dateValue = user.dateValue
            ? dateFormat(user.dateValue)
            : user.dateValue;
    }

    if (user.doc && user.doc.phone) {
        user.doc.phone = user.doc.phone
            ? formatPhoneNumber(user.doc.phone)
            : user.doc.phone;
    }
    return user;
}

/* GPS Legend Data */
export function getGPSLegendData() {
    return [
        {
            title: 'Moving vehicle',
            index: 0,
            type: [
                {
                    icon: '../../assets/img/svgs/GPS/Moving Directions/N.svg',
                    text: 'Assigned moving vehicle',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Unassign/N.svg',
                    text: 'Unassigned moving vehicle',
                },
            ],
        },
        {
            title: 'Multiple vehicles',
            index: 1,
            type: [
                {
                    icon: '../../assets/img/svgs/GPS/Legend/Moving 2+ vehicles.svg',
                    text: 'Moving 2+ vehicles',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Legend/Short stop 2+ vehicles.svg',
                    text: 'Short stop 2+ vehicles ',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Legend/New-Extended stop 2+ vehicles.svg',
                    text: 'Extended stop 2+ vehicles',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Legend/Parked 2+ vehicles.svg',
                    text: 'Parked 2+ vehicles',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Legend/Mix 2+ vehicles.svg',
                    text: 'Mix 2+ vehicles',
                },
            ],
        },
        {
            title: 'Stopped vehicles',
            index: 2,
            type: [
                {
                    icon: '../../assets/img/svgs/GPS/Legend/New-Short stop - From 0m to 30mNew.svg',
                    text: 'Short stop - From 0m to 30m',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Legend/New-Extended stop - From 30m to 12h.svg',
                    text: 'Extended stop - From 30m to 12h',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Legend/Parking- 12+ hours.svg',
                    text: 'Parking- 12+ hours',
                },
            ],
        },
        {
            title: '',
            index: 3,
            type: [
                {
                    icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg',
                    text: 'Ignition on',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg',
                    text: 'Ignition off',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg',
                    text: 'Unassigned Ignition on',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg',
                    text: 'Unassigned Ignition off',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg',
                    text: 'Ignition on',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-EXTENDET STOP IG-OFF.svg',
                    text: 'Ignition off',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg',
                    text: 'Unassigned Ignition on',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-EXTENDED STOP IG-OFF.svg',
                    text: 'Unassigned Ignition off',
                },

                {
                    icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/PARKING IG-ON.svg',
                    text: 'Ignition on',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/PARKING IG-OFF.svg',
                    text: 'Ignition off',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/PARKING IG-ON.svg',
                    text: 'Unassigned Ignition on',
                },
                {
                    icon: '../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/PARKING IG-OFF.svg',
                    text: 'Unassigned Ignition off',
                },
            ],
        },
    ];
}

/* Get Data From Gps SignalR Response */
export function getDataFromGpsResponse(gpsRespons: any, i: number) {
    const marker = getGpsMarkerData(
        gpsRespons[i],
        gpsRespons[i].truckId
    ).marker;
    const statusOfVehicle = getGpsMarkerData(
        gpsRespons[i],
        gpsRespons[i].truckId
    ).statusOfVehicle;
    const speed = getGpsMarkerData(gpsRespons[i], gpsRespons[i].truckId).speed;

    return {
        lat: gpsRespons[i].latitude,
        long: gpsRespons[i].longitude,
        speed,
        vehicleStatus: statusOfVehicle,
        statusTime: getTimeDifference(gpsRespons[i], true),
        statusDays: getTimeDifference(gpsRespons[i], false),
        course: gpsRespons[i].course,
        eventDateTime: gpsRespons[i].eventDateTime,
        hardwareID: gpsRespons[i].uniqueId,
        marker: marker ? marker : '',
        driverName:
            gpsRespons[i].driverFullName !== ' '
                ? gpsRespons[i].driverFullName
                : 'No Driver',
        distance: gpsRespons[i].distance,
        totalDistance: gpsRespons[i].totalDistance,
        altitude: gpsRespons[i].altitude,
        truckId: gpsRespons[i].truckId ? gpsRespons[i].truckId : undefined,
        truckNumber: gpsRespons[i].truckNumber
            ? gpsRespons[i].truckNumber
            : 'No Data',
        truckLoadNumber: gpsRespons[i].truckloadId
            ? gpsRespons[i].truckloadId
            : 'No Data',
        trailerNumber: gpsRespons[i].trailerNumber
            ? gpsRespons[i].trailerNumber
            : 'No Data',
        fullAddress: gpsRespons[i].address ? gpsRespons[i].address : '',
        fullLocation: gpsRespons[i].location ? gpsRespons[i].location : '',
        dispatchBoardStatus: gpsRespons[i].dispatchBoardStatus
            ? gpsRespons[i].dispatchBoardStatus
            : '',
        ignition: gpsRespons[i].ignition,
        animation: '',
        motion: gpsRespons[i].motion,
        shortStop: gpsRespons[i].shortStop,
        parking: gpsRespons[i].parking,
        extendedStop: gpsRespons[i].extendedStop,
    };
}

/* Get GPS Marker Data */
export function getGpsMarkerData(gpsData: any, isAssigned) {
    let marker: string;
    let statusOfVehicle: string;
    let speed: string;
    let driverNameColor: string;
    let clusterMurker: string;

    if (gpsData.motion) {
        /*  FOR MOVING */
        marker = !isAssigned
            ? `../../assets/img/svgs/GPS/Unassign/${gpsData.course}.svg`
            : `../../assets/img/svgs/GPS/Moving Directions/${gpsData.course}.svg`;
        statusOfVehicle = 'Moving';
        speed = Math.round(gpsData.speed) + ' Mph';
        driverNameColor = '#5673AA';
        clusterMurker = marker;
    } else {
        const millSec = getTimeDifference(gpsData, true);

        if (Math.round(millSec / (1000 * 60 * 60)) >= 12) {
            /* FOR PARKING */
            if (gpsData.ignition) {
                marker = !isAssigned
                    ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/PARKING IG-ON.svg`
                    : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/PARKING IG-ON.svg`;
            } else {
                marker = !isAssigned
                    ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/PARKING IG-OFF.svg`
                    : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/PARKING IG-OFF.svg`;
            }
            statusOfVehicle = 'Parking';
            speed = '/';
            driverNameColor = '#6C6C6C';
            clusterMurker =
                '../../assets/img/svgs/GPS/Cluster Dropdown/cluster-parking.svg';
        } else if (
            Math.round(millSec / (1000 * 60)) >= 30 &&
            Math.round(millSec / (1000 * 60 * 60)) < 12
        ) {
            /* FOR EXTENDED STOP */
            if (gpsData.ignition) {
                marker = !isAssigned
                    ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg`
                    : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-EXTENDED STOP IG-ON.svg`;
            } else {
                marker = !isAssigned
                    ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-EXTENDED STOP IG-OFF.svg`
                    : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-EXTENDET STOP IG-OFF.svg`;
            }
            statusOfVehicle = 'Extended Stop';
            speed = '/';
            driverNameColor = '#F96C62';
            clusterMurker =
                '../../assets/img/svgs/GPS/Cluster Dropdown/cluster-cluster-extended stop.svg';
        } else {
            /* FOR SHORT STOP */
            if (gpsData.ignition) {
                marker = !isAssigned
                    ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg`
                    : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-On/New-SHORT STOP IG ON.svg`;
            } else {
                marker = !isAssigned
                    ? `../../assets/img/svgs/GPS/Status/UNASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg`
                    : `../../assets/img/svgs/GPS/Status/ASSIGNED/Ignation-Off/New-SHORT STOP IG OFF.svg`;
            }
            statusOfVehicle = 'Short Stop';
            speed = '/';
            driverNameColor = '#FFA24E';
            clusterMurker =
                '../../assets/img/svgs/GPS/Cluster Dropdown/cluster-short-stop.svg';
        }
    }

    return {
        marker,
        statusOfVehicle,
        speed,
        driverNameColor,
        clusterMurker,
    };
}

/* Get Time Difference  */
export function getTimeDifference(gpsResponse: any, isTime: boolean) {
    const date1 = new Date(gpsResponse.eventDateTime);
    const date2 = new Date();
    const time = date2.getTime() - date1.getTime();
    const days = Math.round(time / (1000 * 3600 * 24));
    if (isTime) {
        return time;
    } else {
        return days;
    }
}

/* Pagination And Filter Paramas */
export function checkParamas(queryParams: any) {
    if (queryParams) {
        let params = new HttpParams()
            .set('Search', queryParams.filterData.search)
            .set('Search1', queryParams.filterData.search1)
            .set('Search2', queryParams.filterData.search2)
            .set('Sort', queryParams.filterData.sort)
            .set('StartDate', queryParams.filterData.startDate)
            .set('EndDate', queryParams.filterData.endDate)
            .set('TruckNumber', queryParams.filterData.truckNumber);

        if (
            !queryParams.filterData.search ||
            queryParams.filterData.search === ''
        ) {
            params = params.delete('Search', undefined);
        }
        if (
            !queryParams.filterData.search1 ||
            queryParams.filterData.search1 === ''
        ) {
            params = params.delete('Search1', undefined);
        }
        if (
            !queryParams.filterData.search2 ||
            queryParams.filterData.search2 === ''
        ) {
            params = params.delete('Search2', undefined);
        }
        if (
            !queryParams.filterData.sort ||
            queryParams.filterData.sort === ''
        ) {
            params = params.delete('Sort', undefined);
        }
        if (
            !queryParams.filterData.startDate ||
            queryParams.filterData.startDate === ''
        ) {
            params = params.delete('StartDate', undefined);
        }
        if (
            !queryParams.filterData.endDate ||
            queryParams.filterData.endDate === ''
        ) {
            params = params.delete('EndDate', undefined);
        }
        if (
            !queryParams.filterData.truckNumber ||
            queryParams.filterData.truckNumber === ''
        ) {
            params = params.delete('TruckNumber', undefined);
        }

        return params;
    } else {
        return new HttpParams();
    }
}

export function getRepairTypesData() {
    const shopTypeFilter = JSON.parse(
        localStorage.getItem('repair_shops_shopTypeFilter')
    );

    let types = [
        { option: 'Truck', active: false },
        { option: 'Trailer', active: false },
        { option: 'Mobile', active: false },
        { option: 'Shop', active: false },
        { option: 'Towing', active: false },
        { option: 'Parts', active: false },
        { option: 'Tire', active: false },
        { option: 'Dealer', active: false },
    ];

    if (shopTypeFilter?.length) {
        for (const type of types) {
            for (const shopType of shopTypeFilter) {
                if (type.option === shopType.option) {
                    type.active = shopType.active;
                }
            }
        }
    }

    return types;
}

export function hexToRgbA(hex, opacity?) {
    let c;
    let addOpacity = opacity || opacity == 0 ? opacity : 1;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return (
            'rgba(' +
            [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
            ',' +
            addOpacity +
            ')'
        );
    }
    throw new Error('Bad Hex');
}
