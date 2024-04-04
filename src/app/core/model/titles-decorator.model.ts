import { OnChanges } from '@angular/core';

export interface TFunction {
    new (...args: any[]): BodyClassRequireOnInitAndOnDestroy;
}

interface BodyClassRequireOnInitAndOnDestroy extends OnChanges {}
