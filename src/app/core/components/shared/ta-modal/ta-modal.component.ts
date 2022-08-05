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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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

@UntilDestroy()
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
  @Input() modalTitle: string;
  @Input() editName: string;
  @Input() editData: any;
  @Input() saveAndAddNew: boolean;
  @Input() customClass: string;
  @Input() isModalValid: boolean;
  @Input() disableFooter: boolean = false;
  @Input() disableDelete: boolean = false;
  @Input() isDeactivated: boolean = false;
  @Input() isDNU: boolean = false;
  @Input() isBFB: boolean = false;

  @Input() specificCaseModalName: boolean = false;

  @Input() dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'files', // files | image | media
    dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
    dropZoneAvailableFiles: 'application/pdf, application/png, application/jpg',
    multiple: true,
    globalDropZone: true,
  };

  @Input() tabChange: any;

  @Output() action: EventEmitter<{
    action: string;
    bool: boolean;
  }> = new EventEmitter<{ action: string; bool: boolean }>(null);

  @Output() onTabHeaderChange: EventEmitter<any> = new EventEmitter<any>();

  private timeout = null;

  public saveSpinnerVisibility: boolean = false;
  public saveAddNewSpinnerVisibility: boolean = false;
  public deleteSpinnerVisibility: boolean = false;

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
      .pipe(distinctUntilChanged(), untilDestroyed(this))
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
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.dragOver();
          this.dragLeave();
          this.dragDrop();
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
          case 'save and add new': {
            this.saveAddNewSpinnerVisibility = data.status;
            break;
          }
          default: {
            this.saveSpinnerVisibility = data.status;
            break;
          }
        }

        if (data.action !== 'save and add new') {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(() => {
            this.ngbActiveModal.close();
            clearTimeout(this.timeout);
          }, 1000);
        }
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
      case 'close': {
        this.action.emit({ action: action, bool: false });
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
        this.action.emit({
          action: action,
          bool: this.isDeactivated,
        });
        break;
      }
      case 'dnu': {
        this.isDNU = !this.isDNU;
        this.action.emit({ action: action, bool: this.isDNU });
        break;
      }
      case 'bfb': {
        this.isBFB = !this.isBFB;
        this.action.emit({ action: action, bool: this.isBFB });
        break;
      }
      case 'delete': {
        this.action.emit({ action: action, bool: false });
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
    clearTimeout(this.timeout);
  }
}
