import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdlCardComponent } from './cdl-card.component';

describe('CdlCardComponent', () => {
    let component: CdlCardComponent;
    let fixture: ComponentFixture<CdlCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CdlCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CdlCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
