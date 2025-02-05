import { Constructor } from '@shared/models/mixin.model';
import { Subject } from 'rxjs';

/**
 * Mixin to add destroy$ and automatic cleanup in ngOnDestroy
 */
export function DestroyableMixin<T extends Constructor>(Base: T) {
    return class extends Base {
        protected destroy$ = new Subject<void>();

        ngOnDestroy(): void {
            this.destroy$.next();
            this.destroy$.complete();
        }
    };
}
