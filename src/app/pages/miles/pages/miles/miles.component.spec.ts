import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilesComponent } from '@pages/miles/pages/miles/miles.component';

describe('MilesComponent', () => {
    let component: MilesComponent;
    let fixture: ComponentFixture<MilesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MilesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MilesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
