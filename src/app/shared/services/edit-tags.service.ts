import { Injectable } from '@angular/core';
import { OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

// services
import { TagService } from '../../../../appcoretruckassist/api/tag.service';

@Injectable({
    providedIn: 'root',
})
export class EditTagsService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(private tagsService: TagService) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public updateTag(tags) {
        return this.tagsService.apiTagPut(tags);
    }
}
