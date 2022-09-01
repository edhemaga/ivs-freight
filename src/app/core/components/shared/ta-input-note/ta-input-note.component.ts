import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { card_component_animation } from '../animations/card-component.animations';
import { input_note_animation } from './ta-input-note.animation';

@Component({
  selector: 'app-ta-input-note',
  templateUrl: './ta-input-note.component.html',
  styleUrls: ['./ta-input-note.component.scss'],
  animations: [card_component_animation('showHideCardBody')],
})
export class TaInputNoteComponent implements OnInit, ControlValueAccessor {
  _isVisibleNote: any = null;
  selectionTaken: any;
  range: any;
  value: string = '';
  savedValue: string = '';
  saveInterval: any;
  isFocused: any = false;
  saveIntervalStarted: boolean = false;
  @Input() isVisibleDivider: boolean = true;
  @Input() isVisibleSecondDivider: boolean = true;
  @Input() public animationsDisabled = false;

  @Input('isVisibleNote') set isVisibleNote(value: any) {
    this._isVisibleNote = value ? true : null;
  }

  @Input() isVisibleArrow: boolean = true;
  @Input() minRows: number = 2;
  @Input() maxRows: number = 5;
  @Input() placeholder: string = 'Write a note.';
  @Input() isReadOnly: boolean = false;
  @Input() customClass: string = null;
  @Output() saveNoteValue = new EventEmitter();
  @ViewChild('main_editor', { static: true }) noteRef: ElementRef;

  constructor(
    @Self() public superControl: NgControl,
    private sharedService: SharedService
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
    this.value = event;
    this.checkActiveItems();
    let saveValue = this.value;

    if (!this.saveIntervalStarted) {
      this.saveIntervalStarted = true;
      this.saveInterval = setInterval(() => {
        if (saveValue == this.value) {
          this.saveIntervalStarted = false;
          clearInterval(this.saveInterval);
        }
        this.saveNote(true);
      }, 60000);
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
      this.saveNoteValue.emit(this.value);
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
}
