import { Injectable } from '@angular/core';
import {
    RoadsideInspectionListResponse,
    ViolationService,
    ClusterResponse
} from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { RoadsideInspectionResponse } from '../../../../../../../appcoretruckassist/model/roadsideInspectionResponse';
import { GetRepairShopClustersQuery } from 'appcoretruckassist/model/getRepairShopClustersQuery';

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

    public getRoadsideClusters(
        clustersQuery: GetRepairShopClustersQuery
    ): Observable<Array<ClusterResponse>> {
        return this.roadsideServis.apiViolationClustersGet(
            clustersQuery.northEastLatitude,
            clustersQuery.northEastLongitude,
            clustersQuery.southWestLatitude,
            clustersQuery.southWestLongitude,
            clustersQuery.zoomLevel
        );
    }

    public getRoadsideMapList(
        northEastLatitude?: number,
        northEastLongitude?: number,
        southWestLatitude?: number,
        southWestLongitude?: number,
        active?: boolean,
        categoryReport?: number,
        pageIndex?: number,
        pageSize?: number,
        companyId?: number,
        sort?: string,
        search?: string,
        search1?: string,
        search2?: string
    ) {
        return this.roadsideServis.apiViolationListmapGet(
            northEastLatitude,
            northEastLongitude,
            southWestLatitude,
            southWestLongitude,
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
}
