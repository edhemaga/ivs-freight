import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { input_note_animation } from './ta-input-note.animation';

@Component({
  selector: 'app-ta-input-note',
  templateUrl: './ta-input-note.component.html',
  styleUrls: ['./ta-input-note.component.scss'],
  animations: [input_note_animation('showHideNote')],
})
export class TaInputNoteComponent implements OnInit, ControlValueAccessor {
  _isVisibleNote: boolean = false;
  @Input() isVisibleDivider: boolean = true;

  @Input('isVisibleNote') set isVisibleNote(value: boolean) {
      this._isVisibleNote = value ? true : false;
  }

  @Input() isVisibleArrow: boolean = true;
  @Input() minRows: number = 2;
  @Input() maxRows: number = 5;
  @Input() placeholder: string = "Write a note."
  @Input() isReadOnly: boolean = false;
  @Input() customClass: string = null;

  @ViewChild('note', { static: true }) noteRef: ElementRef;
  @ViewChild('noteBody', { static: true }) noteBody: ElementRef;

  constructor(@Self() public superControl: NgControl, private renderer: Renderer2) {
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

  public onChange(event: any): void {}

  public registerOnTouched(fn: any): void {}

  public openNote(){
    this._isVisibleNote = !this._isVisibleNote;
  }
}
