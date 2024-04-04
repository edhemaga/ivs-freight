import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// services
import { FormDataService } from 'src/app/shared/services/form-data.service';

// models
import {
    RoadsideInspectionListResponse,
    ViolationService,
    RoadsideInspectionResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class RoadsideService {
    constructor(
        private roadsideServis: ViolationService,
        private formDataService: FormDataService
    ) {}

    // Get Roadside List
    public getRoadsideList(
        active?: boolean,
        categoryReport?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<RoadsideInspectionListResponse> {
        return this.roadsideServis.apiViolationListGet(
            active,
            categoryReport
            // pageIndex,
            // pageSize,
            // companyId,
            // sort,
            // search,
            // search1,
            // search2
        );
    }

    // Get Roadside Minimal List
    public getRoadsideMinimalList(
        pageIndex?: number,
        pageSize?: number
    ): Observable<any> {
        return this.roadsideServis.apiViolationListMinimalGet(
            pageIndex,
            pageSize
        );
    }
    public updateRoadside(data: any): Observable<any> {
        this.formDataService.extractFormDataFromFunction(data);
        return this.roadsideServis.apiViolationPut();
    }

    public getRoadsideById(id: number): Observable<RoadsideInspectionResponse> {
        return this.roadsideServis.apiViolationIdGet(id);
    }

    public deleteRoadsideById(id: number): Observable<any> {
        return this.roadsideServis.apiViolationIdDelete(id);
    }
}
