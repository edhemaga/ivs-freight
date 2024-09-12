import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export abstract class UnsubscribeHelper implements OnDestroy {

    public destroy$: Subject<void> = new Subject<void>();

    completeSubject = (): void => {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnDestroy(): void {
        this.completeSubject();
    }

}