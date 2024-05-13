/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMvrModalComponent } from '@pages/driver/pages/driver-modals/driver-mvr-modal/driver-mvr-modal.component';

describe('DriverMvrModalComponent', () => {
    let component: DriverMvrModalComponent;
    let fixture: ComponentFixture<DriverMvrModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DriverMvrModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverMvrModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
