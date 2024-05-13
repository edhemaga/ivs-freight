/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsItemComponent } from '@pages/driver/pages/driver-details/components/driver-details-item/driver-details-item.component';

describe('DriverDetailsItemComponent', () => {
    let component: DriverDetailsItemComponent;
    let fixture: ComponentFixture<DriverDetailsItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DriverDetailsItemComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DriverDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
