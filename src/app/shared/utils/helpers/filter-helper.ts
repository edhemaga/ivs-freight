import { DispatcherFilter } from '@shared/models/filters';
import { DispatcherFilterResponse } from 'appcoretruckassist';

export class FilterHelper {
    static dispatcherFilter(res: DispatcherFilterResponse[]): DispatcherFilter[] {
        return res.map((type: DispatcherFilterResponse) => ({
            name: type?.fullName,
            count: type.loadCount,
            isSelected: false,
            avatar: type.avatar,
            id: type.id
        }));
    }
}
