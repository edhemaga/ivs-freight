import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadModalWaitTimeComponent } from '@pages/load/pages/load-modal/components/load-modal-wait-time/load-modal-wait-time.component';

describe('LoadModalWaitTimeComponent', () => {
    let component: LoadModalWaitTimeComponent;
    let fixture: ComponentFixture<LoadModalWaitTimeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadModalWaitTimeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadModalWaitTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
