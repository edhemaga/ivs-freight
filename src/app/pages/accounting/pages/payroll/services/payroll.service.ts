import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayrollCountsResponse } from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: "root"})
export class PayrollService {
    constructor(public http: HttpClient) {}

    public getPayrollCounts(
        showOpen: boolean
    ): Observable<PayrollCountsResponse> {
        return this.http.get(
            `${environment.API_ENDPOINT}/api/payroll/counts?ShowOpen=${showOpen}`
        );
    }
}
