import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    CompanyRepairShopState,
    CompanyRepairShopStore,
} from './company-repairshop.store';

@Injectable({ providedIn: 'root' })
export class CompanyRepairShopQuery extends QueryEntity<CompanyRepairShopState> {
    constructor(protected companyRepairShopStore: CompanyRepairShopStore) {
        super(companyRepairShopStore);
    }
}
