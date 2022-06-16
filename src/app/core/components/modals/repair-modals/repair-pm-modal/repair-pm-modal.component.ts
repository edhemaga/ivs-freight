import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-repair-pm-modal',
  templateUrl: './repair-pm-modal.component.html',
  styleUrls: ['./repair-pm-modal.component.scss'],
})
export class RepairPmModalComponent implements OnInit {
  @Input() editData: any;

  public pmForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.pmForm = this.formBuilder.group({
      pms: this.formBuilder.array([]),
    });
  }

  public get pms(): FormArray {
    return this.pmForm.get('pms') as FormArray;
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
      miles: ['1500000'],
    });
  }

  public addPMS(event: any) {
    if (event) {
      this.pms.push(
        this.createPMS(
          false,
          'assets/svg/common/repair-pm/ic_battery.svg',
          'Engine Oil & Filter',
          '15000'
        )
      );
    }
  }

  public removePMS(id: number) {
    this.pms.removeAt(id);
  }

  public onModalAction(data: { action: string; bool: boolean }) {}

  public addNewPM(event) {
    this.addPMS(true);
  }
}
