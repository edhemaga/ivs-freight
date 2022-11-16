import { Injectable } from '@angular/core';
import {
    RoadsideInspectionListResponse,
    ViolationService,
} from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { UpdateRoadsideInspectionCommand } from '../../../../../../../appcoretruckassist/model/updateRoadsideInspectionCommand';
import { RoadsideInspectionResponse } from '../../../../../../../appcoretruckassist/model/roadsideInspectionResponse';

@Injectable({
    providedIn: 'root',
})
export class RoadsideService {
    constructor(private roadsideServis: ViolationService) {}

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
            categoryReport,
            pageIndex,
            pageSize,
            companyId,
            sort,
            search,
            search1,
            search2
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
    public updateRoadside(
        data: any /*UpdateRoadsideInspectionCommand*/
    ): Observable<any> {
        return this.roadsideServis.apiViolationPut(data);
    }

    public getRoadsideById(id: number): Observable<RoadsideInspectionResponse> {
        return this.roadsideServis.apiViolationIdGet(id);
    }

    public deleteRoadsideById(id: number): Observable<any> {
        return this.roadsideServis.apiViolationIdDelete(id);
    }
}
