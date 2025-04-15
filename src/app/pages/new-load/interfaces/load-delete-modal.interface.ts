// Interfaces
import { IMappedLoad } from '@pages/new-load/interfaces';

// Models
import { LoadResponse } from 'appcoretruckassist';

export interface ILoadDeleteModal {
    isTemplate: boolean;
    isDetailsPage: boolean;
    loads: IMappedLoad[] | LoadResponse[];
}
