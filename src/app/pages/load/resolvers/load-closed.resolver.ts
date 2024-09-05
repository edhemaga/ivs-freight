import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

// services
import { LoadService } from '@shared/services/load.service';

@Injectable({
    providedIn: 'root',
})
export class LoadClosedResolver {
    constructor(private loadService: LoadService) {}
    resolve(): Observable<any> {
        return this.loadService.getClosedData();
    }
}
