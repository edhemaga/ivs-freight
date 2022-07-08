import { Injectable } from '@angular/core';
import { VinDecodeResponse, VinDecodeService } from 'appcoretruckassist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VinDecoderService {
  constructor(private vinDecoder: VinDecodeService) {}

  public getVINDecoderData(value: string): Observable<VinDecodeResponse> {
    return this.vinDecoder.apiDecodeVinGet(value);
  }
}
