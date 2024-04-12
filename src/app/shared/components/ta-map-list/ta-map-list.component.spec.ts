import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaMapListComponent } from '@shared/components/ta-map-list/ta-map-list.component';

describe('TaMapListComponent', () => {
    let component: TaMapListComponent;
    let fixture: ComponentFixture<TaMapListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaMapListComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaMapListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
