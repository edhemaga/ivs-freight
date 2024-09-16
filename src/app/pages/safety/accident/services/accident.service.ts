import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// models
import {
    AccidentListResponse,
    AccidentResponse,
    AccidentService as AccidentTService,
    CreateResponse,
    AccidentModalResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class AccidentService {
    constructor(private accidentService: AccidentTService) {}

    // Get Accident List
    public getAccidentList(
        active?: boolean,
        reported?: boolean,
        dateFrom?: string,
        dateTo?: string,
        _long?: number,
        lat?: number,
        distance?: number,
        driverIds?: Array<number>,
        truckIds?: Array<number>,
        trailerIds?: Array<number>,
        injury?: number,
        fatality?: number,
        towing?: boolean,
        hazMat?: boolean,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ): Observable<AccidentListResponse> {
        return this.accidentService.apiAccidentListGet(
            active,
            reported,
            dateFrom,
            dateTo,
            _long,
            lat,
            distance,
            driverIds,
            truckIds,
            trailerIds,
            injury,
            fatality,
            towing,
            hazMat,
            pageIndex,
            pageSize,
            companyId,
            sort,
            null,
            null,
            search,
            search1,
            search2
        );
    }

    public addAccident(data: any): Observable<CreateResponse> {
        return this.accidentService.apiAccidentPost(data);
    }

    public updateAccident(data: any): Observable<any> {
        return this.accidentService.apiAccidentPut(data);
    }

    public getAccidentById(id: number): Observable<AccidentResponse> {
        return this.accidentService.apiAccidentIdGet(id);
    }

    public getModalDropdowns(): Observable<AccidentModalResponse> {
        return this.accidentService.apiAccidentModalGet();
    }
}
