import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { card_component_animation } from '../animations/card-component.animations';
import { SharedService } from '../../../services/shared/shared.service';
import moment from 'moment';
import { card_modal_animation } from '../animations/card-modal.animation';
import { NoteUpdateService } from 'src/app/core/services/shared/note.service';
import { EntityTypeNote } from 'appcoretruckassist/model/entityTypeNote';

@Component({
  selector: 'app-ta-input-note',
  templateUrl: './ta-input-note.component.html',
  styleUrls: ['./ta-input-note.component.scss'],
  animations: [card_modal_animation('showHideCardBody')],
})
export class TaInputNoteComponent implements OnInit, ControlValueAccessor {
  _isVisibleNote: any = 'null';
  selectionTaken: any;
  range: any;
  gotValue: boolean = false;
  showNote: any;
  @Input() set note(value) {
    if (value && value != '' && value != 'null' && !this.gotValue) {
      this.showNote = value;
    }
  }
  value: string = '';
  savedValue: string = '';
  saveInterval: any;
  isFocused: any = false;
  lastTypeTime: any;
  saveIntervalStarted: boolean = false;
  @Input() isVisibleDivider: boolean = true;
  @Input() public animationsDisabled = false;
  @Input() noteType: string = '';
  savingNote: boolean = false;
  @Input() entityId: number = 0;
  @Input() entityType: string = '';
  noActive: string;

  @Input() set isVisibleNote(value: boolean) {
    this.noActive = value ? 'active' : 'innactive';
    this._isVisibleNote = value ? true : false;
  }

  // @Input('isVisibleNote') set isVisibleNote(value: any) {
  //   this._isVisibleNote = value ? true : false;
  // }

  animationMarginParams = {
    marginTop: '0px',
    marginBottom: '0px',
  };

  @Input() isVisibleArrow: boolean = true;
  @Input() minRows: number = 2;
  @Input() maxRows: number = 5;
  @Input() placeholder: string = 'Write a note.';
  @Input() isReadOnly: boolean = false;
  @Input() customClass: string = null;
  @ViewChild('main_editor', { static: true }) noteRef: ElementRef;

  constructor(
    @Self() public superControl: NgControl,
    private sharedService: SharedService,
    private noteService: NoteUpdateService,
    private ref: ChangeDetectorRef
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit() {}

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

  public registerOnTouched(fn: any): void {}

  public openNote() {
    const oldNoActive = this.noActive;
    this.noActive = '';
    this._isVisibleNote = !this._isVisibleNote;

    if (this._isVisibleNote) {
      this.checkActiveItems();
    }
  }

  checkFocus(e) {
    this.isFocused = true;
    if (!this._isVisibleNote) {
      this.sharedService.emitAllNoteOpened.next(false);
      setTimeout(() => {
        this.checkActiveItems();
      }, 150);
    }
  }

  changeValue(event) {
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

    if (
      this.noteType == 'details-card' &&
      this.entityId &&
      this.entityType != ''
    ) {
      this.savingNote = true;
      this.ref.detectChanges();
    }
  }

  checkActiveItems() {
    this.sharedService.emitUpdateNoteActiveList.next(null);
  }

  saveNote(allowSave?: boolean) {
    console.log('NOTE SAVED');

    if (this.value == '<br>') {
      this.value = this.value.replace('<br>', '');
    }
    if (allowSave) {
      this.savedValue = this.value;
      this.getSuperControl.patchValue(this.value);
    }
    if (
      this.noteType == 'details-card' &&
      this.entityId &&
      this.entityType != ''
    ) {
      this.savingNote = true;
      setTimeout(() => {
        this.savingNote = false;
      }, 1500);
      this.updateNote();
    }
  }

  prepareForTextRange() {
    this.isFocused = false;
    this.selectionTaken = window.getSelection();
    if (this.selectionTaken.rangeCount && this.selectionTaken.getRangeAt) {
      this.range = this.selectionTaken.getRangeAt(0);
    }
    this.saveIntervalStarted = false;
    clearInterval(this.saveInterval);
    if (this.savedValue != this.value) {
      this.saveNote(true);
    }
  }

  updateNote() {
    const updateValue = {
      entityTypeNote: EntityTypeNote[this.entityType],
      entityId: this.entityId,
      note: this.value,
    };

    this.noteService.updateNote(updateValue).subscribe(() => {});
  }
}
