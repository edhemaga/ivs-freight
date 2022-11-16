import { TaNoteContainerComponent } from './../../shared/ta-note/ta-note-container/ta-note-container.component';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
  selector: 'app-dispatcher-note',
  templateUrl: './dispatcher-note.component.html',
  styleUrls: ['./dispatcher-note.component.scss'],
  animations: [
    trigger('noteLongAnimation', [
      transition(':enter', [
        style({ width: 10 }),
        animate('100ms', style({ width: '*' })),
      ]),
      transition(':leave', [animate('300ms', style({ width: 0 }))]),
    ]),
  ],
})
export class DispatcherNoteComponent implements OnInit {
  @ViewChild(TaNoteContainerComponent) noteItem: TaNoteContainerComponent;
  @Input() note: any;
  @Input() openAllNotesText: any;
  @Input() note_expanded: boolean;
  @Output() setResizeGps = new EventEmitter();
  @Input() rowIndex: any;
  selectedEditor: HTMLAnchorElement;
  isExpanded = false;
  selectionTaken: any;
  range: any;
  value: any;
  buttonsExpanded = false;
  savedNote: any;

  @Output() saveNoteValue = new EventEmitter();
  openedAll: boolean;
  leaveThisOpened: boolean;

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.savedNote = this.note;
    this.sharedService.emitOpenNote.subscribe((item) => {
      if (this.isExpanded) {
        this.closeNote();
      }
    });
  }

  prepareForTextRange() {
    this.selectionTaken = window.getSelection();
    if (this.selectionTaken.rangeCount && this.selectionTaken.getRangeAt) {
      this.range = this.selectionTaken.getRangeAt(0);
    }
  }

  valueChange(event) {
    this.value = event;
    this.checkActiveItems();
  }

  checkActiveItems() {
    this.sharedService.emitUpdateNoteActiveList.next(null);
  }

  saveNote() {
    this.leaveThisOpened = false;
    this.isExpanded = false;
    this.buttonsExpanded = false;
    if (this.value == '<br>') {
      this.value = this.value.replace('<br>', '');
    }
    this.savedNote = this.value;
    this.saveNoteValue.emit(this.value);
  }

  checkFocus(e) {
    if (!this.isExpanded) {
      this.openedAll = false;
      this.leaveThisOpened = true;
      this.sharedService.emitAllNoteOpened.next(false);
      this.sharedService.emitOpenNote.next(null);
      this.isExpanded = true;
      setTimeout(() => {
        this.buttonsExpanded = true;
        this.checkActiveItems();
      }, 150);
    }
    setTimeout(() => {
      this.noteItem.showCollorPattern = false;
    }, 200);

    this.selectedEditor = e.target;
  }

  public setResizeGpsMain(indx: number): void {
    this.sharedService.emitOpenNote.next(this.rowIndex);
  }

  closeNote() {
    this.leaveThisOpened = false;
    this.isExpanded = false;
    this.buttonsExpanded = false;
    this.value = this.savedNote;
    if (this.selectedEditor) {
      this.selectedEditor.innerHTML = this.savedNote;
    }
  }

  checkNoteSize() {
    // if(this.value){
    //   return this.value.length < 225;
    // }
  }
}
