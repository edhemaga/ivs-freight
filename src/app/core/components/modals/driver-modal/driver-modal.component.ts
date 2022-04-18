import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaInputService } from '../../shared/ta-input/ta-input.service';

const left = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
    optional: true,
  }),
  group([
    query(
      ':enter',
      [
        style({ transform: 'translateX(-15%)', height: '0px', opacity: 0 }),
        animate(
          '.2s ease-in-out',
          style({ transform: 'translateX(0%)', height: '*', opacity: 1 })
        ),
      ],
      {
        optional: true,
      }
    ),
    query(
      ':leave',
      [
        style({ transform: 'translateX(0%)', height: '*', opacity: 1 }),
        animate(
          '.2s ease-in-out',
          style({ transform: 'translateX(10%)', height: '0px', opacity: 0 })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
];

const right = [
  query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
    optional: true,
  }),
  group([
    query(
      ':enter',
      [
        style({ transform: 'translateX(15%)', height: '0px', opacity: 0 }),
        animate(
          '.2s ease-in-out',
          style({ transform: 'translateX(0%)', height: '*', opacity: 1 })
        ),
      ],
      {
        optional: true,
      }
    ),
    query(
      ':leave',
      [
        style({ transform: 'translateX(0%)', height: '*', opacity: 1 }),
        animate(
          '.2s ease-in-out',
          style({ transform: 'translateX(-15%)', height: '0px', opacity: 0 })
        ),
      ],
      {
        optional: true,
      }
    ),
  ]),
];

@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss'],
  animations: [
    trigger('animationTabsModal', [
      transition(':increment', right),
      transition(':decrement', left),
    ]),
  ],
})
export class DriverModalComponent implements OnInit {
  public driverForm: FormGroup;
  public tabs: any[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Pay',
    },
    {
      id: 3,
      name: 'Additional',
    },
  ];
  public selectedTab = 1;
  public prev = -1;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public onModalAction(action: string) {
    if (action === 'close') {
      this.driverForm.reset();
    } else {
      if (this.driverForm.invalid) {
        console.log(this.driverForm.value);
        this.inputService.markInvalid(this.driverForm);
        return;
      }
      this.ngbActiveModal.close();
    }
  }

  public createForm() {
    this.driverForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      ssn: [null, [Validators.required]],
      note: [null],
      dateOfBirth: [null, [Validators.required]],
      offDutyLocations: [null], //Array<CreateOffDutyLocationCommand> | null;
      isOwner: [false],
      ownerId: [null], //number | null;
      ownerType: [null], //OwnerType;
      ein: [null],
      bussinesName: [null],
      city: [null],
      state: [null],
      address: [null, [Validators.required]],
      country: [null],
      zipCode: [null],
      stateShortName: [null],
      addressUnit: [null],
      bankId: [null], //number | null;
      account: [null],
      routing: [null],
      payroll: [false],
      payType: [null],
      mailNotification: [false],
      phoneCallNotification: [false],
      smsNotification: [false],
      solo: [null],
      team: [null],
      commissionSolo: [25],
      commissionTeam: [25],
      twic: [false],
      twicExpDate: [null],
      fuelCard: [null],
      emergencyContactName: [null],
      emergencyContactPhone: [null],
      emergencyContactRelationship: [null],
    });
  }

  public tabChange(event: any) {
    if (event.id > this.selectedTab) {
      this.prev = this.selectedTab;
      this.selectedTab = event.id;
    } else {
      this.prev = this.selectedTab;
      this.selectedTab = event.id;
    }
  }
}
