import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ModalService } from './modal.service';
import { UploadFile } from '../ta-upload-files/ta-upload-file/ta-upload-file.component';
import { DropZoneConfig } from '../ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('widthGrow', [
      state(
        'closed',
        style({
          transform: 'scale(0)',
        })
      ),
      state(
        'open',
        style({
          transform: 'scale(1)',
        })
      ),
      transition('closed => open', animate(200)),
    ]),
  ],
})
export class TaModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() modalTitle: string;
  @Input() editName: string;
  @Input() editData: any;
  @Input() confirmationData: any;
  @Input() headerSvg: string;
  @Input() saveAndAddNew: boolean;
  @Input() customClass: string;
  @Input() isModalValid: boolean;
  @Input() disableFooter: boolean;
  @Input() disableDelete: boolean;
  @Input() isDeactivated: boolean;
  @Input() isDNU: boolean;
  @Input() isBFB: boolean;
  @Input() resendEmail: boolean;
  @Input() map: boolean;
  @Input() topDivider: boolean = true;
  @Input() bottomDivider: boolean = false;

  @Input() specificCaseModalName: boolean;

  @Input() dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'files', // files | image | media
    dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
    dropZoneAvailableFiles: 'application/pdf, application/png, application/jpg',
    multiple: true,
    globalDropZone: true,
  };

  @Input() tabChange: any;
  @Input() tabChangePosition: string = 'left'; // left/right

  @Output() action: EventEmitter<{
    action: string;
    bool: boolean;
  }> = new EventEmitter<{ action: string; bool: boolean }>(null);

  @Output() confirmationAction: EventEmitter<{
    data: any;
  }> = new EventEmitter<{ data: any }>(null);

  @Output() onTabHeaderChange: EventEmitter<any> = new EventEmitter<any>();

  private timeout = null;

  public saveSpinnerVisibility: boolean = false;
  public saveAddNewSpinnerVisibility: boolean = false;
  public deleteSpinnerVisibility: boolean = false;
  public resendEmailSpinnerVisibility: boolean = false;

  // Drag & Drop properties
  public isDropZoneVisible: boolean = false;
  public dropZoneCounter: number = 0;
  public isLeaveZone: boolean = false;
  public hoverZone: boolean = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService,
    private uploadFileService: TaUploadFileService
  ) {}

  ngOnInit(): void {
    this.modalService.modalStatus$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((data: { name: string; status: boolean }) => {
        switch (data?.name) {
          case 'deactivate': {
            this.isDeactivated = data.status;
            break;
          }
          case 'dnu': {
            this.isDNU = data.status;
            break;
          }
          case 'bfb': {
            this.isBFB = data.status;
            break;
          }
          default: {
            break;
          }
        }
      });

    this.uploadFileService.visibilityDropZone$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.dragOver();
          this.dragLeave();
          this.dragDrop();
        }
      });

    this.modalService.modalSpinner$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: { action: string; status: boolean; clearTimeout: boolean }) => {
          switch (data.action) {
            case 'delete': {
              this.deleteSpinnerVisibility = data.status;
              break;
            }
            case 'save and add new': {
              this.saveAddNewSpinnerVisibility = data.status;
              break;
            }
            case 'resend email': {
              this.resendEmailSpinnerVisibility = data.status;
              break;
            }
            default: {
              this.saveSpinnerVisibility = data.status;
              break;
            }
          }

          if (!['save and add new', 'resend email'].includes(data.action)) {
            if (data.clearTimeout) {
              this.onAction('close');
            } else {
              const timeout = setTimeout(() => {
                this.onAction('close');
                clearTimeout(timeout);
              }, 1200);
            }
          }
        }
      );
  }

  public dragOver() {
    $(document).on('dragover', '.modal', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (this.dropZoneCounter < 1 && !this.isLeaveZone) {
        this.dropZoneCounter++;
      }
      this.isDropZoneVisible = true;
    });
  }

  public dragLeave() {
    $(document).on('dragleave', '.modal', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.dropZoneCounter--;
        if (this.dropZoneCounter < 1) {
          this.isDropZoneVisible = false;
          this.dropZoneCounter = 0;
          this.isLeaveZone = false;
        }
        clearTimeout(this.timeout);
      }, 150);
    });
  }

  public dragDrop() {
    $(document).on('drop', '.modal', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.dropZoneCounter = 0;
        this.isDropZoneVisible = false;
        this.isLeaveZone = false;

        clearTimeout(this.timeout);
      }, 150);
    });
  }

  public onAction(action: string) {
    switch (action) {
      case 'save': {
        this.action.emit({ action: action, bool: false });
        break;
      }
      case 'save and add new': {
        this.action.emit({ action: action, bool: false });
        break;
      }
      case 'resend email': {
        this.action.emit({ action: action, bool: false });
        break;
      }
      case 'close': {
        this.action.emit({ action: action, bool: false });
        $('.pac-container').remove();
        this.ngbActiveModal.dismiss();
        this.uploadFileService.visibilityDropZone(false);
        this.uploadFileService.uploadFiles(null);
        break;
      }
      case 'deactivate': {
        this.isDeactivated = !this.isDeactivated;
        this.action.emit({
          action: action,
          bool: this.isDeactivated,
        });
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      case 'activate': {
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      case 'dnu': {
        this.isDNU = !this.isDNU;
        this.action.emit({ action: action, bool: this.isDNU });
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      case 'bfb': {
        this.isBFB = !this.isBFB;
        this.action.emit({ action: action, bool: this.isBFB });
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      case 'delete': {
        this.action.emit({ action: action, bool: false });
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      case 'multiple delete': {
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      case 'hire': {
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      case 'archive': {
        this.confirmationAction.emit(this.confirmationData);
        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: { files: UploadFile[]; action: string }) {
    this.uploadFileService.uploadFiles(event);
  }

  public onDropBackground(event: { action: string; value: boolean }) {
    switch (event.action) {
      case 'dragleave': {
        this.hoverZone = false;
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.dropZoneCounter = 1;
          this.isLeaveZone = true;
          clearTimeout(this.timeout);
        }, 40);

        break;
      }
      case 'drop': {
        if (!event.value) {
          this.isDropZoneVisible = false;
          this.dropZoneCounter = 0;
        }
        break;
      }
      case 'dragover': {
        this.dropZoneCounter = 2;
        this.hoverZone = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onTabChange(event): void {
    this.onTabHeaderChange.emit(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.timeout);
  }
}
