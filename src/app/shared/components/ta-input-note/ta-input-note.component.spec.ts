/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaInputNoteComponent } from './ta-input-note.component';

describe('TaInputNoteComponent', () => {
    let component: TaInputNoteComponent;
    let fixture: ComponentFixture<TaInputNoteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaInputNoteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaInputNoteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
