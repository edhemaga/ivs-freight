import {
    DispatcherFilterResponse,
    LoadStatusFilterResponse,
} from 'appcoretruckassist';

export interface ILoadPageFilters {
    dispatcherFilters: DispatcherFilterResponse[];
    statusFilters: LoadStatusFilterResponse[];
}
