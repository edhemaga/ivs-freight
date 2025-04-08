// appcoretruckassist
import {
    BrokerByIdResponse,
    CommentResponse,
    DispatcherFilterResponse,
    LoadListDto,
    LoadListResponse,
    LoadMinimalListResponse,
    LoadModalResponse,
    LoadPossibleStatusesResponse,
    LoadResponse,
    LoadStatus,
    LoadStatusResponse,
    LoadTemplateResponse,
    RoutingResponse,
    ShipperLoadModalResponse,
    TableType,
} from 'appcoretruckassist';

// models
import {
    ICreateCommentMetadata,
    ILoadGridItem,
    ILoadState,
    ILoadTemplateGridItem,
} from '@pages/load/pages/load-table/models/index';
import { ITableColummn } from '@shared/models';
import { IActiveLoadModalData } from '@pages/load/models';
import { BrokerContactExtended } from '@pages/customer/pages/broker-modal/models';

// enums
import { eLoadStatusType } from '@pages/load/pages/load-table/enums/index';
import { eDateTimeFormat, eSortDirection } from '@shared/enums';

// helpers
import { FilterHelper, UserHelper } from '@shared/utils/helpers';
import { LoadStoreHelper } from '@pages/load/pages/load-table/utils/helpers';
import moment from 'moment';
import { eStringPlaceholder } from 'ca-components';

export const getLoadsOrTemplatesPayloadSuccessResult = function (
    state: ILoadState,
    data: ILoadGridItem[] | ILoadTemplateGridItem[],
    templateCount: number,
    pendingCount: number,
    activeCount: number,
    closedCount: number,
    selectedTab: eLoadStatusType,
    showMore?: boolean
): ILoadState {
    const { data: stateData } = state || {};
    const _data: ILoadGridItem[] | ILoadTemplateGridItem[] = showMore
        ? [...stateData, ...data]
        : [...data];

    const result: ILoadState = {
        ...state,
        data: _data,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
        selectedTab,
        selectLoadCount: 0,
        selectLoadRateSum: 0,
        totalLoadSum: LoadStoreHelper.calculateSelectedLoadsSum(_data, true),
        hasAllLoadsSelected: false,
    };

    return result;
};

export const getLoadByIdSuccessResult = function (
    state: ILoadState,
    load: LoadListDto
): ILoadState {
    const { data } = state || {};

    const result: ILoadState = {
        ...state,
        data: [...data, <ILoadGridItem>load],
    };

    return result;
};

export const createLoadSuccessResult = function (
    state: ILoadState,
    load: LoadResponse
): ILoadState {
    const { data, selectedTab, pendingCount } = state || {};

    const result: ILoadState = {
        ...state,
        data:
            selectedTab === eLoadStatusType.Pending
                ? [...data, <ILoadGridItem>load]
                : data,
        pendingCount: pendingCount + 1,
    };

    return result;
};

export const createLoadTemplateSuccessResult = function (
    state: ILoadState,
    loadTemplate: LoadTemplateResponse
): ILoadState {
    const { data, selectedTab, templateCount } = state || {};

    const result: ILoadState = {
        ...state,
        data:
            selectedTab === eLoadStatusType.Template
                ? [...data, <ILoadTemplateGridItem>loadTemplate]
                : data,
        templateCount: templateCount + 1,
    };

    return result;
};

export const createCommentSuccessResult = function (
    state: ILoadState
): ILoadState {
    const details = state?.details;

    const dateNow = moment().format(eDateTimeFormat.MM_DD_YY);
    const { avatarFile, firstName, lastName, companyUserId } =
        UserHelper.getUserFromLocalStorage();

    const commentMetadata: CommentResponse = {
        commentContent: eStringPlaceholder.EMPTY,
        createdAt: dateNow,
        companyUser: {
            avatarFile,
            fullName: `${firstName} ${lastName}`,
            id: companyUserId,
        },
    };

    const comments = [
        {
            ...commentMetadata,
        },
        ...details.comments,
    ];

    return {
        ...state,
        details: {
            ...details,
            comments,
            commentsCount: comments.length,
        },
    };
};

export const updateLoadAndTemplateSuccessResult = function (
    state: ILoadState,
    load: LoadListDto | LoadTemplateResponse
): ILoadState {
    const { data } = state || {};
    const { id } = load || {};
    let _data: ILoadGridItem[] | ILoadTemplateGridItem[] = JSON.parse(
        JSON.stringify(data)
    );
    const exist: boolean = data.some((_) => _.id === id);

    if (exist) {
        const updatingIndex = data.findIndex((_) => _.id === id);
        const updatingItem: ILoadGridItem | ILoadTemplateGridItem =
            initializeLoadGridItem(load);

        _data.splice(updatingIndex, 1, updatingItem);
    }

    const result: ILoadState = {
        ...state,
        data: _data,
    };

    return result;
};

export const updateLoadAndUpdateOrRevertStatusSuccessResult = function (
    state: ILoadState,
    response: LoadListResponse,
    status: LoadStatusResponse
): ILoadState {
    const {
        pagination,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
    } = response || {};
    const { data } = pagination || {};
    const { id } = data[0] || {};
    let _state = updateLoadStatusSuccessResult(state, id, status);

    _state.templateCount = templateCount;
    _state.pendingCount = pendingCount;
    _state.activeCount = activeCount;
    _state.closedCount = closedCount;

    return updateLoadAndTemplateSuccessResult(_state, data[0]);
};

export const deleteLoadByIdSuccessResult = function (
    state: ILoadState,
    loadId: number
): ILoadState {
    const {
        data,
        selectedTab,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
    } = state || {};
    const updatedData = (<ILoadGridItem[]>data).filter((_) => _.id !== loadId);
    const _templateCount =
        selectedTab === eLoadStatusType.Template
            ? templateCount - 1
            : templateCount;
    const _pendingCount =
        selectedTab === eLoadStatusType.Pending
            ? pendingCount - 1
            : pendingCount;
    const _activeCount =
        selectedTab === eLoadStatusType.Active ? activeCount - 1 : activeCount;
    const _closedCount =
        selectedTab === eLoadStatusType.Closed ? closedCount - 1 : closedCount;

    const result: ILoadState = {
        ...state,
        data: updatedData,
        templateCount: _templateCount,
        pendingCount: _pendingCount,
        activeCount: _activeCount,
        closedCount: _closedCount,
    };

    return result;
};

export const deleteBulkLoadSuccessResult = function (
    state: ILoadState,
    ids: number[]
): ILoadState {
    const { data, selectedTab, pendingCount, activeCount, closedCount } =
        state || {};
    const result: ILoadState = {
        ...state,
        data: (<ILoadGridItem[]>data).filter((_) => !ids.includes(_.id)),
        pendingCount:
            selectedTab === eLoadStatusType.Pending
                ? pendingCount - ids?.length
                : pendingCount,
        activeCount:
            selectedTab === eLoadStatusType.Active
                ? activeCount - ids?.length
                : activeCount,
        closedCount:
            selectedTab === eLoadStatusType.Closed
                ? closedCount - ids?.length
                : closedCount,
    };

    return result;
};

export const saveNoteResult = function (
    state: ILoadState,
    entityId: number,
    value: string
): ILoadState {
    const { data } = state || {};
    const updatingEntityIndex = data.findIndex((_) => _.id === entityId);
    const updatingEntity = (<ILoadGridItem[]>data).find(
        (_) => _.id === entityId
    );
    const updateEntity: ILoadGridItem | ILoadTemplateGridItem = {
        ...updatingEntity,
        note: value,
    };
    let _data = [...data];
    _data.splice(updatingEntityIndex, 1, updateEntity);

    const result: ILoadState = {
        ...state,
        data: _data,
    };

    return result;
};

export const selectedDataRowsChangeResult = function (
    state: ILoadState,
    canDeleteSelectedDataRows: boolean,
    ids: number[]
): ILoadState {
    const { data } = state || {};
    let _data = JSON.parse(JSON.stringify(data));

    _data.map((row) => {
        const { id } = row;
        if (ids.includes(id)) row.isSelected = true;
        else row.isSelected = false;

        return row;
    });

    const result: ILoadState = {
        ...state,
        canDeleteSelectedDataRows,
        data: _data,
    };

    return result;
};

export const updateLoadStatusSuccessResult = function (
    state: ILoadState,
    loadId: number,
    status: LoadStatusResponse
): ILoadState {
    const { data, selectedTab } = state || {};
    const { statusString } = status || {};
    let _data: ILoadGridItem[] = JSON.parse(JSON.stringify(data));

    if (
        (selectedTab === eLoadStatusType.Pending &&
            (statusString === LoadStatus.Dispatched ||
                statusString === LoadStatus.Canceled)) ||
        (selectedTab === eLoadStatusType.Active &&
            (statusString === LoadStatus.Assigned ||
                statusString === LoadStatus.Delivered ||
                statusString === LoadStatus.Canceled ||
                statusString === LoadStatus.LoadCanceled)) ||
        (selectedTab === eLoadStatusType.Closed &&
            (statusString === LoadStatus.Unassigned ||
                statusString === LoadStatus.Assigned ||
                statusString === LoadStatus.ArrivedPickup ||
                statusString === LoadStatus.ArrivedDelivery ||
                statusString === LoadStatus.CheckedIn ||
                statusString === LoadStatus.CheckedInPickup ||
                statusString === LoadStatus.CheckedInDelivery ||
                statusString === LoadStatus.Offloading ||
                statusString === LoadStatus.Loading ||
                statusString === LoadStatus.Loaded))
    ) {
        _data = _data.filter((_) => _.id !== loadId);
    } else {
        let loadUpdated: ILoadGridItem = (<ILoadGridItem[]>_data).find(
            (_) => _.id === loadId
        );

        loadUpdated.status = status;
    }

    const result: ILoadState = {
        ...state,
        data: _data,
    };

    return result;
};

export const initializeLoadGridItems = function (data) {
    return data.map((item) => ({
        ...item,
        isSelected: false,
    }));
};

export const initializeLoadGridItem = function (
    item: LoadResponse | LoadTemplateResponse
): ILoadGridItem | ILoadTemplateGridItem {
    return {
        ...item,
        isSelected: false,
    };
};

export const getLoadModalDataSuccessResult = function (
    state: ILoadState,
    modal: LoadModalResponse,
    activeModalData?: IActiveLoadModalData,
    activeModalPossibleStatuses?: LoadPossibleStatusesResponse
): ILoadState {
    const result: ILoadState = {
        ...state,
        modal,
        activeModalData,
        activeModalPossibleStatuses,
    };

    return result;
};

export const sortLoadComments = (
    state: ILoadState,
    loadId: number,
    sortDirection: eSortDirection
): ILoadState => {
    const details: LoadResponse = state?.details;

    if (!details?.comments?.length) return { ...state };

    const dateFormat = eDateTimeFormat.YYYY_MM_DD_HH_MM_SS;

    let comments: CommentResponse[] = [...details.comments];

    comments?.sort((a, b) => {
        if (!a?.createdAt || !b?.createdAt) return;
        const dateA = moment(a?.createdAt, dateFormat).valueOf();
        const dateB = moment(b?.createdAt, dateFormat).valueOf();
        if (sortDirection === eSortDirection.ASC) return dateA - dateB;
        else return dateB - dateA;
    });

    const modifiedState: ILoadState = {
        ...state,
        details: {
            ...details,
            comments,
        },
    };

    return modifiedState;
};

export const deleteCommentByIdSuccessResult = function (
    state: ILoadState,
    commentId: number
): ILoadState {
    const details: LoadResponse = state?.details;

    if (!details?.comments?.length) return { ...state };

    const comments = details.comments?.filter(
        (comment) => comment.id !== commentId
    );

    const result: ILoadState = {
        ...state,
        details: {
            ...details,
            comments,
            commentsCount: details.commentsCount - 1,
        },
    };

    return result;
};

export const updateCommentSuccessResult = (
    state: ILoadState,
    commentId: number,
    content: string
) => {
    const details: LoadResponse = state?.details;
    console.log(details);

    if (!details?.comments?.length) return { ...state };

    const comments: CommentResponse[] = [...details.comments];

    let commentFoundIndex: number = 0;

    const commentFound: CommentResponse = comments?.find(
        (comment: CommentResponse, index: number) => {
            if (comment.id === commentId) {
                commentFoundIndex = index;
                return comment;
            }
        }
    );

    if (!commentFound || commentFoundIndex < 0)
        return {
            ...state,
        };

    comments[commentFoundIndex] = {
        ...commentFound,
        commentContent: content,
    };

    return {
        ...state,
        details: {
            ...details,
            comments,
        },
    };
};

export const updateLoadStatusSignalRSuccess = function (
    state: ILoadState,
    response: LoadListResponse
): ILoadState {
    const {
        pagination,
        templateCount,
        pendingCount,
        activeCount,
        closedCount,
    } = response || {};
    const { data: responseData } = pagination || {};
    const { id, status } = responseData[0] || {};
    const { data } = state || {};
    const existOnPage: boolean = data.some((_) => _.id === id);
    let result: ILoadState;

    if (existOnPage) result = updateLoadStatusSuccessResult(state, id, status);
    else
        result = {
            ...state,
            data: [...data, ...responseData], // responseData will always contain single element,
            templateCount,
            pendingCount,
            activeCount,
            closedCount,
        };

    return result;
};

export const tableColumnResizeResult = function (
    state: ILoadState,
    columns: ITableColummn[],
    width: number,
    index: number
): ILoadState {
    let _columns: ITableColummn[] = JSON.parse(
        localStorage.getItem(`table-${TableType.LoadRegular}-Configuration`)
    );

    _columns = _columns.map((column) => {
        if (column.title === columns[index].title) {
            column.width = width;
        }

        return column;
    });

    localStorage.setItem(
        `table-${TableType.LoadRegular}-Configuration`,
        JSON.stringify(_columns)
    );

    const result: ILoadState = {
        ...state,
    };

    return result;
};

export function mapDispatcherSuccessResult(
    state: ILoadState,
    dispatcherList: DispatcherFilterResponse[]
): ILoadState {
    const result: ILoadState = {
        ...state,
        dispatcherList: FilterHelper.dispatcherFilter(dispatcherList),
    };

    return result;
}
export const addCreatedBrokerStaticModalDataResult = function (
    state: ILoadState,
    broker: BrokerByIdResponse
): ILoadState {
    const { modal, activeModalData } = state;
    let _modal: LoadModalResponse = JSON.parse(JSON.stringify(modal));
    let _activeModalData = JSON.parse(JSON.stringify(activeModalData));

    if (!!broker) {
        _modal.brokers = [broker, ...modal.brokers];

        if (!!activeModalData) {
            _activeModalData.broker = broker;
            _activeModalData.brokerId = broker.id;
        }
    }

    const result: ILoadState = {
        ...state,
        modal: _modal,
        activeModalData: _activeModalData,
    };

    return result;
};

export function mapStatusFilterSuccessResult(
    state: ILoadState,
    statusList: any[]
): ILoadState {
    // backend time is not good?
    const result: ILoadState = {
        ...state,
        statusList,
    };

    return result;
}

export const addCreatedShipperStaticModalDataResult = function (
    state: ILoadState,
    shipper: ShipperLoadModalResponse
): ILoadState {
    const { modal, activeModalData } = state;
    let _modal: LoadModalResponse = JSON.parse(JSON.stringify(modal));
    let _activeModalData = JSON.parse(JSON.stringify(activeModalData));

    if (!!shipper) {
        _modal.shippers = [shipper, ...modal.shippers];

        if (!!activeModalData) {
            _activeModalData.shipper = shipper;
            _activeModalData.shipperId = shipper.id;
        }
    }

    const result: ILoadState = {
        ...state,
        modal: _modal,
        activeModalData: _activeModalData,
    };

    return result;
};

export const updateEditedBrokerStaticModalDataResult = function (
    state: ILoadState,
    broker: BrokerByIdResponse,
    brokerContacts?: BrokerContactExtended[]
): ILoadState {
    const { modal, activeModalData } = state;
    let _modal: LoadModalResponse = JSON.parse(JSON.stringify(modal));
    let _activeModalData: IActiveLoadModalData = JSON.parse(
        JSON.stringify(activeModalData)
    );

    if (!!broker) {
        const index: number = _modal.brokers.findIndex(
            (item) => item.id === broker.id
        );
        _modal.brokers.splice(index, 1, broker);

        if (!!_activeModalData) {
            _activeModalData.broker = broker;
            _activeModalData.brokerId = broker.id;
        }
    }

    if (!!brokerContacts) {
        //TODO: waiting for backend to provide created brokerContact ids
    }

    const result: ILoadState = {
        ...state,
        modal: _modal,
    };

    return result;
};

export const getLoadDetails = function (
    state: ILoadState,
    details: LoadResponse
): ILoadState {
    return {
        ...state,
        details,
        isLoadDetailsLoaded: true,
    };
};

export const getLoadDetailsMapRoutes = function (
    state: ILoadState,
    mapRoutes: RoutingResponse
): ILoadState {
    return { ...state, mapRoutes, isLoadDetailsLoaded: true };
};

export function updateAllLoadsSelectStatus(state: ILoadState): ILoadState {
    const hasAllLoadsSelected = !state.hasAllLoadsSelected;
    const { data } = state;

    const loads = data.map(
        (load: ILoadGridItem[] | ILoadTemplateGridItem[]) => ({
            ...load,
            isSelected: hasAllLoadsSelected,
        })
    );

    return {
        ...state,
        hasAllLoadsSelected,
        selectLoadCount: hasAllLoadsSelected ? data.length : 0,
        selectLoadRateSum: LoadStoreHelper.calculateSelectedLoadsSum(
            loads,
            false
        ),
        data: loads,
    };
}

export function updateLoadSelectedStatus(
    state: ILoadState,
    load: ILoadGridItem | ILoadTemplateGridItem
) {
    const { data } = state;

    const loads = data.map((row: ILoadGridItem | ILoadTemplateGridItem) => {
        return {
            ...row,
            // Toggle current state
            isSelected: row.id === load.id ? !row.isSelected : row.isSelected,
        };
    });

    const selectedCount = loads.filter((loads) => loads.isSelected).length;

    return {
        ...state,
        data: loads,
        selectLoadCount: selectedCount,
        selectLoadRateSum: LoadStoreHelper.calculateSelectedLoadsSum(
            loads,
            false
        ),
        hasAllLoadsSelected: selectedCount === loads.length,
    };
}

export function setMinimalList(
    state: ILoadState,
    minimalList: LoadMinimalListResponse
): ILoadState {
    return {
        ...state,
        minimalList,
    };
}
