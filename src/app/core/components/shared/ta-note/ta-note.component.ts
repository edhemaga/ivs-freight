import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { SharedService } from '../../../services/shared/shared.service';
import moment from 'moment';
import { NoteUpdateService } from 'src/app/core/services/shared/note.service';
import { EntityTypeNote } from 'appcoretruckassist/model/entityTypeNote';
import { DetailsDataService } from '../../../services/details-data/details-data.service';

@Component({
    selector: 'app-ta-note',
    templateUrl: './ta-note.component.html',
    styleUrls: ['./ta-note.component.scss'],
    encapsulation: ViewEncapsulation.None,
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
    @Input() note: any;
    @Input() mainData: any;
    @Input() openAllNotesText: any;
    @Input() parking: any = false;
    @Input() dispatchIndex: number = -1;
    @Input() noteWidth: number = 250;
    @ViewChild('main_editor', { static: false }) public main_editor: any;
    @ViewChild('note_popover', { static: false }) note_popover: any;
    tooltip: any;
    showCollorPattern: boolean;
    buttonsExpanded = false;
    isExpanded = false;
    noteOpened: boolean = false;
    editorDoc: any;
    value: string = '';
    savedValue: string = '';
    lastTypeTime: any;
    saveInterval: any;
    saveIntervalStarted: boolean = false;
    noteIcon: string = 'Note - Empty.svg';
    selectedPaternColor = '#6C6C6C';
    activeOptions: any = {
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
    };
    @Output() saveNoteValue = new EventEmitter();
    @Input() openedAll: any;
    @Input() entityId: number = 0;
    @Input() entityType: string;
    leaveThisOpened: boolean;
    selectionTaken: any;
    range: any;
    isFocused: boolean = false;
    preventClosing: boolean = false;
    savingNote: boolean = false;
    private destroy$ = new Subject<void>();

    constructor(
        private sharedService: SharedService,
        private ref: ChangeDetectorRef,
        private noteService: NoteUpdateService,
        private DetailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.checkNoteImage(this.note);
    }

    ngAfterViewInit(): void {
        this.value = this.note;

        this.correctEntityType();
    }

    checkFocus(e) {
        e.stopPropagation();
        e.preventDefault();

        this.isFocused = true;
        this.leaveThisOpened = true;
        this.sharedService.emitAllNoteOpened.next(false);
        this.isExpanded = true;
        setTimeout(() => {
            this.buttonsExpanded = true;
            this.checkActiveItems();
        }, 150);
    }

    toggleNote(data: any, t2) {
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
                this.note = this.value;
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

    editorClick(event) {
        if (event.target.innerText === 'Take a note...') {
            event.target.innerText = '';
        }
    }

    prepareForTextRange() {
        this.isFocused = false;
        this.selectionTaken = window.getSelection();
        if (this.selectionTaken.rangeCount && this.selectionTaken.getRangeAt) {
            this.range = this.selectionTaken.getRangeAt(0);
        }
    }

    preventMouseDown(ev) {
        ev.stopPropagation();
        ev.preventDefault();
    }

    valueChange(event) {
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

    checkActiveItems() {
        this.sharedService.emitUpdateNoteActiveList.next(null);
    }

    saveNote(autoSave?: boolean) {
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

    closeNote() {
        this.noteOpened = false;
        this.leaveThisOpened = false;
        this.showCollorPattern = false;
        this.isExpanded = false;
        this.buttonsExpanded = false;
        this.note = this.value;
    }

    maxLimitForContenteditableDiv(e: any, limit: number) {
        let allowedKeys = false;

        if (e.type === 'keydown') {
            allowedKeys =
                e.which === 8 /* BACKSPACE */ ||
                e.which === 35 /* END */ ||
                e.which === 36 /* HOME */ ||
                e.which === 37 /* LEFT */ ||
                e.which === 38 /* UP */ ||
                e.which === 39 /* RIGHT*/ ||
                e.which === 40 /* DOWN */ ||
                e.which === 46 /* DEL*/ ||
                (e.ctrlKey === true && e.which === 65) /* CTRL + A */ ||
                (e.ctrlKey === true && e.which === 88) /* CTRL + X */ ||
                (e.ctrlKey === true && e.which === 67) /* CTRL + C */ ||
                (e.ctrlKey === true && e.which === 86) /* CTRL + V */ ||
                (e.ctrlKey === true && e.which === 90) /* CTRL + Z */;
        }
        if (e.ctrlKey === true && e.which === 86) {
            setTimeout(function () {
                $(e.target).text($(e.target).text().slice(0, limit));
            });
        }
        if (!allowedKeys && $(e.target).text().length >= limit) {
            e.preventDefault();
        }
    }

    expandAllNotes() {
        if (!this.isExpanded) {
            setTimeout(() => {
                if (this.openedAll) {
                    this.isExpanded = true;
                }
            });
        }
    }

    popoverClosed() {
        if (!this.preventClosing) {
            this.closeNote();
        }

        this.preventClosing = false;
    }

    updateNote() {
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

    checkNoteImage(note) {
        if (note && note != '') {
            this.noteIcon = 'Note.svg';
        } else {
            this.noteIcon = 'Note - Empty.svg';
        }
    }

    correctEntityType() {
        if (this.entityType == 'User') {
            this.entityType = 'CompanyUser';
        }
        if (this.entityType == 'Customer') {
            this.entityType = 'Broker';
        }
    }

    public ngOnDestroy(): void {
        this.leaveThisOpened = false;
        this.showCollorPattern = false;
        this.destroy$.next();
        this.destroy$.complete();
    }
}
