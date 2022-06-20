import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { convertNumberInThousandSep } from 'src/app/core/utils/methods.calculations';
import { PmTService } from '../../../repair/state/pm.service.ts.service';

@Component({
  selector: 'app-repair-pm-modal',
  templateUrl: './repair-pm-modal.component.html',
  styleUrls: ['./repair-pm-modal.component.scss'],
})
export class RepairPmModalComponent implements OnInit {
  @Input() editData: any;
  public PMform: FormGroup;
  public pmTruckList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private pmService: PmTService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData) {
      this.editData = {
        ...this.editData,
      };
    }
  }

  private createForm() {
    this.PMform = this.formBuilder.group({
      PMs: this.formBuilder.array([]),
    });
  }

  public get PMs(): FormArray {
    return this.PMform.get('PMs') as FormArray;
  }

  private createPMS(
    isChecked: boolean = false,
    svg: string,
    title: string,
    miles: string
  ): FormGroup {
    return this.formBuilder.group({
      isChecked: [isChecked],
      svg: [svg],
      title: [title],
      miles: [miles],
    });
  }

  public addPMs(event: any) {
    if (event) {
      this.PMs.push(
        this.createPMS(
          false,
          'assets/svg/common/repair-pm/ic_battery.svg',
          'Engine Oil & Filter',
          convertNumberInThousandSep(15000)
        )
      );
    }
  }

  public removePMs(id: number) {
    this.PMs.removeAt(id);
  }

  public onModalAction(data: { action: string; bool: boolean }) {}
}
