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

     $(document).on('dragover','.modal-animation', () => {
       console.log("DRAGOVER")
     })

     $(document).on('dragleave','.modal-animation', () => {
      console.log("DRAG LEAVE")
    })
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

  ngOnDestroy(): void {}
}


  // Drag and drop zone for chat events
  // @HostListener('dragover', ['$event'])
  // public onDragOver(evt) {
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   console.log("DRAG OVER")
  //   console.log(evt);
  // }

  // @HostListener('dragleave', ['$event'])
  // public onDragLeave(evt) {
  //   evt.preventDefault();
  //   evt.stopPropagation();
  //   if (!evt.fromElement) {
  //    console.log("DRAG LEAVE")
  //    console.log(evt);
  //   }
  // }