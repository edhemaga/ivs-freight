import { CreateTodoCommand } from './../../../../../../appcoretruckassist/model/createTodoCommand';
import { Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  EnumValue,
  TodoModalResponse,
  TodoResponse,
  UpdateTodoCommand,
} from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';
import { TodoTService } from '../../to-do/state/todo.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public taskForm: FormGroup;

  public resDepartments: any[] = [];
  public resCompanyUsers: any[] = [];

  public selectedDepartments: any[] = [];
  public selectedCompanyUsers: any[] = [];

  public taskStatus: EnumValue = null;
  public comments: any[] = [];
  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private todoService: TodoTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getTaskDropdowns();
    console.log(this.editData);
    if (this.editData) {
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
      companyUserIds: [null],
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

  private updateTaskById(id: number) {
    const { departmentIds, deadline, companyUserIds, ...form } =
      this.taskForm.value;

    const newData: UpdateTodoCommand = {
      id: id,
      ...form,
      deadline: convertDateToBackend(deadline),
      departmentIds: this.selectedDepartments
        ? this.selectedDepartments.map((item) => item.id)
        : [],
      companyUserIds: this.selectedCompanyUsers
        ? this.selectedCompanyUsers.map((item) => item.id)
        : [],
      status: this.taskStatus.name,
    };

    this.todoService
      .updateTodo(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Task successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Task can't be updated.", 'Error:');
        },
      });
  }

  private addTask() {
    const { departmentIds, deadline, companyUserIds, ...form } =
      this.taskForm.value;

    const newData: CreateTodoCommand = {
      ...form,
      deadline: convertDateToBackend(deadline),
      departmentIds: this.selectedDepartments
        ? this.selectedDepartments.map((item) => item.id)
        : [],
      companyUserIds: this.selectedCompanyUsers
        ? this.selectedCompanyUsers.map((item) => item.id)
        : [],
    };

    this.todoService
      .addTodo(newData)
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

  private deleteTaskById(id: number) {
    this.todoService
      .deleteTodoById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Task successfully deleted.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () => {
          this.notificationService.error("Task can't be deleted.", 'Error:');
        },
      });
  }

  private editTask(id: number) {
    this.todoService
      .getTodoById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: TodoResponse) => {
          this.taskForm.patchValue({
            title: res.title,
            description: res.description,
            url: res.url,
            deadline: convertDateFromBackend(res.deadline),
            departmentIds: null,
            companyUserIds: null,
            note: res.note,
          });
          this.selectedDepartments = res.departments;
          this.selectedCompanyUsers = res.todoUsers.map((item) => {
            return {
              id: item.companyUserId,
              name: item.firstName.concat(' ', item.lastName),
            };
          });
          this.comments = res.comments;
          this.taskStatus = res.status;
        },
        error: () => {
          this.notificationService.error("Can't get task.", 'Error:');
        },
      });
  }

  private getTaskDropdowns() {
    this.todoService
      .getTodoDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: TodoModalResponse) => {
          this.resDepartments = res.departments;
          this.resCompanyUsers = res.companyUsers.map((item) => {
            return {
              id: item.id,
              name: item.fullName,
            };
          });
        },
        error: () => {
          this.notificationService.error("Can't get task dropdowns.", 'Error:');
        },
      });
  }

  public onSelectDropDown(event: any[], action: string) {
    switch (action) {
      case 'res-department': {
        this.selectedDepartments = event;
        break;
      }
      case 'assign-task': {
        this.selectedCompanyUsers = event;
        console.log(this.selectedCompanyUsers);
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
