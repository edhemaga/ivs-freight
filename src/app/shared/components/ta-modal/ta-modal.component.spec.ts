/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaModalComponent } from './ta-modal.component';

describe('TaModalComponent', () => {
    let component: TaModalComponent;
    let fixture: ComponentFixture<TaModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
