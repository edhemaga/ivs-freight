import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { VinDecodeResponse, VinDecodeService } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class VinDecoderService {
    constructor(private vinDecoder: VinDecodeService) {}

    public getVINDecoderData(
        value: string,
        id: number
    ): Observable<VinDecodeResponse> {
        return this.vinDecoder.apiDecodeVinVinTypeGet(value, id);
    }
}
