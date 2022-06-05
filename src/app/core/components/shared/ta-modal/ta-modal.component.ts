import { distinctUntilChanged } from 'rxjs/operators';
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
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UploadFile } from '../ta-modal-upload/ta-upload-file/ta-upload-file.component';
import { TaInputService } from '../ta-input/ta-input.service';
import { DropZoneConfig } from '../ta-modal-upload/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileService } from '../ta-modal-upload/ta-upload-file.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('widthGrow', [
        state('closed', style({
            transform: 'scale(0)',
        })),
        state('open', style({
          transform: 'scale(1)',
        })),
        transition('closed => open', animate(250))
    ]),
]
})
export class TaModalComponent implements OnInit, OnDestroy {
  @Input() modalTitle: string;
  @Input() editName: string;
  @Input() editData: any;
  @Input() customClass: string;
  @Input() isModalValid: boolean;

  @Input() disableDelete: boolean = false;
  @Input() isDeactivated: boolean = false;
  @Input() isDNU: boolean = false;
  @Input() isBFB: boolean = false;

  @Input() specificCaseModalName: boolean = false;

  @Input() dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'files', // files | logo
    dropZoneSvg: 'assets/svg/common/ic_modal_upload_dropzone.svg',
    dropZoneAvailableFiles: 'application/pdf, application/png, application/jpg',
    multiple: true,
  };

  @Output() modalActionTypeEmitter: EventEmitter<{
    action: string;
    bool: boolean;
  }> = new EventEmitter<{ action: string; bool: boolean }>(null);

  private timeout = null;

  public saveSpinnerVisibility: boolean = false;
  public deleteSpinnerVisibility: boolean = false;

  // Drag & Drop properties
  public isDropZoneVisible: boolean = false;
  public dropZoneCounter: number = 0;
  public isLeaveZone: boolean = false;
  public hoverZone: boolean = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService,
    private uploadFileService: TaUploadFileService,
    private inputService: TaInputService
  ) {}

  ngOnInit(): void {
    this.modalService.modalStatus$
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((data: { name: string; status: boolean }) => {
        if (data?.name === 'deactivate') {
          if (data.status !== null || data.status !== undefined) {
            this.isDeactivated = data.status;
          }
          this.isDeactivated = !this.isDeactivated;
        }
      });

    this.uploadFileService.visibilityDropZone$
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.dragOver();
          this.dragLeave();
        }
      });

    this.modalService.modalSpinner$
      .pipe(untilDestroyed(this))
      .subscribe((data: { action: string; status: boolean }) => {
        switch (data.action) {
          case 'delete': {
            this.deleteSpinnerVisibility = data.status;
            break;
          }
          default: {
            this.saveSpinnerVisibility = data.status;
            break;
          }
        }
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.ngbActiveModal.close();
          clearTimeout(this.timeout);
        }, 1000);
      });
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

  public onAction(action: string) {
    switch (action) {
      case 'save': {
        this.modalActionTypeEmitter.emit({ action: action, bool: false });
        break;
      }
      case 'close': {
        this.modalActionTypeEmitter.emit({ action: action, bool: false });
        $('.pac-container').remove();
        this.timeout = setTimeout(() => {
          this.ngbActiveModal.dismiss();
          clearTimeout(this.timeout);
        }, 50);
        this.uploadFileService.visibilityDropZone(false);
        this.uploadFileService.uploadFiles(null);
        break;
      }
      case 'deactivate': {
        this.isDeactivated = !this.isDeactivated;
        this.modalActionTypeEmitter.emit({
          action: action,
          bool: this.isDeactivated,
        });
        break;
      }
      case 'dnu': {
        this.isDNU = !this.isDNU;
        this.modalActionTypeEmitter.emit({ action: action, bool: this.isDNU });
        break;
      }
      case 'bfb': {
        this.isBFB = !this.isBFB;
        this.modalActionTypeEmitter.emit({ action: action, bool: this.isBFB });
        break;
      }
      case 'delete': {
        this.modalActionTypeEmitter.emit({ action: action, bool: false });
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

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
