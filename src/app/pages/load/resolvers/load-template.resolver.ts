import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';

// Models
import { LoadTemplateListResponse } from 'appcoretruckassist';

// services
import { LoadService } from '@shared/services/load.service';
 
@Injectable({
    providedIn: 'root',
})
export class LoadTemplateResolver  {
    constructor(
        private loadService: LoadService, 
    ) {}

    resolve(): Observable<LoadTemplateListResponse> {
        return this.loadService.getTemplateData();
    }
}
