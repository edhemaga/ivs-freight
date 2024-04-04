import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TaInputService } from 'src/app/shared/components/ta-input/ta-input.service';
import {
    CommentResponse,
    CreateCommentCommand,
    EnumValue,
    SignInResponse,
    TodoModalResponse,
    TodoResponse,
    UpdateCommentCommand,
} from 'appcoretruckassist';
import { ModalService } from 'src/app/shared/components/ta-modal/modal.service';
import { TodoService } from 'src/app/pages/to-do/services/to-do.service';
import {
    ReviewCommentModal,
    TaUserReviewComponent,
} from 'src/app/shared/components/ta-user-review/ta-user-review.component';
import {
    departmentValidation,
    descriptionValidation,
    titleValidation,
    urlValidation,
} from 'src/app/shared/components/ta-input/ta-input.regex-validations';
import { Subject, takeUntil } from 'rxjs';
import { CommentsService } from '../../../../shared/services/comments.service';
import { FormService } from '../../../../shared/services/form.service';
import {
    convertDateToBackend,
    convertDateFromBackend,
} from '../../../../core/utils/methods.calculations';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from 'src/app/shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from 'src/app/shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';

@Component({
    selector: 'app-to-do-modal',
    templateUrl: './to-do-modal.component.html',
    styleUrls: ['./to-do-modal.component.scss'],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Component
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaCustomCardComponent,
        TaUploadFilesComponent,
        TaUserReviewComponent,
    ],
})
export class TodoModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public taskForm: UntypedFormGroup;

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

    public addNewAfterSave: boolean = false;

    public disableCardAnimation: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private todoService: TodoService,
        private commentsService: CommentsService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getTaskDropdowns();

        this.companyUser = JSON.parse(localStorage.getItem('user'));
    }

    private createForm() {
        this.taskForm = this.formBuilder.group({
            title: [null, [Validators.required, ...titleValidation]],
            description: [null, descriptionValidation],
            url: [null, urlValidation],
            deadline: [null],
            departmentIds: [null, [...departmentValidation]],
            departmentIdsHelper: [null, Validators.required],
            companyUserIds: [null],
            companyUserIdsHeleper: [null],
            note: [null],
            files: [null],
        });

        this.inputService.customInputValidator(
            this.taskForm.get('url'),
            'url',
            this.destroy$
        );
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save and add new': {
                if (this.taskForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.taskForm);
                    return;
                }
                this.addTask();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
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
                        close: false,
                    });
                } else {
                    this.addTask();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case 'delete': {
                this.deleteTaskById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                    close: false,
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
                },
                error: () => {},
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
            .subscribe();
    }

    private deleteComment(comments: ReviewCommentModal) {
        this.comments = comments.sortData;
        this.commentsService
            .deleteCommentById(comments.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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
        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });
        const { deadline, ...form } = this.taskForm.value;

        const newData: any = {
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

        this.todoService.updateTodo(newData).subscribe({
            next: () => {
                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: true,
                });
            },
            error: () => {
                this.modalService.setModalSpinner({
                    action: null,
                    status: false,
                    close: false,
                });
            },
        });
    }

    private addTask() {
        const { deadline, ...form } = this.taskForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
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

        this.todoService.addTodo(newData).subscribe({
            next: () => {
                if (this.addNewAfterSave) {
                    this.modalService.setModalSpinner({
                        action: 'save and add new',
                        status: false,
                        close: false,
                    });

                    this.formService.resetForm(this.taskForm);

                    this.selectedCompanyUsers = [];
                    this.selectedDepartments = [];
                    this.documents = [];
                    this.fileModified = false;
                    this.filesForDelete = [];

                    this.addNewAfterSave = false;
                } else {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                }
            },
            error: () => {
                this.modalService.setModalSpinner({
                    action: null,
                    status: false,
                    close: false,
                });
            },
        });
    }

    private deleteTaskById(id: number) {
        this.todoService
            .deleteTodoById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: false,
                        close: false,
                    });
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
                        departmentIdsHelper: res.departments.length
                            ? JSON.stringify(res.departments)
                            : null,
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

                    this.taskForm
                        .get('companyUserIdsHeleper')
                        .patchValue(
                            this.selectedCompanyUsers.length
                                ? JSON.stringify(this.selectedCompanyUsers)
                                : null
                        );

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
                    setTimeout(() => {
                        this.startFormChanges();
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
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

                    if (this.editData?.type === 'edit') {
                        this.disableCardAnimation = true;
                        this.editTask(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
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

                this.taskForm
                    .get('departmentIdsHelper')
                    .patchValue(
                        this.selectedDepartments.length
                            ? JSON.stringify(this.selectedDepartments)
                            : null
                    );

                if (this.selectedDepartments?.length) {
                    this.resCompanyUsers = [...usersForDepartment];
                } else {
                    this.resCompanyUsers = [...this.showCompanyUsers];
                }
                break;
            }
            case 'assign-task': {
                this.selectedCompanyUsers = [...event];
                this.taskForm
                    .get('companyUserIdsHeleper')
                    .patchValue(
                        this.selectedCompanyUsers.length
                            ? JSON.stringify(this.selectedCompanyUsers)
                            : null
                    );

                break;
            }
            default: {
                break;
            }
        }
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.taskForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
