export class DispatchHistoryModalConstants {
    static DISPATCH_HISTORY_HEADER_ITEMS: string[] = [
        'DISPATCH BOARD',
        'TRUCK',
        'TRAILER',
        'DRIVER',
        'START',
        'END',
        'TOTAL',
    ];

    static DISPATCH_HISTORY_GROUP_HEADER_ITEMS: string[] = [
        'STATUS',
        'START',
        'END',
        'TOTAL',
    ];

    static IS_INPUT_HOVER_ROW_DISPATCH: boolean[] = [
        false,
        false,
        false,
        false,
    ];
}

/* 



TIME /////////////////////////////////////////////////////////////


isTimeSelected

isTimeSelected, isDispatchBoardSelected
isTimeSelected, isDispatchBoardSelected, isTruckSelected
isTimeSelected, isDispatchBoardSelected, isTruckSelected, isTrailerSelected

isTimeSelected, isTruckSelected, isTrailerSelected, isDriverSelected
isTimeSelected, isDispatchBoardSelected, isTrailerSelected, isDriverSelected
isTimeSelected, isDispatchBoardSelected, isTruckSelected, isDriverSelected

isTimeSelected, isTrailerSelected, isDriverSelected
isTimeSelected, isTruckSelected, isDriverSelected
isTimeSelected, isTruckSelected, isTrailerSelected
isTimeSelected, isDispatchBoardSelected, isTrailerSelected
isTimeSelected, isDispatchBoardSelected, isDriverSelected

isTimeSelected, isTruckSelected
isTimeSelected, isTrailerSelected
isTimeSelected, isDriverSelected

isTimeSelected, isDispatchBoardSelected, isTruckSelected, isTrailerSelected, isDriverSelected



DISPATCH BOARD /////////////////////////////////////////////////////////////

isDispatchBoardSelected

isDispatchBoardSelected, isTruckSelected
isDispatchBoardSelected, isTrailerSelected
isDispatchBoardSelected, isDriverSelected

isDispatchBoardSelected, isTruckSelected, isTrailerSelected
isDispatchBoardSelected, isTruckSelected, isDriverSelected
isDispatchBoardSelected, isTrailerSelected, isDriverSelected

isDispatchBoardSelected, isTruckSelected, isTrailerSelected, isDriverSelected



TRUCK /////////////////////////////////////////////////////////////

isTruckSelected

isTruckSelected, isTrailerSelected
isTruckSelected, isDriverSelected

isTruckSelected, isTrailerSelected, isDriverSelected



TRUCK /////////////////////////////////////////////////////////////

isTrailerSelected

isTrailerSelected, isDriverSelected



DRIVER /////////////////////////////////////////////////////////////

isDriverSelected







*/
