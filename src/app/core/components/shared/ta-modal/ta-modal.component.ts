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
  public isDropZoneVisible: boolean = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService
  ) {}
  counter = 0;
  ngOnInit(): void {
    this.modalService.modalStatus$
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((data: { name: string; status: boolean }) => {
        if (data?.name === 'deactivate') {
          this.isDeactivated = !this.isDeactivated;
        }
      });

    this.modalService.documentsDropZoneSubject
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if(value) {
          $(document).on('dragover', '.modal', (event) => {
            //  console.log("DRAGOVER")
            event.preventDefault();
            if (this.counter < 2 && !this.leavingZOne) this.counter++;
            //  document.querySelector('.modal-container').classList.add('prevent-default')
            this.isDropZoneVisible = true;
            console.log(this.counter);
          });
      
          $(document).on('dragleave', '.modal', (event) => {
            console.log('DRAG LEAVE');
            this.counter--;
            if (this.counter < 0) {
              // document.querySelector('.modal-container').classList.remove('prevent-default')
              this.isDropZoneVisible = false;
              this.leavingZOne = false;
              this.counter = 0;
            }
            console.log(this.counter);
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

  public onDropFile(event) {
    console.log('DROP ', event);
  }

  public onDropBackground(event) {
    console.log('BACKGROUND ', event);
  }
  leavingZOne: boolean = false;
  dragOverHover: boolean = false;
  public leaving(event: {action: string, value: boolean}) {
    switch(event.action) {
      case 'dragleave': {
        if (!event.value && this.counter === 1) {
          this.counter--;
          this.leavingZOne = true;
          console.log('AFTER LEAVING ZONE');
          console.log(this.counter);
        }
        break;
      }
      case 'drop': {
        if (!event.value) {
          this.isDropZoneVisible = false;
          console.log('AFTER DROP ZONE');
          console.log(this.counter);
        }
        break;
      }
      case 'dragover': {
        this.dragOverHover = true;
        break;
      }
      default: {
        break;
      }
    }
  
  }

  ngOnDestroy(): void {}
}
