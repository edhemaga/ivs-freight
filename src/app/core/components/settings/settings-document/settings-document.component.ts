import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SettingsCompanyService } from '../state/company-state/settings-company.service';
import { CompanyStore } from '../state/company-state/company-settings.store';

@Component({
    selector: 'app-settings-document',
    templateUrl: './settings-document.component.html',
    styleUrls: ['./settings-document.component.scss'],
})
export class SettingsDocumentComponent implements OnInit {
    private destroy$ = new Subject<void>();
    constructor(private settingsCompanyService: SettingsCompanyService, private companyStore: CompanyStore) {}

    public documents: any = [];
    public showDropzone: boolean = true;

    ngOnInit() {
        this.companyDocumentsGet();
    }

    public companyDocumentsGet() {
        this.settingsCompanyService
        .getCompanyDocuments()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res)=>{
            console.log(this.companyStore, 'companyStore')
            this.documents = res?.files;
        });
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        let newData: any = {
            files: documents,
            filesForDeleteIs: []
        }

        this.settingsCompanyService
        .addCompanyDocuments(newData)
        .pipe(takeUntil(this.destroy$))
        .subscribe();

        // switch (event.action) {
        //     case 'add': {
        //         this.driverForm
        //             .get('files')
        //             .patchValue(JSON.stringify(event.files));
        //         break;
        //     }
        //     case 'delete': {
        //         this.driverForm
        //             .get('files')
        //             .patchValue(
        //                 event.files.length ? JSON.stringify(event.files) : null
        //             );
        //         if (event.deleteId) {
        //             this.filesForDelete.push(event.deleteId);
        //         }

        //         this.fileModified = true;
        //         break;
        //     }
        //     default: {
        //         break;
        //     }
        // }
    }
}
