import { distinctUntilChanged } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ModalService } from './modal.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UploadFile } from '../ta-modal-upload/ta-upload-file/ta-upload-file.component';

@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaModalComponent implements OnInit, OnDestroy {
  @Input() modalTitle: string;
  @Input() editName: string;
  @Input() editData: any;
  @Input() customClass: string;
  @Input() isModalValid: boolean;

  @Input() isDeactivated: boolean = false;
  @Input() isDNU: boolean = false;
  @Input() isBFB: boolean = false;

  @Input() specificCaseModalName: boolean = false;

  @Output() modalActionTypeEmitter: EventEmitter<{
    action: string;
    bool: boolean;
  }> = new EventEmitter<{ action: string; bool: boolean }>(null);

  private timeout = null;

  // Drag & Drop properties
  public isDropZoneVisible: boolean = false;
  public dropZoneCounter: number = 0;
  public leavingDropZone: boolean = false;
  public stopCoutingInDropZone = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.modalService.modalStatus$
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((data: { name: string; status: boolean }) => {
        if (data?.name === 'deactivate') {
          this.isDeactivated = !this.isDeactivated;
        }
      });

    this.modalService.documentsDropZoneSubject$
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          $(document).on('dragover', '.modal', (event) => {
            event.preventDefault();
            if (this.dropZoneCounter < 2 && !this.leavingDropZone) {
              this.dropZoneCounter++;
            }
            this.isDropZoneVisible = true;
          });

          $(document).on('dragleave', '.modal', (event) => {
            this.dropZoneCounter--;

            if (this.dropZoneCounter < 0) {
              this.isDropZoneVisible = false;
              this.leavingDropZone = false;
              this.dropZoneCounter = 0;
              this.stopCoutingInDropZone = true;
            }
          });
        }
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
        }, 150);
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

  public onDropFile(event: { files: UploadFile[]; action: string }) {
    this.modalService.uploadDocumentsSubject$.next(event);
  }


  public onDropBackground(event: { action: string; value: boolean }) {
    switch (event.action) {
      case 'dragleave': {
        if (!event.value && this.dropZoneCounter === 1) {
          this.dropZoneCounter--;
          this.leavingDropZone = true;
          this.stopCoutingInDropZone = false;
        }
        break;
      }
      case 'drop': {
        if (!event.value) {
          this.isDropZoneVisible = false;
        }
        break;
      }
      case 'dragover': {
        this.leavingDropZone = false;
        if(!this.stopCoutingInDropZone)
          this.dropZoneCounter ++;
        this.stopCoutingInDropZone = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
