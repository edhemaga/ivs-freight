import { CreateTodoCommand } from './../../../../../../appcoretruckassist/model/createTodoCommand';
import { Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  CommentResponse,
  CreateCommentCommand,
  EnumValue,
  SignInResponse,
  TodoModalResponse,
  TodoResponse,
  UpdateCommentCommand,
  UpdateTodoCommand,
} from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';
import { TodoTService } from '../../to-do/state/todo.service';
import { AuthQuery } from '../../authentication/state/auth.query';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import { CommentsService } from 'src/app/core/services/comments/comments.service';
import { urlRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  providers: [ModalService, FormService],
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

  public companyUser: SignInResponse = null;

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private todoService: TodoTService,
    private commentsService: CommentsService,
    private notificationService: NotificationService,
    private authQuery: AuthQuery,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getTaskDropdowns();
    // -------------- PRODUCTION MODE -----------------
    // this.companyUser = this.authQuery.getEntity(1);

    // -------------- DEVELOP MODE --------------------
    this.companyUser = JSON.parse(localStorage.getItem('user'));

    if (this.editData) {
      this.editTask(this.editData.id);
    }
  }

  private createForm() {
    this.taskForm = this.formBuilder.group({
      title: [null],
      description: [null],
      url: [null, [...urlRegex]],
      deadline: [null],
      departmentIds: [null],
      companyUserIds: [null],
      note: [null],
    });

    this.formService.checkFormChange(this.taskForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
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

  public changeCommentsEvent(comments: ReviewCommentModal) {
    switch (comments.action) {
      case 'delete': {
        this.deleteComment(comments);
        break;
      }
      case 'add': {
        this.addComment(comments);
        break;
      }
      case 'update': {
        this.updateComment(comments);
        break;
      }
      default: {
        break;
      }
    }
  }

  public createComment(event: any) {
    if (this.comments.some((item) => item.isNewReview)) {
      return;
    }
    // ------------------------ PRODUCTION MODE -----------------------------
    // this.comments.unshift({
    //   companyUser: {
    //     fullName: this.companyUser.firstName.concat(' ', this.companyUser.lastName),
    //     avatar: 'https://picsum.photos/id/237/200/300',
    //   },
    //   commentContent: '',
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   isNewReview: true,
    // });

    // -------------------------- DEVELOP MODE --------------------------------
    this.comments.unshift({
      companyUser: {
        fullName: this.companyUser.firstName.concat(
          ' ',
          this.companyUser.lastName
        ),
        avatar: 'https://picsum.photos/id/237/200/300',
      },
      commentContent: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: true,
    });
  }

  private addComment(comments: ReviewCommentModal) {
    const comment: CreateCommentCommand = {
      entityTypeCommentId: 1,
      entityTypeId: this.editData.id,
      commentContent: comments.data.commentContent,
    };

    this.commentsService
      .createComment(comment)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.comments = comments.sortData.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                id: res.id,
              };
            }
            return item;
          });
          this.notificationService.success(
            'Comment successfully created.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Comment can't be created.", 'Error:');
        },
      });
  }

  private updateComment(comments: ReviewCommentModal) {
    this.comments = comments.sortData;

    const comment: UpdateCommentCommand = {
      id: comments.data.id,
      commentContent: comments.data.commentContent,
    };

    this.commentsService
      .updateComment(comment)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Comment successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Comment cant't be updated.",
            'Error:'
          );
        },
      });
  }

  private deleteComment(comments: ReviewCommentModal) {
    this.comments = comments.sortData;
    this.commentsService
      .deleteCommentById(comments.data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Comment successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Comment cant't be deleted.",
            'Error:'
          );
        },
      });
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
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
          this.comments = res.comments.map((item: CommentResponse) => {
            return {
              ...item,
              companyUser: {
                ...item.companyUser,
                avatar: 'https://picsum.photos/id/237/200/300',
              },
            };
          });
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
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
