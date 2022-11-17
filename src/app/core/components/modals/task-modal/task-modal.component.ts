import { CreateTodoCommand } from 'appcoretruckassist/model/createTodoCommand';
import { UpdateTodoCommand } from 'appcoretruckassist/model/updateTodoCommand';
import { Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import {
    CommentResponse,
    CreateCommentCommand,
    EnumValue,
    SignInResponse,
    TodoModalResponse,
    TodoResponse,
    UpdateCommentCommand,
} from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';

import { TodoTService } from '../../to-do/state/todo.service';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import {
    departmentValidation,
    descriptionValidation,
    titleValidation,
    urlValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';
import { CommentsService } from '../../../services/comments/comments.service';
import { FormService } from '../../../services/form/form.service';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../utils/methods.calculations';

@Component({
    selector: 'app-task-modal',
    templateUrl: './task-modal.component.html',
    styleUrls: ['./task-modal.component.scss'],
    providers: [ModalService, FormService],
})
export class TaskModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public taskForm: FormGroup;

    public resDepartments: any[] = [];
    public resCompanyUsers: any[] = [];
    public showCompanyUsers: any[] = [];

    public selectedDepartments: any[] = [];
    public selectedCompanyUsers: any[] = [];

    public taskStatus: EnumValue = null;
    public comments: any[] = [];
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public companyUser: SignInResponse = null;

    public isFormDirty: boolean;

    public taskName: string = null;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private todoService: TodoTService,
        private commentsService: CommentsService,
        private notificationService: NotificationService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getTaskDropdowns();
        // -------------- PRODUCTION MODE -----------------
        // this.companyUser = this.authQuery.getEntity(1);

        // -------------- DEVELOP MODE --------------------
        this.companyUser = JSON.parse(localStorage.getItem('user'));

        if (this.editData?.type === 'edit') {
            this.editTask(this.editData.id);
        }
    }

    private createForm() {
        this.taskForm = this.formBuilder.group({
            title: [null, [Validators.required, ...titleValidation]],
            description: [null, descriptionValidation],
            url: [null, urlValidation],
            deadline: [null],
            departmentIds: [null, [...departmentValidation]],
            companyUserIds: [null],
            note: [null],
            files: [null],
        });

        this.inputService.customInputValidator(
            this.taskForm.get('url'),
            'url',
            this.destroy$
        );

        this.formService.checkFormChange(this.taskForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.taskForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.taskForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateTaskById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addTask();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                }
                break;
            }
            case 'delete': {
                this.deleteTaskById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                });
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

    public createComment() {
        if (this.comments.some((item) => item.isNewReview)) {
            return;
        }
        // ------------------------ PRODUCTION MODE -----------------------------
        // this.comments.unshift({
        //   companyUser: {
        //     fullName: this.companyUser.firstName.concat(' ', this.companyUser.lastName),
        //     avatar: this.companyUser.avatar,
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
                avatar: this.companyUser.avatar,
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
            .pipe(takeUntil(this.destroy$))
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
                    this.notificationService.error(
                        "Comment can't be created.",
                        'Error:'
                    );
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
            .pipe(takeUntil(this.destroy$))
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
            .pipe(takeUntil(this.destroy$))
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
        switch (event.action) {
            case 'add': {
                this.taskForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.taskForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateTaskById(id: number) {
        const { departmentIds, deadline, companyUserIds, ...form } =
            this.taskForm.value;
        const documents = this.documents.map((item) => {
            return item.realFile;
        });
        const newData: UpdateTodoCommand = {
            id: id,
            ...form,
            deadline: deadline ? convertDateToBackend(deadline) : null,
            departmentIds: this.selectedDepartments
                ? this.selectedDepartments.map((item) => item.id)
                : [],
            companyUserIds: this.selectedCompanyUsers
                ? this.selectedCompanyUsers.map((item) => item.id)
                : [],
            status: this.taskStatus.name,
            files: documents ? documents : this.taskForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.todoService.updateTodo(newData);
    }

    private addTask() {
        const { departmentIds, deadline, companyUserIds, ...form } =
            this.taskForm.value;

        const documents = this.documents.map((item) => {
            return item.realFile;
        });

        const newData: CreateTodoCommand = {
            ...form,
            deadline: deadline ? convertDateToBackend(deadline) : null,
            departmentIds: this.selectedDepartments
                ? this.selectedDepartments.map((item) => item.id)
                : [],
            companyUserIds: this.selectedCompanyUsers
                ? this.selectedCompanyUsers.map((item) => item.id)
                : [],
            files: documents,
        };

        this.todoService.addTodo(newData);
    }

    private deleteTaskById(id: number) {
        this.todoService
            .deleteTodoById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Task successfully deleted.',
                        'Success:'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Task can't be deleted.",
                        'Error:'
                    );
                },
            });
    }

    private editTask(id: number) {
        this.todoService
            .getTodoById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TodoResponse) => {
                    this.taskForm.patchValue({
                        title: res.title,
                        description: res.description,
                        url: res.url,
                        deadline: res.deadline
                            ? convertDateFromBackend(res.deadline)
                            : null,
                        departmentIds: null,
                        companyUserIds: null,
                        note: res.note,
                        files: res.files.length
                            ? JSON.stringify(res.files)
                            : null,
                    });
                    this.taskName = res.title;
                    this.selectedDepartments = res.departments;
                    this.selectedCompanyUsers = res.todoUsers.map((item) => {
                        return {
                            id: item.companyUserId,
                            name: item.firstName.concat(' ', item.lastName),
                        };
                    });
                    this.comments = res.comments.map(
                        (item: CommentResponse) => {
                            return {
                                ...item,
                                companyUser: {
                                    ...item.companyUser,
                                    avatar: this.companyUser.avatar,
                                },
                            };
                        }
                    );
                    this.taskStatus = res.status;
                    this.documents = res.files ? (res.files as any) : [];
                },
                error: () => {
                    this.notificationService.error("Can't get task.", 'Error:');
                },
            });
    }

    private getTaskDropdowns() {
        this.todoService
            .getTodoDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TodoModalResponse) => {
                    this.resDepartments = res.departments;
                    this.showCompanyUsers = res.companyUsers.map((item) => {
                        return {
                            id: item.id,
                            name: item.fullName,
                            departmentId: item.departmentId,
                        };
                    });
                    this.resCompanyUsers = [...this.showCompanyUsers];
                },
                error: () => {
                    this.notificationService.error(
                        "Can't get task dropdowns.",
                        'Error:'
                    );
                },
            });
    }

    public onSelectDropDown(event: any[], action: string) {
        switch (action) {
            case 'res-department': {
                this.resCompanyUsers = [...this.showCompanyUsers];
                this.selectedDepartments = [...event];
                let usersForDepartment = [];

                this.selectedDepartments.map((item) => {
                    const depUsers = this.resCompanyUsers.filter(
                        (user) => user.departmentId == item.id
                    );

                    if (depUsers?.length) {
                        usersForDepartment.push(depUsers[0]);
                    }
                });

                if (this.selectedDepartments?.length) {
                    this.resCompanyUsers = [...usersForDepartment];
                } else {
                    this.resCompanyUsers = [...this.showCompanyUsers];
                }
                break;
            }
            case 'assign-task': {
                this.selectedCompanyUsers = [...event];
                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
