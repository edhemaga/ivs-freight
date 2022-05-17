import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaModalComponent {
  @Input() modalTitle: string;
  @Input() editName: string;
  @Input() editData: any;
  @Input() customClass: string;
  @Input() isModalValid: boolean;

  @Input() isDeactivated: boolean = false;
  @Input() isDNU: boolean = false;
  @Input() isBFB: boolean = false;

  @Input() specificCaseModalName: boolean = false;

  @Output() modalActionTypeEmitter: EventEmitter<{action: string, bool: boolean}> =
  new EventEmitter<{action: string, bool: boolean}>(null);

  private timeout = null;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  public onAction(action: string) {
    switch (action) {
      case 'save': {
        this.modalActionTypeEmitter.emit({action: action, bool: false});
        break;
      }
      case 'close': {
        this.modalActionTypeEmitter.emit({action: action, bool: false});
        $('.pac-container').remove();
        this.timeout = setTimeout(() => {
          this.ngbActiveModal.dismiss();
          clearTimeout(this.timeout);
        }, 150);
        break;
      }
      case 'deactivate': {
        this.isDeactivated = !this.isDeactivated;
        this.modalActionTypeEmitter.emit({action: action, bool: this.isDeactivated});
        break;
      }
      case 'dnu': {
        this.isDNU = !this.isDNU;
        this.modalActionTypeEmitter.emit({action: action, bool: this.isDNU});
        break;
      }
      case 'bfb': {
        this.isBFB = !this.isBFB;
        this.modalActionTypeEmitter.emit({action: action, bool: this.isBFB});
        break;
      }
      case 'delete': {
        this.modalActionTypeEmitter.emit({action: action, bool: false});
        break;
      }
      default: {
        break;
      }
    }
  }
}