import { HttpClient } from '@angular/common/http';
import { PayrollCountsResponse } from 'appcoretruckassist';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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
