import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SharedService } from '../../../../services/shared/shared.service';

@Component({
  selector: 'app-ta-note-container',
  templateUrl: './ta-note-container.component.html',
  styleUrls: ['./ta-note-container.component.scss'],
  animations: [
    trigger('pickupAnimation', [
      transition(':enter', [
        style({ height: 10 }),
        animate('100ms', style({ height: '*' })),
      ]),
      transition(':leave', [animate('50ms', style({ height: 0 }))]),
    ]),
  ],
})
export class TaNoteContainerComponent implements OnInit {
  @Input() value: any;
  @Input() range: any;
  @Input() selectionTaken: any;
  @Input() selectedEditor: any;
  @Input() isExpanded: boolean;
  @Input() parking: boolean = false;
  @Input() popoverNote: boolean = false;
  selectedPaternColor = '#6c6c6c';
  showCollorPattern: boolean;
  activeOptions: any = {
    bold: false,
    italic: false,
    foreColor: false,
    underline: false,
  };
  containerColors: any[] = [
    {
      color: '#26A690',
      name: 'Dark Green',
    },
    {
      color: '#EF5350',
      name: 'Red',
    },
    {
      color: '#FFA726',
      name: 'Yellow',
    },
    {
      color: '#536BC2',
      name: 'Blue',
    },
    {
      color: '#6C6C6C',
      name: 'Gray',
    },
  ];
  selectedColorName: any = {
    color: '#6C6C6C',
    name: 'Gray',
  };
  slowTimeout: any;
  lastSavedIndex: number = -1;
  private destroy$ = new Subject<void>();

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.emitUpdateNoteActiveList
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.checkActiveItems();
      });
  }

  ngAfterViewInit(): void {
    if (this.popoverNote) {
      this.containerColors = [
        {
          color: '#6C6C6C',
          name: 'Gray',
        },
        {
          color: '#26A690',
          name: 'Dark Green',
        },
        {
          color: '#536BC2',
          name: 'Blue',
        },
        {
          color: '#FFA726',
          name: 'Yellow',
        },
        {
          color: '#EF5350',
          name: 'Red',
        },
      ];
    }
  }

  filterContainersColor() {
    this.containerColors.sort((a, b) => {
      if(this.popoverNote){
        if (b['color'] != this.selectedColorName.color) {
          return -1;
        }
        return 1;
      }
      else{
        if (a['color'] != this.selectedColorName.color) {
          return -1;
        }
        return 1;
      }
      
    });
  }

  executeEditor(action: string, color?: string, indx?: number) {
    if (indx || indx === 0) {
      this.selectedColorName = this.containerColors[indx];
    }

    document.execCommand('styleWithCSS', false, 'true');
    if (this.range) {
      this.selectionTaken.removeAllRanges();
      this.selectionTaken.addRange(this.range);
    }
    if (action !== 'foreColor') {
      this.showCollorPattern = false;
      this.activeOptions[action] = !this.activeOptions[action];
      if (!this.activeOptions[action]) {
        if (this.value.replace('<br>', '') == '') {
          this.selectionTaken.removeAllRanges();
        }
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand(action, false, null);
      } else {
        this.focusElement();
        document.execCommand(action, false, null);
      }
    } else {
      if(this.lastSavedIndex != indx){
        this.filterContainersColor();
      }
      this.lastSavedIndex = indx;
      setTimeout(() => {
        this.focusElement();
        setTimeout(() => {
          this.focusElement();
          this.selectedPaternColor = color;
          document.execCommand('foreColor', false, color);
        });
      });
    }
  }

  focusElement(): void {
    if (this.selectedEditor) {
      this.selectedEditor.focus();
    } else {
      document.getElementById('main_editor').focus();
    }
  }

  checkActiveItems() {
    for (const act in this.activeOptions) {
      this.activeOptions[act] = document.queryCommandState(act);

      clearTimeout(this.slowTimeout);
      this.slowTimeout = setTimeout(() => {
        const findedColor = this.containerColors.find(
          (item) => item.color == document.queryCommandValue('ForeColor')
        );
        this.selectedColorName = findedColor
          ? findedColor
          : {
              color: '#6c6c6c',
              name: 'Gray',
            };
      }, 200);
      this.selectedPaternColor = document.queryCommandValue('ForeColor');
    }
  }

  public ngOnDestroy(): void {
    this.showCollorPattern = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
