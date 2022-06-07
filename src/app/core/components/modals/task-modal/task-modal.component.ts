import { CreateTodoCommand } from './../../../../../../appcoretruckassist/model/createTodoCommand';
import { Validators } from '@angular/forms';
import { TaskModalService } from './task-modal.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TodoModalResponse } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public taskForm: FormGroup;

  public resDepartments: any[] = [];

  public comments: any[] = [];
  public documents: any[] = [];

  public selectedDepartments: any[] = [];
  public selectedCompanyUsers: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
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
      departmentIds: [null],
      companyUserIds: [null, Validators.required],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.taskForm.reset();
        break;
      }
      case 'save': {
        if (this.taskForm.invalid) {
          this.inputService.markInvalid(this.taskForm);
          return;
        }
        if (this.editData) {
          this.updateTaskById(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addTask();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        this.deleteTaskById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });
        break;
      }
      default: {
        break;
      }
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
    console.log(event);
  }

  private updateTaskById(id: number) {}

  private addTask() {
    const { departmentIds, deadline, companyUserIds, ...form } = this.taskForm.value;
    const newData: CreateTodoCommand = {
      ...form,
      deadline: new Date(deadline).toISOString(),
      departmentIds: this.selectedDepartments,
      companyUserIds: this.selectedCompanyUsers,
    };
    console.log(newData);
    this.taskModalService
      .addTask(this.taskForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Task successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Task can't be added.", 'Error:');
        },
      });
  }

  private deleteTaskById(id: number) {}

  private editTask(id: number) {}

  private getTaskDropdowns() {
    this.taskModalService
      .getTaskDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: TodoModalResponse) => {
          this.resDepartments = res.departments;
        },
        error: () => {
          this.notificationService.error("Can't get task dropdowns.", 'Error:');
        },
      });
  }

  public onSelectDropDown(event: any[], action: string) {
    switch (action) {
      case 'res-department': {
        if (event) {
          this.inputService.changeValidators(
            this.taskForm.get('departmentIds'),
            false
          );
          this.selectedDepartments = event.map(item => item.id);
        } else {
          this.inputService.changeValidators(
            this.taskForm.get('departmentIds')
          );
        }
        break;
      }
      case 'assign-task': {
        if (event) {
          this.inputService.changeValidators(
            this.taskForm.get('companyUserIds'),
            false
          );
          this.selectedCompanyUsers = event.map(item => item.id);
        } else {
          this.inputService.changeValidators(
            this.taskForm.get('companyUserIds')
          );
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
