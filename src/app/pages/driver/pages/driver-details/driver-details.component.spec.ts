/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsComponent } from '@pages/driver/pages/driver-details/driver-details.component';

describe('DriverDetailsComponent', () => {
    let component: DriverDetailsComponent;
    let fixture: ComponentFixture<DriverDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DriverDetailsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
