import { FormBuilder, FormGroup } from '@angular/forms';

export class LoadModalStopsHelper {
    static tabs = [
        {
            id: 1,
            name: 'WORK HOURS',
            checked: true,
        },
        {
            id: 2,
            name: 'APPOINTMENT',
        },
    ];

    static createStop(
        fb: FormBuilder,
        data: { stopType: string; shipperId: number }
    ): FormGroup {
        return fb.group({
            stopType: [data.stopType],
            shipperId: [data.shipperId],
            brokerContactId: [1],
        });
    }
}
