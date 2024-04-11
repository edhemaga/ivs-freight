import { TruckTrailer } from '../../models/truck-trailer.model';

export class DispatchConstants {
    static TRAILER_TYPES: TruckTrailer[] = [
        {
            id: 1,
            name: 'Reefer',
            icon: 'assets/svg/common/trailers/ic_trailer_reefer.svg',
            color: 'FF5454',
        },
        {
            id: 2,
            name: 'Dry Van',
            icon: 'assets/svg/common/trailers/ic_trailer_dryvan.svg',
            color: '6D82C7',
        },
        {
            id: 3,
            name: 'Side Kit',
            icon: 'assets/svg/common/trailers/ic_trailer_side-kit.svg',
            color: '56AB62',
        },
        {
            id: 4,
            name: 'Conestoga',
            icon: 'assets/svg/common/trailers/ic_trailer_conestoga.svg',
            color: '3C3C3C',
        },
        {
            id: 5,
            name: 'Dumper',
            icon: 'assets/svg/common/trailers/ic_trailer_dumper.svg',
            color: '6FDFE4',
        },
        {
            id: 6,
            name: 'Container',
            icon: 'assets/svg/common/trailers/ic_trailer_container.svg',
            color: 'F89A3D',
        },
        {
            id: 7,
            name: 'Tanker',
            icon: 'assets/svg/common/trailers/ic_trailer_tanker-liquid.svg',
            color: '1E9DF3',
        },
        {
            id: 8,
            name: 'Car Hauler',
            icon: 'assets/svg/common/trailers/ic_trailer_carhauler.svg',
            color: '59A5A5',
        },
        {
            id: 9,
            name: 'Flat Bed',
            icon: 'assets/svg/common/trailers/ic_trailer_flatbed.svg',
            color: 'A468FF',
        },
        {
            id: 10,
            name: 'Low Boy/RGN',
            icon: 'assets/svg/common/trailers/ic_trailer_low-boy.svg',
            color: 'A34CB8',
        },
        {
            id: 11,
            name: 'Chassis',
            icon: 'assets/svg/common/trailers/ic_trailer_chassis.svg',
            color: '4A9A4F',
        },
        {
            id: 12,
            name: 'Step Deck',
            icon: 'assets/svg/common/trailers/ic_trailer_step-deck.svg',
            color: 'F3D542',
        },
    ];

    static TRUCK_TYPES: TruckTrailer[] = [
        {
            id: 1,
            name: 'Semi Truck',
            icon: 'assets/svg/common/semi-truck.svg',
            color: '97D568',
        },
        {
            id: 2,
            name: 'Semi Sleeper',
            icon: 'assets/svg/common/trucks/ic_truck_semi-wSleeper.svg',
            color: 'FFB74D',
        },
        {
            id: 3,
            name: 'Box Truck',
            icon: 'assets/svg/common/trucks/ic_truck_box-truck.svg',
            color: 'E57373',
        },
        {
            id: 4,
            name: 'Cargo Van',
            icon: 'assets/svg/common/trucks/ic_truck_cargo-van.svg',
            color: '68C3FF',
        },
        {
            id: 5,
            name: 'Tow Truck',
            icon: 'assets/svg/common/trucks/ic_truck_tow-truck.svg',
            color: 'BA68C8',
        },
        {
            id: 6,
            name: 'Car Hauler',
            icon: 'assets/svg/common/trucks/ic_truck_car-hauler.svg',
            color: '59A5A5',
        },
        {
            id: 7,
            name: 'Spotter',
            icon: 'assets/svg/common/trucks/ic_truck_spotter.svg',
            color: '415FC1',
        },
    ];
}
