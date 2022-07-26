import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-medical-certificate',
  templateUrl: './medical-certificate.component.html',
  styleUrls: ['./medical-certificate.component.scss'],
})
export class MedicalCertificateComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  public medicalCertificateForm: FormGroup;

  public documents: any[] = [];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.medicalCertificateForm = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });
  }

  public onFilesAction(event: any): void {
    this.documents = event.files;
  }
}
