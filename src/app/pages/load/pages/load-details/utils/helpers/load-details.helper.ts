import { DetailsConfig } from '@shared/models/details-config.model';
import { LoadResponse } from 'appcoretruckassist';

export class LoadDetailsHelper {
    static getLoadDetailsConfig(load: LoadResponse): DetailsConfig[] {
        console.log('load', load);
        return [
            {
                id: 0,
                name: 'Load Detail',
                statusType: load?.statusType?.name,
                template: 'general',
                hasDanger: false,
                data: load,
            },
            {
                id: 1,
                name: 'Stop',
                template: 'stop',
                req: false,
                hide: true,
                data: load,
                hasDanger: false,
                length: load?.stops?.length,
            },
            {
                id: 2,
                name: 'Comment',
                template: 'comment',
                hide: false,
                hasArrow: true,
                data: load,
                hasDanger: false,
                length: load?.comments?.length,
            },
        ];
    }
}
