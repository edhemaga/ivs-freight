import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HttpResponse,
    HttpEvent,
    HttpParameterCodec,
    HttpContext,
} from '@angular/common/http';
import { Configuration } from 'appcoretruckassist';
import {
    BASE_PATH,
    COLLECTION_FORMATS,
} from '../../../../../../../appcoretruckassist/variables';
@Injectable({ providedIn: 'root' })
export class SettingsIntegrationService {
    defaultHeaders;
    configuration;
    constructor(
        protected httpClient: HttpClient,
        @Optional() @Inject(BASE_PATH) basePath: string | string[],
        @Optional() configuration: Configuration
    ) {}
    // public getTruckList(
    //     active?: number,
    //     pageIndex?: number,
    //     pageSize?: number,
    //     companyId?: number,
    //     sort?: string,
    //     search?: string,
    //     search1?: string,
    //     search2?: string
    // ): Observable<any> {
    //     return this.truckService.apiTruckListGet(
    //         active,
    //         pageIndex,
    //         pageSize,
    //         companyId,
    //         sort,
    //         search,
    //         search1,
    //         search2
    //     );
    // }
    /**
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiTruckModalGet(
        observe?: 'body',
        reportProgress?: boolean,
        options?: {
            httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json';
            context?: HttpContext;
        }
    ): Observable<any>;
    public apiTruckModalGet(
        observe?: 'response',
        reportProgress?: boolean,
        options?: {
            httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json';
            context?: HttpContext;
        }
    ): Observable<HttpResponse<any>>;
    public apiTruckModalGet(
        observe?: 'events',
        reportProgress?: boolean,
        options?: {
            httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json';
            context?: HttpContext;
        }
    ): Observable<HttpEvent<any>>;
    public apiTruckModalGet(
        observe: any = 'body',
        reportProgress: boolean = false,
        options?: {
            httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json';
            context?: HttpContext;
        }
    ): Observable<any> {
        let localVarHeaders = this.defaultHeaders;

        let localVarCredential: string | undefined;
        // authentication (bearer) required
        localVarCredential = this.configuration.lookupCredential('bearer');
        if (localVarCredential) {
            localVarHeaders = localVarHeaders.set(
                'Authorization',
                'Bearer ' + localVarCredential
            );
        }

        let localVarHttpHeaderAcceptSelected: string | undefined =
            options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json',
            ];
            localVarHttpHeaderAcceptSelected =
                this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set(
                'Accept',
                localVarHttpHeaderAcceptSelected
            );
        }

        let localVarHttpContext: HttpContext | undefined =
            options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (
                this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)
            ) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/truck/modal`;
        return this.httpClient.request<any>(
            'get',
            `${this.configuration.basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress,
            }
        );
    }
}
