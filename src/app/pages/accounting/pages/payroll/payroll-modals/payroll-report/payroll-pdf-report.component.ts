import {
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
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
import { CaModalComponent, eColor, ePosition, eUnit } from 'ca-components';
import { eGeneralActions, eSharedString } from '@shared/enums';

// pipes
import { SafeHtmlPipe } from '@shared/pipes';

// constants
import { PayrollPdfReportConstants } from '@pages/accounting/pages/payroll/payroll-modals/payroll-report/utils/constants';

// models
import { PayrollModal } from '@pages/accounting/pages/payroll/state/models';

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
    providers: [SafeHtmlPipe],
})
export class PayrollPdfReportComponent implements OnInit {
    @Input() editData: PayrollModal;
    @ViewChild('contentIframe') iframeRef!: ElementRef;

    // zoom
    public zoomLevel = PayrollPdfReportConstants.ZOOM_LEVEL;
    public minZoom = PayrollPdfReportConstants.MIN_ZOOM;
    public maxZoom = PayrollPdfReportConstants.MAX_ZOOM;
    public zoomStep = PayrollPdfReportConstants.ZOOM_STEP;

    // svg routes
    public svgRoutes = PayrollSvgRoutes;

    // enums
    public eColor = eColor;
    public ePosition = ePosition;
    public eGeneralActions = eGeneralActions;

    // pdf
    public pdfReport: { downloadUrl: string; html: string };

    public isLoading = true;

    constructor(
        private renderer: Renderer2,

        // services
        private payrollService: PayrollService,

        // modules
        private ngbActiveModal: NgbActiveModal,

        // pipes
        private safeHtmlPipe: SafeHtmlPipe
    ) {}

    ngOnInit(): void {
        this.getReportById();
    }

    private getReportById(): void {
        const { id, type } = this.editData?.data;

        if (!id || !type) return;

        this.payrollService.generateReport(id, type).subscribe({
            next: (pdfReport) => {
                const html = this.safeHtmlPipe.transform(pdfReport.html);
                this.pdfReport = {
                    ...pdfReport,
                    html,
                };

                this.isLoading = false;
            },
        });
    }

    public onIframeLoad(): void {
        const iframe = this.iframeRef?.nativeElement as HTMLIFrameElement;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc || !doc.body) return;

        const height = doc.body.offsetHeight + 80;

        this.renderer.setStyle(iframe, eSharedString.HEIGHT, `${height}px`);
    }

    public onDownloadReportClick(): void {
        const { downloadUrl } = this.pdfReport;

        if (!downloadUrl) return;

        const { type, id } = this.editData?.data;

        const filename = `Report-${type}-${id}.pdf`;

        this.payrollService.downloadPayrollPdfReport(downloadUrl, filename);
    }

    public onCloseModalClick(): void {
        this.ngbActiveModal.close();
    }

    public onZoomClick(change: number): void {
        const newZoom = this.zoomLevel + change * this.zoomStep;

        this.zoomLevel = Math.min(
            this.maxZoom,
            Math.max(this.minZoom, newZoom)
        );
    }
}
