/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BankVerificationService } from './bankVerification.service';

describe('Service: BankVerification', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BankVerificationService],
        });
    });

    it('should ...', inject(
        [BankVerificationService],
        (service: BankVerificationService) => {
            expect(service).toBeTruthy();
        }
    ));
});
