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
  public isLeaveZone: boolean = false

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService,
    private inputService: TaInputService
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
            event.stopPropagation();
            if(this.dropZoneCounter < 1 && !this.isLeaveZone) {
              this.dropZoneCounter++;
            }
            this.isDropZoneVisible = true;
            console.log("DRAG OVER ", this.dropZoneCounter)
          });

          $(document).on('dragleave', '.modal', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const timeout = setTimeout(() => {
              this.dropZoneCounter--;

              // if(!this.isLeaveZone) {
              //   this.dropZoneCounter--;
              // }
  
              if (this.dropZoneCounter < 1) {
                this.isDropZoneVisible = false;
                this.dropZoneCounter = 0;
                this.isLeaveZone = false;
              }
  
              console.log("DRAG LEAVE ", this.dropZoneCounter)
              clearTimeout(timeout);
            }, 50)
        
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
        this.inputService.triggerInvalidRoutingNumber$.next(false);
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
    console.log(event);
    this.modalService.uploadDocumentsSubject$.next(event);
  }

  public onDropBackground(event: { action: string; value: boolean }) {
   
    switch (event.action) {
      case 'dragleave': {
     
        this.dropZoneCounter--;
        this.isLeaveZone = true
        console.log("DRAG LEAVE ZONE ", this.dropZoneCounter)
        break;
      }
      case 'drop': {
        if (!event.value) {
          this.isDropZoneVisible = false;
          this.dropZoneCounter = 0;
        }
        console.log(event);
        break;
      }
      case 'dragover': {
        // console.log(event);
        this.dropZoneCounter = 2;
        console.log("DRAG OVER ZONE ", this.dropZoneCounter)
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
