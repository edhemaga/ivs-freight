import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import moment from 'moment';

//animations
import { animate, style, transition, trigger } from '@angular/animations';

//services
import { NoteUpdateService } from 'src/app/core/services/shared/note.service';
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import { SharedService } from '../../../services/shared/shared.service';

//popover
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

//pipes
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

//modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// helpers
import { PasteHelper } from 'src/app/core/helpers/copy-paste.helper';

//components
import { TaNoteContainerComponent } from './ta-note-container/ta-note-container.component';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaSpinnerComponent } from '../ta-spinner/ta-spinner.component';

//models
import { activeOptions } from './models/note-models';
import { EntityTypeNote } from 'appcoretruckassist/model/entityTypeNote';

@Component({
    selector: 'app-ta-note',
    templateUrl: './ta-note.component.html',
    styleUrls: ['./ta-note.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        NgbModule,
        AngularSvgIconModule,

        // Component
        AppTooltipComponent,
        TaSpinnerComponent,
        TaNoteContainerComponent,

        // Pipe
        SafeHtmlPipe,
    ],
    animations: [
        trigger('pickupAnimation', [
            transition(':enter', [
                style({ height: 10 }),
                animate('100ms', style({ height: '*' })),
            ]),
            transition(':leave', [animate('50ms', style({ height: 0 }))]),
        ]),
        trigger('noteLongAnimation', [
            transition(':enter', [
                style({ width: 10 }),
                animate('100ms', style({ width: '*' })),
            ]),
            transition(':leave', [animate('300ms', style({ width: 0 }))]),
        ]),
    ],
})
export class TaNoteComponent implements OnInit, OnDestroy {
    @Output() saveNoteValue = new EventEmitter();

    public _note: string;
    @Input() set note(value: string) {
        this._note = value;
        this.value = value;
        this.checkNoteImage(value);
    }
    @Input() mainData: any;
    @Input() parking: boolean = false;
    @Input() dispatchIndex: number = -1;
    @Input() type: string;
    @Input() parentWidth: string;

    @Input() openedAll: boolean;
    @Input() entityId: number = 0;
    @Input() entityType: string;
    @Input() isDispatch: boolean = false;

    @ViewChild('main_editor') public main_editor: ElementRef;
    @ViewChild('note_popover') public note_popover: ElementRef;
    @ViewChild('noteContainer') public noteContainer: TaNoteContainerComponent;

    public _noteWidth: number = 250;
    public _parentWidth: number = 250;

    @Input() set noteWidth(value: number) {
        this._noteWidth = value;
    }

    //note container
    public showCollorPattern: boolean;
    public buttonsExpanded = false;
    public activeOptions: activeOptions;
    public selectedPaternColor: string = '#6C6C6C';

    //properties and values

    public isExpanded: boolean = false;
    public noteOpened: boolean = false;
    public value: string = '';
    private lastTypeTime: number;
    public noteIcon: string = 'Note - Empty.svg';
    public leaveThisOpened: boolean;
    public selectionTaken: Selection;
    public range: Range;
    public isFocused: boolean = false;
    private preventClosing: boolean = false;

    //saving
    public savingNote: boolean = false;
    private saveInterval: any;
    private saveIntervalStarted: boolean = false;
    public savedValue: string = '';

    private destroy$ = new Subject<void>();

    constructor(
        private sharedService: SharedService,
        private ref: ChangeDetectorRef,
        private noteService: NoteUpdateService,
        private DetailsDataService: DetailsDataService,
        private elRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.checkNoteImage(this._note);
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: Event) {
        if (this.isDispatch) {
            this.setNoteParentWidth();
        }
    }

    ngAfterViewInit(): void {
        this.value = this._note;
        this.setNoteParentWidth();

        this.correctEntityType();
    }

    private setNoteParentWidth(): void {
        if (this.parentWidth) {
            setTimeout(() => {
                const parentWidth = this.elRef.nativeElement
                    .closest(this.parentWidth)
                    .getBoundingClientRect();
                this._parentWidth = this.isDispatch
                    ? parentWidth.width - 2
                    : parentWidth.width;
                this.ref.detectChanges();
            }, 1000);
        }
    }

    public checkFocus(event: Event): void {
        event.stopPropagation();
        event.preventDefault();

        this.isFocused = true;
        this.leaveThisOpened = true;
        this.sharedService.emitAllNoteOpened.next(false);
        this.isExpanded = true;
        setTimeout(() => {
            this.buttonsExpanded = true;
            this.checkActiveItems();
        }, 150);
    }

    public toggleNote(data: string, t2: NgbPopover): void {
        if (this.mainData) {
            this.DetailsDataService.setNewData(this.mainData);
        }
        this.preventClosing = true;
        setTimeout(() => {
            this.preventClosing = false;
        }, 200);

        if (t2?.isOpen()) {
            if (this.openedAll) {
                this.leaveThisOpened = true;
                this.sharedService.emitAllNoteOpened.next(false);
            } else if (!this.isExpanded) {
                this.leaveThisOpened = false;
                this.checkActiveItems();
                this.isExpanded = true;
                this.buttonsExpanded = true;
                setTimeout(() => {
                    t2.open();
                }, 1);
            } else {
                this.isExpanded = false;
                this.buttonsExpanded = false;
                this.leaveThisOpened = false;
                this.noteOpened = false;
                this._note = this.value;
                t2.close();
            }
            this.showCollorPattern = false;
        } else {
            if (!data || data == '' || this.openedAll) {
                this.buttonsExpanded = true;
                this.isExpanded = true;
            }
            this.leaveThisOpened = true;
            this.sharedService.emitAllNoteOpened.next(false);
            setTimeout(() => {
                this.noteOpened = true;
            }, 1);

            t2.open();
        }
    }

    public prepareForTextRange(): void {
        this.isFocused = false;
        this.selectionTaken = window.getSelection();
        if (this.selectionTaken.rangeCount && this.selectionTaken.getRangeAt) {
            this.range = this.selectionTaken.getRangeAt(0);
            this.selectionTaken.removeAllRanges();
            this.selectionTaken.addRange(this.range);
        }
    }

    public preventMouseDown(ev: Event): void {
        ev.stopPropagation();
        ev.preventDefault();
    }

    public valueChange(event: string): void {
        this.value = event;
        this.checkActiveItems();
        this.lastTypeTime = moment().unix();
        if (!this.saveIntervalStarted) {
            this.saveIntervalStarted = true;
            this.saveInterval = setInterval(() => {
                if (moment().unix() - this.lastTypeTime >= 2) {
                    this.saveIntervalStarted = false;
                    clearInterval(this.saveInterval);
                    this.saveNote(true);
                }
            }, 100);
        }
    }

    private checkActiveItems(): void {
        if (this.noteContainer && this.noteContainer?.checkActiveItems) {
            this.noteContainer?.checkActiveItems();
        }
    }

    public saveNote(autoSave?: boolean): void {
        setTimeout(() => {
            if (!autoSave && this.openedAll) {
                this.closeNote();
            }
        }, 200);
        if (this.value == '<br>') {
            this.value = this.value.replace('<br>', '');
        }

        this.savedValue = this.value;
        if (this.entityId && this.entityType) {
            this.savingNote = true;
            this.ref.detectChanges();
            setTimeout(() => {
                this.savingNote = false;
                this.ref.detectChanges();
            }, 700);
            this.updateNote();
        }
        if (this.dispatchIndex == -1) this.saveNoteValue.emit(this.value);
        else
            this.saveNoteValue.emit({
                note: this.value,
                dispatchIndex: this.dispatchIndex,
            });
    }

    private closeNote(): void {
        this.noteOpened = false;
        this.leaveThisOpened = false;
        this.showCollorPattern = false;
        this.isExpanded = false;
        this.buttonsExpanded = false;
        this._note = this.value;
    }

    public maxLimitForContenteditableDiv(
        event: KeyboardEvent,
        limit: number
    ): void {
        let allowedKeys = false;

        if (event.type === 'keydown') {
            allowedKeys =
                event.key === 'Backspace' ||
                event.key === 'End' ||
                event.key === 'Home' ||
                event.key === 'ArrowLeft' ||
                event.key === 'ArrowUp' ||
                event.key === 'ArrowRight' ||
                event.key === 'ArrowDown' ||
                event.key === 'Delete' ||
                (event.ctrlKey === true && event.key === 'a') ||
                (event.ctrlKey === true && event.key === 'x') ||
                (event.ctrlKey === true && event.key === 'c') ||
                (event.ctrlKey === true && event.key === 'v') ||
                (event.ctrlKey === true && event.key === 'z');
        }
        if (event.ctrlKey === true && event.key === 'v') {
            setTimeout(() => {
                $(event.target).text($(event.target).text().slice(0, limit));
            });
        }
        if (!allowedKeys && $(event.target).text().length >= limit) {
            event.preventDefault();
        }
    }

    public expandAllNotes(): void {
        if (!this.isExpanded) {
            setTimeout(() => {
                if (this.openedAll) {
                    this.isExpanded = true;
                }
            });
        }
    }

    public popoverClosed(): void {
        if (!this.preventClosing) {
            this.closeNote();
        }

        this.preventClosing = false;
    }

    private updateNote(): void {
        if (this.entityType == 'Account') {
            this.entityType = 'CompanyAccount';
        }

        if (this.entityType == 'Contact') {
            this.entityType = 'CompanyContact';
        }

        this.entityType =
            this.entityType.charAt(0).toUpperCase() + this.entityType.slice(1);

        const updateValue = {
            entityTypeNote: EntityTypeNote[this.entityType],
            entityId: this.entityId,
            note: this.value,
        };

        this.noteService.updateNote(updateValue).subscribe(() => {
            this.checkNoteImage(this.value);
            this.ref.detectChanges();
        });
    }

    private checkNoteImage(note: string): void {
        if (note && note != '') {
            this.noteIcon = 'Note.svg';
        } else {
            this.noteIcon = 'Note - Empty.svg';
        }
    }

    private correctEntityType(): void {
        if (this.entityType == 'User') {
            this.entityType = 'CompanyUser';
        }
        if (this.entityType == 'Customer') {
            this.entityType = 'Broker';
        }
    }

    public onPaste(event: ClipboardEvent): void {
        PasteHelper.onPaste(event);
    }

    public ngOnDestroy(): void {
        this.leaveThisOpened = false;
        this.showCollorPattern = false;
        this.destroy$.next();
        this.destroy$.complete();
    }
}
