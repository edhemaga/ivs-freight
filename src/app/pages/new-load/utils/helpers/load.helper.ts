// Interfaces
import { ILoadModel } from '@pages/new-load/interfaces';

// Modesl
import { LoadListDto } from 'appcoretruckassist';

export class LoadHelper {
    static loadMapper(loads: LoadListDto[]): ILoadModel[] {
        return [];
    }
}
