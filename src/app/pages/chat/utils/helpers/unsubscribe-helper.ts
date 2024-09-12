import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export abstract class UnsubscribeHelper implements OnDestroy {

    public unsubscribe$: Subject<void> = new Subject<void>();

    completeSubject = (): void => {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnDestroy(): void {
        this.completeSubject();
    }

}