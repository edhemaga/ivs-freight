import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CompanyState, CompanyStore } from './company-settings.store';

@Injectable({ providedIn: 'root' })
export class CompanyQuery extends QueryEntity<CompanyState> {
    constructor(protected companyStore: CompanyStore) {
        super(companyStore);
    }
}
