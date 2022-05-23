import { Validators } from '@angular/forms';
import { TaskModalService } from './task-modal.service';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TodoModalResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public taskForm: FormGroup;

  public departments: any[] = [];

  public comments: any[] = [];
  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private taskModalService: TaskModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getTaskDropdowns();
    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editTask(this.editData.id);
    }
  }

  private createForm() {
    this.taskForm = this.formBuilder.group({
      title: [null],
      description: [null],
      url: [null, Validators.maxLength(400)],
      deadline: [null],
      departmentIds: this.formBuilder.array([]),
      companyUserIds: this.formBuilder.array([]),
      note: [null],
    });
  }

  public onModalAction(data: {action: string, bool: boolean}) {
    if (data.action === 'close') {
      this.taskForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.taskForm.invalid) {
          this.inputService.markInvalid(this.taskForm);
          return;
        }
        if (this.editData) {
          this.updateTaskById(this.editData.id);
        } else {
          this.addTask();
        }
      }

      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteTaskById(this.editData.id);
      }

      this.ngbActiveModal.close();
    }
  }

  public changeCommentsEvent(comments: { data: any[]; action: string }) {
    this.comments = [...comments.data];
    // TODO: API CREATE OR DELETE
  }

  public addComment(event: any) {
    this.comments.unshift({
      id: Math.random() * 100,
      companyUser: {
        id: Math.random() * 100,
        fullName: 'Angela Martin',
        image: 'https://picsum.photos/id/237/200/300',
        reaction: '',
      },
      comment: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: true,
    });
  }

  public onFilesEvent(event: any) {
    console.log(event)
  }

  private updateTaskById(id: number) {

  }

  private addTask() {

  }

  private deleteTaskById(id: number) {

  }

  private editTask(id: number) {

  }

  private getTaskDropdowns() {
    this.taskModalService.getTaskDropdowns().pipe(untilDestroyed(this)).subscribe({
      next: (res: TodoModalResponse) => {
        this.departments = res.departments;
      },
      error: () => {
        this.notificationService.error(
          "Can't get task dropdowns.",
          'Error:'
        );
      }
    })
  }

  ngOnDestroy():void {}
}
