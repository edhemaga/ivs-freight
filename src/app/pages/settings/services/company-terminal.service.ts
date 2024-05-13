import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// core
import { TerminalService } from 'appcoretruckassist';
import { ParkingListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class CompanyTerminalService {
    constructor(private terminalService: TerminalService) {}

    // Get Parking List
    public getTerminalList(
        pageIndex?: number,
        pageSize?: number,
        count?: number
    ): Observable<ParkingListResponse> {
        return this.terminalService.apiTerminalListGet(
            pageIndex,
            pageSize,
            count
        );
    }
}
