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

// moment
import moment from 'moment';

// animations
import { animate, style, transition, trigger } from '@angular/animations';

// services
import { NoteUpdateService } from '@shared/services/note-update.service';
import { DetailsDataService } from '@shared/services/details-data.service';
import { SharedService } from '@shared/services/shared.service';

// popover
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// pipes
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// helpers
import { CopyPasteHelper } from '@shared/utils/helpers/copy-paste.helper';

//components
import { TaNoteContainerComponent } from '@shared/components/ta-note-container/ta-note-container.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';

// models
import { ActiveOptions } from '@shared/components/ta-note/models';
import { EntityTypeNote } from 'appcoretruckassist/model/entityTypeNote';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

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
        TaAppTooltipV2Component,
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
    @Output() noteToggleEmitter: EventEmitter<{ opened: boolean }> =
        new EventEmitter();

    public _note: string;
    @Input() set note(value: string) {
        this._note = value;
        this.value = value;
        this.checkNoteImage(value);
    }
    @Input() public set noteDimension(value: number) {
        this._noteDimension = value;

        if (this.isDispatch) this.setNoteParentWidth();
    }
    @Input() mainData: any;
    @Input() parking: boolean = false;
    @Input() dispatchIndex: number = -1;
    @Input() type: string;
    @Input() parentWidth: string;
    @Input() dispatchNoteEmpty: boolean;

    @Input() set openedAll(value: boolean) {
        this.isAllOpen = value;

        if (this.isDispatch) {
            this.closeNote(true);
            this.setNoteParentWidth();
        }
    }
    @Input() entityId: number = 0;
    @Input() entityType: string;
    @Input() isDispatch: boolean = false;

    @ViewChild('main_editor') public main_editor: ElementRef;
    @ViewChild('note_popover') public note_popover: ElementRef;
    @ViewChild('noteContainer') public noteContainer: TaNoteContainerComponent;

    public _noteWidth: number = 250;
    public _parentWidth: number = 250;
    public isAllOpen: boolean;

    @Input() set noteWidth(value: number) {
        this._noteWidth = value;
    }

    //note container
    public showCollorPattern: boolean;
    public buttonsExpanded = false;
    public activeOptions: ActiveOptions;
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
    public _noteDimension: number;

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
    onWindowResize() {
        if (this.isDispatch) {
            this.setNoteParentWidth();
        }
    }

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngAfterViewInit(): void {
        this.value = this._note;
        this.setNoteParentWidth();

        this.correctEntityType();
    }

    private setNoteParentWidth(): void {
        if (this.parentWidth && this.isAllOpen) {
            setTimeout(() => {
                const parentWidth = this.elRef.nativeElement
                    ?.closest(this.parentWidth)
                    ?.getBoundingClientRect();
                this._parentWidth = this.isDispatch
                    ? parentWidth?.width - 2
                    : parentWidth?.width;
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
            if (this.isAllOpen) {
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
                this.noteToggleEmitter.emit({ opened: this.noteOpened });
                this._note = this.value;
                t2.close();
            }
            this.showCollorPattern = false;
        } else {
            if (!data || data == '' || this.isAllOpen) {
                this.buttonsExpanded = true;
                this.isExpanded = true;
            }
            this.leaveThisOpened = true;
            this.sharedService.emitAllNoteOpened.next(false);
            setTimeout(() => {
                this.noteOpened = true;
                this.noteToggleEmitter.emit({ opened: this.noteOpened });
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

    public valueChange(
        event: string,
        isDeleteAll?: boolean,
        notePopover?: NgbPopover
    ): void {
        this.value = event;
        if (isDeleteAll) {
            if (notePopover?.isOpen()) notePopover?.close();
            this.closeNote();
        }
        this.checkActiveItems();
        this.lastTypeTime = moment().unix();
        if (!this.saveIntervalStarted) {
            this.saveIntervalStarted = true;
            this.saveInterval = setInterval(() => {
                if (moment().unix() - this.lastTypeTime >= 2) {
                    this.saveIntervalStarted = false;
                    clearInterval(this.saveInterval);
                    this.saveNote(true, isDeleteAll);
                }
            }, 100);
        }
    }

    private checkActiveItems(): void {
        if (this.noteContainer && this.noteContainer?.checkActiveItems)
            this.noteContainer?.checkActiveItems();
    }

    public saveNote(autoSave?: boolean, isDeleteAll?: boolean): void {
        setTimeout(() => {
            if (!autoSave && this.isAllOpen) {
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
        if (isDeleteAll) this.closeNote();
    }

    public closeNote(dontTransfer?: boolean): void {
        this.noteOpened = false;
        this.leaveThisOpened = false;
        this.showCollorPattern = false;
        this.isExpanded = false;
        this.buttonsExpanded = false;
        this._note = this.value;
        this.noteToggleEmitter.emit({ opened: this.noteOpened });
        if (!dontTransfer) this.transferNoteData();
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
                if (this.isAllOpen) this.isExpanded = true;
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
        if (this.entityType === TableStringEnum.USER) {
            this.entityType = EntityTypeNote.CompanyUser;
        } else if (this.entityType === TableStringEnum.CUSTOMER) {
            this.entityType = EntityTypeNote.Broker;
        } else if (this.entityType === TableStringEnum.FUEL) {
            this.entityType = EntityTypeNote.FuelStopStore;
        }
    }

    public onPaste(event: ClipboardEvent): void {
        CopyPasteHelper.onPaste(event);
    }

    private transferNoteData(): void {
        this.saveNoteValue.emit(this.value);
    }

    public ngOnDestroy(): void {
        this.leaveThisOpened = false;
        this.showCollorPattern = false;
        this.destroy$.next();
        this.destroy$.complete();
    }
}
