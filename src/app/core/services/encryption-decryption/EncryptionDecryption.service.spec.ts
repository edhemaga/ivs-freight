/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EncryptionDecryptionService } from './EncryptionDecryption.service';

describe('Service: EncryptionDecryption', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncryptionDecryptionService]
    });
  });

  it('should ...', inject([EncryptionDecryptionService], (service: EncryptionDecryptionService) => {
    expect(service).toBeTruthy();
  }));
});
