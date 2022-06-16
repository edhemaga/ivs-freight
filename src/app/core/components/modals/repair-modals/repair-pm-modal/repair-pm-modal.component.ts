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
    title: string,
    miles: number
  ): FormGroup {
    return this.formBuilder.group({
      isChecked: [isChecked],
      title: [title],
      miles: [miles],
    });
  }

  public addPMS(event: any) {
    if (event) {
      this.pms.push(this.createPMS(false, 'Engine Oil & Filter', 15000));
    }
  }

  public removeTrucksPM(id: number) {
    this.pms.removeAt(id);
  }

  public onModalAction(data: { action: string; bool: boolean }) {}

  public addPM(event) {
    this.addPMS(true);
  }
}
