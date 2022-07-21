import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {animate, style, transition, trigger} from '@angular/animations';
import { SharedService } from 'src/app/core/services/shared/shared.service';

@Component({
  selector: 'app-ta-note',
  templateUrl: './ta-note.component.html',
  styleUrls: ['./ta-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('pickupAnimation', [
      transition(':enter', [
        style({height: 10}),
        animate('100ms', style({height: '*'})),
      ]),
      transition(':leave', [
        animate('50ms', style({height: 0})),
      ]),
    ]),
    trigger('noteLongAnimation', [
      transition(':enter', [
        style({width: 10}),
        animate('100ms', style({width: '*'})),
      ]),
      transition(':leave', [
        animate('300ms', style({width: 0})),
      ]),
    ])
  ]
})
export class TaNoteComponent implements OnInit, OnDestroy {
  @Input() note: any;
  @Input() openAllNotesText: any;
  @ViewChild('t2') t2: any;
  tooltip: any;
  showCollorPattern: boolean;
  buttonsExpanded = false;
  isExpanded = false;
  editorDoc: any;
  value = '';
  noteIcon: string = 'Note - Empty.svg';
  selectedPaternColor = '#FFFFFFF';
  activeOptions: any = {
    bold: false,
    italic: false,
    foreColor: false,
    underline: false
  };
  @Output() saveNoteValue = new EventEmitter();
  openedAll: boolean;
  leaveThisOpened: boolean;
  selectionTaken: any;
  range: any;
  isFocused: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private sharedService: SharedService) {
  }

  ngOnInit(): void {
    console.log(this.note, 'notee');
    if ( this.note && this.note != '' ) {
      this.noteIcon = 'Note.svg';
    }
    /* this.sharedService.emitCloseNote
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      console.log('Poziva se servis za zatvaraeanje nota')
      if ( !window.getSelection().toString() ) {
        if (this.tooltip !== undefined && res && !this.openedAll) {
          if (this.tooltip.isOpen() && this.isExpanded) {
            this.value = this.value == '' ? this.note : this.value;
            this.saveNote();
          }
          this.tooltip.close();
          this.isExpanded = false;
          this.showCollorPattern = false;
          setTimeout(() => {
            this.buttonsExpanded = false;
          }, 200);
        }
      }
    }); */

    /* this.sharedService.emitAllNoteOpened
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      console.log('Poziva se servis za emitAllNoteOpened')
      if ( res ) {
        if ( this.note ) {
          this.openedAll = true;
          this.isExpanded = false;
          this.buttonsExpanded = false;
          this.t2.open();
        }
      } else if (!this.leaveThisOpened) {
        this.openedAll = false;
        this.t2.close();
        this.isExpanded = false;
        this.buttonsExpanded = false;
      } else { this.leaveThisOpened = false; }
    }); */
  }

  checkFocus(e) {
    this.isFocused = true;
    if (!this.isExpanded) {
      this.openedAll = false;
      this.leaveThisOpened = true;
      this.sharedService.emitAllNoteOpened.next(false);
      this.isExpanded = true;
      setTimeout(() => {
        this.buttonsExpanded = true;
        this.checkActiveItems();
      }, 150);
    }
  }

  toggleNote(tooltip: any, data: any) {
    console.log('Note kliknut');
    console.log(tooltip);
    console.log(data);

    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      if (this.openedAll) {
        this.leaveThisOpened = true;
        this.openedAll = false;
        this.sharedService.emitAllNoteOpened.next(false);
      } else if (!this.isExpanded) {
        this.leaveThisOpened = false;
        this.checkActiveItems();
        this.isExpanded = true;
        this.buttonsExpanded = true;
      } else {
        this.isExpanded = false;
        this.buttonsExpanded = false;
        this.leaveThisOpened = false;
        tooltip.close();
      }
      this.showCollorPattern = false;
      console.log('Note se zatvara');
    } else {
      if (!data || data == '') {
        this.buttonsExpanded = true;
        this.isExpanded = true;
      }
      this.leaveThisOpened = true;
      this.sharedService.emitAllNoteOpened.next(false);
      tooltip.open({data});
      console.log('Note se otvara');
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
  }

  checkActiveItems() {
    this.sharedService.emitUpdateNoteActiveList.next(null);
  }

  saveNote() {
    this.leaveThisOpened = false;
    this.showCollorPattern = false;
    this.isExpanded = false;
    this.buttonsExpanded = false;
    if (this.t2) {
      this.t2.close();
    }
    if (this.value == '<br>') {
      this.value = this.value.replace('<br>', '');
    }
    this.saveNoteValue.emit(this.value);
  }

  closeNote() {
    console.log('Poziva se closeNote Metoda');
    this.leaveThisOpened = false;
    this.showCollorPattern = false;
    this.isExpanded = false;
    this.buttonsExpanded = false;
    if (this.t2) {
      this.t2.close();
    }
  }

  maxLimitForContenteditableDiv(e: any, limit: number) {
    let allowedKeys = false;

    if (e.type === 'keydown') {
        allowedKeys = (
            e.which === 8 ||  /* BACKSPACE */
            e.which === 35 || /* END */
            e.which === 36 || /* HOME */
            e.which === 37 || /* LEFT */
            e.which === 38 || /* UP */
            e.which === 39 || /* RIGHT*/
            e.which === 40 || /* DOWN */
            e.which === 46 || /* DEL*/
            e.ctrlKey === true && e.which === 65 || /* CTRL + A */
            e.ctrlKey === true && e.which === 88 || /* CTRL + X */
            e.ctrlKey === true && e.which === 67 || /* CTRL + C */
            e.ctrlKey === true && e.which === 86 || /* CTRL + V */
            e.ctrlKey === true && e.which === 90    /* CTRL + Z */
        )
    }
    if (e.ctrlKey === true && e.which === 86 ) {
        setTimeout(function () {
            $(e.target).text($(e.target).text().slice(0, limit));
        });
    }
    if (!allowedKeys && $(e.target).text().length >= limit) {
        e.preventDefault();
    }
  }

  public ngOnDestroy(): void {
    this.leaveThisOpened = false;
    this.showCollorPattern = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
