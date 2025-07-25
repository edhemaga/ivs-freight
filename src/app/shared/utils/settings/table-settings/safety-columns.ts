// ACCIDENTS COLUMN DEFINITION
export function getAccidentColumns() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            hidden: false,
            width: 32,
            filter: '',
            isNumeric: false,
            index: 0,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: true,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
        },
        {
            ngTemplate: 'nameLink',
            title: 'Report',
            field: 'tableReport',
            name: 'Report',
            hidden: false,
            width: 126,
            minWidth: 126,
            filter: '',
            isNumeric: false,
            index: 1,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            link: {
                doesNotHaveRout: true,
                routerLinkStart: '/safety/accident/',
                routerLinkEnd: '/details',
            },
        },
        {
            ngTemplate: 'text',
            title: 'Driver',
            field: 'tableDriverName',
            name: 'Driver',
            hidden: false,
            width: 129,
            minWidth: 129,
            filter: '',
            isNumeric: false,
            index: 2,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'overflow-unset',
        },
        {
            ngTemplate: 'text',
            title: 'Truck',
            field: 'truckNumber',
            name: 'Truck',
            hidden: false,
            width: 78,
            minWidth: 78,
            filter: '',
            isNumeric: false,
            index: 5,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Trailer',
            field: 'trailerNumber',
            name: 'Trailer',
            hidden: false,
            width: 78,
            minWidth: 78,
            filter: '',
            isNumeric: false,
            index: 6,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Date',
            field: 'tableDate',
            name: 'Date',
            hidden: false,
            width: 86,
            minWidth: 86,
            filter: '',
            isNumeric: false,
            index: 3,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Time',
            field: 'tabelTime',
            name: 'Time',
            hidden: false,
            width: 86,
            minWidth: 86,
            filter: '',
            isNumeric: false,
            index: 4,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'textState',
            title: 'ST',
            field: 'tableState',
            name: 'ST',
            hidden: false,
            width: 70,
            minWidth: 70,
            filter: '',
            isNumeric: false,
            index: 8,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'sw-tw-total',
            title: 'wTw',
            field: 'tableSwTw',
            name: 'SwTw',
            hidden: false,
            thSetCenter: true,
            width: 190,
            minWidth: 190,
            filter: '',
            isNumeric: false,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'accident-citation',
            title: 'Oss',
            field: 'tableOss',
            name: 'Oss',
            hidden: false,
            width: 270,
            minWidth: 270,
            filter: '',
            isNumeric: false,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        // ACTIONS
        {
            ngTemplate: 'insurance',
            title: 'Insurance',
            field: '',
            name: '',
            moveRight: true,
            hidden: false,
            width: 40,
            minWidth: 40,
            filter: '',
            isNumeric: false,
            index: 16,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'media',
            title: 'Media',
            field: '',
            name: '',
            moveRight: true,
            hidden: false,
            width: 40,
            minWidth: 40,
            filter: '',
            isNumeric: false,
            index: 16,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'attachments',
            title: 'Attachments',
            field: 'tableAttachments',
            name: '',
            moveRight: true,
            hidden: false,
            width: 46,
            minWidth: 46,
            filter: '',
            isNumeric: false,
            index: 16,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'note',
            title: 'Note',
            field: 'additionalData.note',
            name: '',
            hidden: false,
            width: 26,
            minWidth: 26,
            headIconStyle: {
                width: 14,
                height: 14,
                imgPath: 'assets/svg/truckassist-table/note/Note.svg',
            },
            filter: '',
            isNumeric: false,
            index: 17,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'actions',
            title: 'Actions',
            field: 'action',
            name: '',
            hidden: false,
            width: 26,
            minWidth: 26,
            headIconStyle: {
                width: 22,
                height: 6,
                imgPath: '',
            },
            filter: '',
            isNumeric: false,
            index: 18,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
    ];
}

/* ROADSIDE INSPECTION COLUMN DEFINITION */
export function getRoadsideInspectionColums() {
    return [
        {
            ngTemplate: 'checkbox',
            title: '',
            field: 'select',
            name: 'Select',
            hidden: false,
            width: 32,
            filter: '',
            isNumeric: false,
            index: 0,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: true,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
        },
        {
            ngTemplate: 'nameLink',
            title: 'Report',
            field: 'tableReport',
            name: 'Report',
            hidden: false,
            width: 126,
            minWidth: 126,
            filter: '',
            isNumeric: false,
            index: 1,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            link: {
                doesNotHaveRout: true,
                routerLinkStart: '/safety/violation/',
                routerLinkEnd: '/details',
            },
        },
        {
            ngTemplate: 'text',
            title: 'Driver',
            field: 'tableDriverName',
            name: 'Driver',
            hidden: false,
            width: 129,
            minWidth: 129,
            filter: '',
            isNumeric: false,
            index: 2,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
            class: 'overflow-unset',
        },
        {
            ngTemplate: 'text',
            title: 'Truck',
            field: 'truckNumber',
            name: 'Truck',
            hidden: false,
            width: 78,
            minWidth: 78,
            filter: '',
            isNumeric: false,
            index: 5,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Trailer',
            field: 'trailerNumber',
            name: 'Trailer',
            hidden: false,
            width: 78,
            minWidth: 78,
            filter: '',
            isNumeric: false,
            index: 6,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Date',
            field: 'tableDate',
            name: 'Date',
            hidden: false,
            width: 86,
            minWidth: 86,
            filter: '',
            isNumeric: false,
            index: 3,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'Start',
            field: 'tabelStartTime',
            name: 'Start',
            hidden: false,
            width: 86,
            minWidth: 86,
            filter: '',
            isNumeric: false,
            index: 4,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'End',
            field: 'tabelEndTime',
            name: 'End',
            hidden: false,
            width: 86,
            minWidth: 86,
            filter: '',
            isNumeric: false,
            index: 4,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'text',
            title: 'LVL',
            field: 'tableLvl',
            name: 'LVL',
            hidden: false,
            width: 76,
            minWidth: 76,
            filter: '',
            isNumeric: false,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'textState',
            title: 'ST',
            field: 'tableState',
            name: 'ST',
            hidden: false,
            width: 70,
            minWidth: 70,
            filter: '',
            isNumeric: false,
            index: 8,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'sw-tw-total',
            title: 'wTw',
            field: 'tableSwTw',
            name: 'SwTw',
            hidden: false,
            thSetCenter: true,
            width: 190,
            minWidth: 190,
            filter: '',
            isNumeric: false,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'citation',
            title: 'Oss',
            field: 'tableOss',
            name: 'Oss',
            hidden: false,
            width: 150,
            minWidth: 150,
            filter: '',
            isNumeric: false,
            index: 9,
            sortable: true,
            isActionColumn: false,
            isSelectColumn: false,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: true,
        },
        {
            ngTemplate: 'attachments',
            title: 'Attachments',
            field: 'tableAttachments',
            name: '',
            moveRight: true,
            hidden: false,
            width: 44,
            minWidth: 44,
            filter: '',
            isNumeric: false,
            index: 16,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'note',
            title: 'Note',
            field: 'additionalData.note',
            name: '',
            hidden: false,
            width: 40,
            minWidth: 40,
            filter: '',
            isNumeric: false,
            index: 17,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: true,
            disabled: false,
            export: true,
            resizable: false,
            isAction: true,
        },
        {
            ngTemplate: 'actions',
            title: 'Actions',
            field: 'action',
            name: '',
            hidden: false,
            width: 40,
            minWidth: 40,
            filter: '',
            isNumeric: false,
            index: 18,
            sortable: false,
            isActionColumn: true,
            isSelectColumn: false,
            avatar: null,
            progress: null,
            hoverTemplate: null,
            filterable: false,
            disabled: false,
            export: false,
            resizable: false,
            isAction: true,
        },
    ];
}
