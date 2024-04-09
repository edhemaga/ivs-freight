import { Subject } from 'rxjs';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Animations
import { animate, style, transition, trigger } from '@angular/animations';

//Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Constants
import { NoteConfigConstants } from './utils/constants/note-config.constants';

//Components
import { TaAppTooltipV2Component } from 'src/app/shared/components/app-tooltip-v2/ta-app-tooltip-v2.component';

//Models
import { NoteColors } from './models/note-colors.model';
import { NoteActiveOptions } from './models/note-active-options.model';

//Enums
import { NoteSelectedColorStringEnum } from './enums/note-selected-color-string.enum';
import { NoteDefaultStringEnum } from './enums/note-default-string.enum';

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
    @Input() value: string;
    @Input() range: Range;
    @Input() selectionTaken: Selection;
    @Input() selectedEditor: any; //leave this any
    @Input() isExpanded: boolean;
    @Input() parking: boolean = false;
    @Input() popoverNote: boolean = false;
    @Input() isVisibleArrow: boolean = true;
    @Input() type: string;

    @Output() stopBlurRemoveTimeout = new EventEmitter();

    //Colors
    public selectedPaternColor: string = NoteSelectedColorStringEnum.GRAY_RGB;
    public activeOptions: NoteActiveOptions = {
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
    }; //leave it like this don't move to constants because it won't work
    public containerColors: NoteColors[];
    public selectedColorName: NoteColors;
    private defaultColorSet: boolean = false;

    //Timeout
    private slowTimeout: any; //leave this any
    private lastSavedIndex: number = -1;

    //Pattern
    public showCollorPattern: boolean;
    public closedPattern: boolean = false;
    public hoveringArrowPicker: boolean = false;

    private destroy$ = new Subject<void>();

    constructor() {}

    ngOnInit(): void {
        this.setContainerColors();
    }

    private filterContainersColor(): void {
        this.containerColors.sort((a) => {
            if (
                a[NoteDefaultStringEnum.COLOR] != this.selectedColorName.color
            ) {
                return 1;
            }
            return -1;
        });
    }

    public executeEditor(action: string, color?: string, indx?: number): void {
        this.stopBlurRemoveTimeout.emit();
        if (indx || indx === 0)
            this.selectedColorName = this.containerColors[indx];

        if (this.range) {
            this.selectionTaken.removeAllRanges();
            this.selectionTaken.addRange(this.range);
        }
        if (action !== NoteDefaultStringEnum.FORE_COLOR2) {
            this.showCollorPattern = false;
            this.activeOptions[action] = !this.activeOptions[action];
            if (!this.activeOptions[action]) {
                if (this.value.replace('<br>', '') === '')
                    this.selectionTaken.removeAllRanges();

                document.execCommand(
                    NoteDefaultStringEnum.CSS_STYLE,
                    false,
                    NoteDefaultStringEnum.FALSE
                );
                document.execCommand(action, false, null);
            } else {
                this.focusElement();
                document.execCommand(action, false, null);
            }
        } else {
            if (this.lastSavedIndex != indx) this.filterContainersColor();

            this.lastSavedIndex = indx;
            setTimeout(() => {
                this.focusElement();
                setTimeout(() => {
                    this.focusElement();
                    this.selectedPaternColor = color;
                    document.execCommand(
                        NoteDefaultStringEnum.FORE_COLOR2,
                        false,
                        color
                    );
                    this.defaultColorSet = true;
                });
            });
        }
    }

    public focusElement(): void {
        if (this.selectedEditor) this.selectedEditor.focus();
        else document.getElementById(NoteDefaultStringEnum.MAIN_EDITOR).focus();
    }

    public checkActiveItems(): void {
        for (const act in this.activeOptions) {
            this.activeOptions[act] = document.queryCommandState(act);

            clearTimeout(this.slowTimeout);
            this.slowTimeout = setTimeout(() => {
                const findedColor = this.containerColors.find(
                    (item) =>
                        item.color ===
                        document.queryCommandValue(
                            NoteDefaultStringEnum.FORE_COLOR
                        )
                );
                this.selectedColorName = findedColor
                    ? findedColor
                    : {
                          color: NoteSelectedColorStringEnum.GRAY_RGB,
                          name: NoteSelectedColorStringEnum.GRAY,
                      };
            }, 200);
            this.selectedPaternColor = document.queryCommandValue(
                NoteDefaultStringEnum.FORE_COLOR
            );
        }

        if (this.defaultColorSet) {
            this.containerColors.map((col, indx) => {
                if (col.color === this.selectedPaternColor) {
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

    public togglePattern(): void {
        this.showCollorPattern = !this.showCollorPattern;

        if (!this.showCollorPattern)
            setTimeout(() => {
                this.closedPattern = false;
            }, 300);
        else this.closedPattern = true;
    }

    public hoveringArrow(value: boolean): void {
        this.hoveringArrowPicker = value;
    }

    private setContainerColors(): void {
        this.containerColors =
            this.type === NoteDefaultStringEnum.DARK
                ? [...NoteConfigConstants.NoteDarkColors]
                : [...NoteConfigConstants.NoteLightColors];

        this.selectedColorName = {
            name: this.containerColors[0].name,
            color: this.containerColors[0].color,
        };
    }

    public ngOnDestroy(): void {
        this.showCollorPattern = false;
        this.destroy$.next();
        this.destroy$.complete();
    }
}
