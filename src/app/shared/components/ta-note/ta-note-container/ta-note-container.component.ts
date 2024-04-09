import { Subject } from 'rxjs';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// constants
import { NoteConstants } from '../utils/constants/note.constants';

// components
import { TaAppTooltipV2Component } from 'src/app/shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// models
import { NoteColor } from '../models/note-color.model';

// icons
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-ta-note-container',
    templateUrl: './ta-note-container.component.html',
    styleUrls: ['./ta-note-container.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        AngularSvgIconModule,
        NgbModule,

        // Component
        TaAppTooltipV2Component,
    ],
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
export class TaNoteContainerComponent implements OnInit, OnDestroy {
    @Input() value: any;
    @Input() range: any;
    @Input() selectionTaken: any;
    @Input() selectedEditor: any;
    @Input() isExpanded: boolean;
    @Input() parking: boolean = false;
    @Input() popoverNote: boolean = false;
    @Input() isVisibleArrow: boolean = true;
    @Input() type: string;
    @Output() stopBlurRemoveTimeout = new EventEmitter();

    selectedPaternColor = '#6c6c6c';
    showCollorPattern: boolean;
    activeOptions: any = {
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
    };
    containerColors: NoteColor[] = [...NoteConstants.noteColors];
    selectedColorName: any = {
        color: '#6C6C6C',
        name: 'Gray',
    };
    slowTimeout: any;
    lastSavedIndex: number = -1;
    defaultColorSet: boolean = false;
    closedPattern: boolean = false;
    private destroy$ = new Subject<void>();

    constructor() {}

    ngOnInit(): void {}

    filterContainersColor() {
        this.containerColors.sort((a) => {
            if (a['color'] != this.selectedColorName.color) {
                return 1;
            }
            return -1;
        });
    }

    executeEditor(action: string, color?: string, indx?: number) {
        this.stopBlurRemoveTimeout.emit();
        if (indx || indx === 0) {
            this.selectedColorName = this.containerColors[indx];
        }

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
            if (this.lastSavedIndex != indx) {
                this.filterContainersColor();
            }
            this.lastSavedIndex = indx;
            setTimeout(() => {
                this.focusElement();
                setTimeout(() => {
                    this.focusElement();
                    this.selectedPaternColor = color;
                    document.execCommand('foreColor', false, color);
                    this.defaultColorSet = true;
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
                    (item) =>
                        item.color == document.queryCommandValue('ForeColor')
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

        if (this.defaultColorSet) {
            this.containerColors.map((col, indx) => {
                if (col.color == this.selectedPaternColor) {
                    this.selectedColorName = this.containerColors[indx];

                    if (this.lastSavedIndex != indx) {
                        this.filterContainersColor();
                    }
                    this.lastSavedIndex = indx;
                    setTimeout(() => {
                        this.focusElement();
                        setTimeout(() => {
                            this.focusElement();
                            this.selectedPaternColor = col.color;
                        });
                    });
                }
            });
        }
    }

    togglePattern() {
        this.showCollorPattern = !this.showCollorPattern;

        if (!this.showCollorPattern) {
            setTimeout(() => {
                this.closedPattern = false;
            }, 300);
        } else {
            this.closedPattern = true;
        }
    }

    public ngOnDestroy(): void {
        this.showCollorPattern = false;
        this.destroy$.next();
        this.destroy$.complete();
    }
}
