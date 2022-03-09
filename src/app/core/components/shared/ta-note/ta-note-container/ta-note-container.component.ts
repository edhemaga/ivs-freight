import {takeUntil} from 'rxjs/operators';
import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import { SharedService } from '../../../../services/shared/shared.service';

@Component({
  selector: 'app-ta-note-container',
  templateUrl: './ta-note-container.component.html',
  styleUrls: ['./ta-note-container.component.scss'],
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
  ]
})
export class TaNoteContainerComponent implements OnInit {
  @Input() value: any;
  @Input() range: any;
  @Input() selectionTaken: any;
  @Input() selectedEditor: any;
  @Input() isExpanded: boolean;
  selectedPaternColor = '#FFFFFFF';
  showCollorPattern: boolean;
  activeOptions: any = {
    bold: false,
    italic: false,
    foreColor: false,
    underline: false
  };
  containerColors: any[] = [
    {
      color: "rgb(183, 183, 183)",
      name: "Gray"
    },
    {
      color: "rgb(8, 134, 108)",
      name: "Dark Green"
    },
    {
      color: "rgb(86, 115, 170)",
      name: "Blue"
    },
    {
      color: "rgb(113, 76, 122)",
      name: "Purple"
    },
    {
      color: "rgb(255, 80, 80)",
      name: "Red"
    },
    {
      color: "rgb(175, 134, 234)",
      name: "Light Purple"
    },
    {
      color: "rgb(209, 196, 144)",
      name: "Gold"
    }
  ]
  selectedColorName: any = {
    color: "#B7B7B7",
    name: "Gray"
  };
  slowTimeout: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.sharedService.emitUpdateNoteActiveList
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.checkActiveItems();
      });
  }

  filterContainersColor() {
    this.containerColors.sort((a, b) => {
      if (a['color'] == this.selectedColorName.color) {
        return -1;
      }
      return 1;
    });
  }

  executeEditor(action: string, color?: string, indx?: number) {
    if (indx) {
      this.selectedColorName = this.containerColors[indx];
    }
    this.filterContainersColor();
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
        const findedColor = this.containerColors.find(item => item.color == document.queryCommandValue('ForeColor'));
        this.selectedColorName = findedColor ? findedColor : {
          color: "#B7B7B7",
          name: "Gray"
        };
        this.filterContainersColor();
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
