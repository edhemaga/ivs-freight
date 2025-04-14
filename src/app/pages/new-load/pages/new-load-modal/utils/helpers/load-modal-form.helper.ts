import { Validators } from '@angular/forms';

export class LoadModalFormHelper {
    static referenceNumberValidators(isTemplate: boolean) {
        return isTemplate
            ? []
            : [
                  Validators.required,
                  Validators.minLength(2),
                  Validators.maxLength(16),
              ];
    }
}
