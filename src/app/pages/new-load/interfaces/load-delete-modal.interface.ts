// Modules
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Interfaces
import { IMappedLoad } from '@pages/new-load/interfaces';

// Models
import { LoadResponse } from 'appcoretruckassist';

export interface ILoadDeleteModal {
    isTemplate: boolean;
    isDetailsPage: boolean;
    loads: IMappedLoad[] | LoadResponse[];
    ngbActiveModal?: NgbActiveModal;
}
