/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

describe('TrailerModalComponent', () => {
    let component: TrailerModalComponent;
    let fixture: ComponentFixture<TrailerModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrailerModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrailerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
