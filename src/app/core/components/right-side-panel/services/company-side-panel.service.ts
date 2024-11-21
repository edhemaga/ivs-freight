import { Injectable } from '@angular/core';

import {
    CompanyService as CompanyBackendService,
    CompanyResponse,
} from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CompanySidePanelService {
    constructor(private companyService: CompanyBackendService) {}

    public getCompany(): Observable<CompanyResponse> {
        return this.companyService.apiCompanyGet();
    }
}
