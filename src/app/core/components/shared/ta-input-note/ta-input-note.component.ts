import {
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

@Component({
  selector: 'app-ta-input-note',
  templateUrl: './ta-input-note.component.html',
  styleUrls: ['./ta-input-note.component.scss'],
  animations: [card_component_animation('showHideCardBody')],
})
export class TaInputNoteComponent implements OnInit, ControlValueAccessor {
  _isVisibleNote: any = 0;
  selectionTaken: any;
  range: any;
  @Input() note: any;
  value: string = '';
  savedValue: string = '';
  saveInterval: any;
  isFocused: any = false;
  lastTypeTime: any;
  saveIntervalStarted: boolean = false;
  @Input() isVisibleDivider: boolean = true;
  @Input() public animationsDisabled = false;


  noActive: string;

  @Input() set isVisibleNote(value: boolean) {
    this.noActive = value ? "active" : "innactive";
  }

  // @Input('isVisibleNote') set isVisibleNote(value: any) {
  //   this._isVisibleNote = value ? true : false;
  // }

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
    this.noActive = "";
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
