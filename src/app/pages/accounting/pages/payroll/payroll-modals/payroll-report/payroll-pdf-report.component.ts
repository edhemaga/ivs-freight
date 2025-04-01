import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// services
import { PayrollService } from '@pages/accounting/pages/payroll/services';

// components
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// svg routes
import { PayrollSvgRoutes } from '@pages/accounting/pages/payroll/state/utils';

// enums
import { CaModalComponent, eColor, ePosition } from 'ca-components';
import { eGeneralActions } from '@shared/enums';

// models
import { PayrollModal } from '@pages/accounting/pages/payroll/state/models';

const ZOOM_STEP: number = 0.2;
const DEFAULT_ZOOM: number = 1;
const MAX_ZOOM: number = 2;

@Component({
    selector: 'app-payroll-report-pdf-preview',
    templateUrl: './payroll-pdf-report.component.html',
    styleUrls: ['./payroll-pdf-report.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        CaModalComponent,
        TaSpinnerComponent,
        TaAppTooltipV2Component,
    ],
})
export class PayrollPdfReportComponent implements OnInit {
    @Input() editData: PayrollModal;

    public pdfReport: { downloadUrl: string; html: string };

    public isLoading = true;

    // svg routes
    public svgRoutes = PayrollSvgRoutes;

    // enums
    public eColor = eColor;
    public ePosition = ePosition;
    public eGeneralActions = eGeneralActions;

    //////////////////////////////

    zoomLevel: number = 1;

    setZoom(level: number): void {
        this.zoomLevel = level;
    }

    public maxZoom: number = MAX_ZOOM;

    public pdfZoom: number = DEFAULT_ZOOM;

    constructor(
        private renderer: Renderer2,
        // sanitizer
        private sanitizer: DomSanitizer,
        // services
        private payrollService: PayrollService,

        // modules
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.getReportById();
    }

    private getReportById(): void {
        const { id, type } = this.editData?.data;

        if (!id || !type) {
            console.error(
                !id ? 'Report id is required' : 'Report type is required'
            );

            return;
        }

        this.payrollService.generateReport(id, type).subscribe({
            next: (pdfReport) => {
                console.log('pdfReport', pdfReport);

                const html = this.sanitizer.bypassSecurityTrustHtml(
                    pdfReport.html
                );

                this.pdfReport = {
                    ...pdfReport,
                    html,
                };

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading the PDF:', error);
            },
        });
    }

    public handleDownloadReportClick(): void {
        if (this.pdfReport?.downloadUrl) {
            const link = this.renderer.createElement('a');

            this.renderer.setAttribute(
                link,
                'href',
                this.pdfReport.downloadUrl
            );
            this.renderer.setAttribute(link, 'target', '_blank');
            this.renderer.setAttribute(
                link,
                'download',
                this.pdfReport.downloadUrl.split('/').pop() || 'report.pdf'
            );

            this.renderer.appendChild(document.body, link);

            link.click();

            this.renderer.removeChild(document.body, link);
        }
    }

    public handleCloseModalClick(): void {
        this.ngbActiveModal.close();
    }

    public zoomIn(): void {
        if (this.pdfZoom < MAX_ZOOM) {
            this.pdfZoom += ZOOM_STEP;
        }
    }

    public zoomOut(): void {
        if (this.pdfZoom > DEFAULT_ZOOM) {
            this.pdfZoom -= ZOOM_STEP;
        }
    }

    public resetZoom(): void {
        this.pdfZoom = DEFAULT_ZOOM;
    }
}
