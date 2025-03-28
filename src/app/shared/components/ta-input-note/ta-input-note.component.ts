import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Self,
    ViewChild,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormsModule,
    NgControl,
    ReactiveFormsModule,
} from '@angular/forms';

// moment
import moment from 'moment';

// animations
import { cardModalAnimation } from '@shared/animations/card-modal.animation';

// pipes
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaNoteContainerComponent } from '@shared/components/ta-note-container/ta-note-container.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';

// services
import { SharedService } from '@shared//services/shared.service';
import { NoteUpdateService } from '@shared/services/note-update.service';

// models
import { EntityTypeNote } from 'appcoretruckassist';

// helpers
import { CopyPasteHelper } from '@shared/utils/helpers/copy-paste.helper';
@Component({
    selector: 'app-ta-input-note',
    templateUrl: './ta-input-note.component.html',
    styleUrls: ['./ta-input-note.component.scss'],
    animations: [cardModalAnimation('showHideCardBody')],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        ReactiveFormsModule,

        // Component
        TaNoteContainerComponent,
        TaSpinnerComponent,

        // Pipe
        SafeHtmlPipe,
    ],
})
export class TaInputNoteComponent implements ControlValueAccessor {
    @ViewChild('main_editor', { static: true }) public noteRef: ElementRef;
    @ViewChild('noteContainer', { static: true })
    public noteContainer: TaNoteContainerComponent;

    @Input() set note(value: string) {
        if (
            (value && value != '' && value != 'null' && !this.gotValue) ||
            this.blankNote
        ) {
            this.showNote = value;
        }
    }
    @Input() set isVisibleNote(value: boolean) {
        this.noActive = value ? 'active' : 'innactive';
        this._isVisibleNote = value ? true : false;
    }
    @Input() blankNote: boolean = false;
    @Input() isVisibleDivider: boolean = true;
    @Input() animationsDisabled = false;
    @Input() noteType: string = '';
    @Input() entityId: number = 0;
    @Input() entityType: string = '';
    @Input() defArrow: boolean = true;
    @Input() isVisibleArrow: boolean = true;
    @Input() minRows: number = 2;
    @Input() maxRows: number = 5;
    @Input() noteLabel: string = 'Note';
    @Input() placeholder: string = 'Write a note...';
    @Input() isReadOnly: boolean = false;
    @Input() customClass: string = null;

    @Output() styledValueEmitter = new EventEmitter<string>();
    @Output() toggleCard = new EventEmitter<boolean>();

    //note properties
    public _isVisibleNote: boolean | string = 'null';
    public selectionTaken: Selection;
    public range: Range;
    private gotValue: boolean = false;
    public showNote: string;
    public value: string = '';
    public isFocused: boolean = false;
    private lastTypeTime: number;
    private blurNoteTimeout: any;
    public noActive: string;

    //saving
    public savingNote: boolean = false;
    private saveInterval: any;
    private saveIntervalStarted: boolean = false;
    public savedValue: string = '';

    constructor(
        @Self() public superControl: NgControl,
        private sharedService: SharedService,
        private noteService: NoteUpdateService
    ) {
        this.superControl.valueAccessor = this;
    }

    get getSuperControl() {
        return this.superControl.control;
    }

    public writeValue(obj: any): void {
        this.noteRef.nativeElement.value = obj;
    }
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public onChange(event: any): void {
        this.value = event;
    }

    public registerOnTouched(_: any): void {}

    public openNote(): void {
        this.noActive = '';
        this._isVisibleNote = !this._isVisibleNote;
        this.toggleCard.emit(this._isVisibleNote);

        if (this._isVisibleNote) {
            this.checkActiveItems();
        }
    }

    public checkFocus(): void {
        this.isFocused = true;

        if (!this._isVisibleNote) {
            this.sharedService.emitAllNoteOpened.next(false);
            setTimeout(() => {
                this.checkActiveItems();
            }, 150);
        }
    }

    public changeValue(event: string): void {
        this.gotValue = true;
        this.value = event;
        this.checkActiveItems();
        this.lastTypeTime = moment().unix();
        const updateTime = this.noteType == 'details-card' ? 2 : 0;

        if (!this.saveIntervalStarted) {
            this.saveIntervalStarted = true;
            this.saveInterval = setInterval(() => {
                if (moment().unix() - this.lastTypeTime >= updateTime) {
                    this.saveIntervalStarted = false;
                    clearInterval(this.saveInterval);
                    this.saveNote(true);
                }
            }, 100);
        }
    }

    public checkActiveItems(): void {
        if (this.noteContainer && this.noteContainer?.checkActiveItems) {
            this.noteContainer?.checkActiveItems();
        }
    }

    public saveNote(allowSave?: boolean): void {
        if (this.value == '<br>') {
            this.value = this.value.replace('<br>', '');
        }
        if (allowSave) {
            this.savedValue = this.value;
            const val = !this.value || this.value == '' ? null : this.value;
            this.getSuperControl.patchValue(val);
        }
        if (
            this.noteType == 'details-card' &&
            this.entityId &&
            this.entityType != ''
        ) {
            this.savingNote = true;
            setTimeout(() => {
                this.savingNote = false;
            }, 700);
            this.updateNote();
        }

        this.styledValueEmitter.emit(this.noteRef.nativeElement.innerHTML);
    }

    public stopBlurRemoveTimeout(): void {
        clearTimeout(this.blurNoteTimeout);
    }

    public prepareForTextRange(): void {
        this.isFocused = false;
        this.selectionTaken = window.getSelection();
        if (this.selectionTaken.rangeCount && this.selectionTaken.getRangeAt) {
            this.range = this.selectionTaken.getRangeAt(0);
            this.selectionTaken.removeAllRanges();
            this.selectionTaken.addRange(this.range);

            this.blurNoteTimeout = setTimeout(() => {
                this.selectionTaken.removeAllRanges();
            }, 100);
        }
        this.saveIntervalStarted = false;
        clearInterval(this.saveInterval);
        if (this.savedValue != this.value) {
            this.saveNote(true);
        }

        this.styledValueEmitter.emit(this.noteRef.nativeElement.innerHTML);
    }

    public updateNote(): void {
        this.entityType =
            this.entityType.charAt(0).toUpperCase() + this.entityType.slice(1);

        const updateValue = {
            entityTypeNote: EntityTypeNote[this.entityType],
            entityId: this.entityId,
            note: this.value,
        };

        this.noteService.updateNote(updateValue).subscribe(() => {});
    }

    public onPaste(event: ClipboardEvent): void {
        CopyPasteHelper.onPaste(event);
    }
}
