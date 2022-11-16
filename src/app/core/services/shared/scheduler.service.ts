import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SchedulerService {
    public emitEventUpdate: EventEmitter<boolean> = new EventEmitter();

    constructor(private http: HttpClient) {}

    public createEvent(event: any) {
        return this.http.post(environment.API_ENDPOINT + 'scheduler', event);
    }

    /**
     * Delete Event By Id API v2
     *
     * @param Id Number
     */
    public deleteEvent(id: number) {
        return this.http.delete(environment.API_ENDPOINT + 'scheduler/' + id);
    }

    public updateEvent(id: number, event: any) {
        return this.http.put(
            environment.API_ENDPOINT + 'scheduler/' + id,
            event
        );
    }

    /**
     * Get All Events API v2
     */
    public getEvents(name: string) {
        /* return this.http.get(environment.API_ENDPOINT + 'scheduler/list/all'); */
        /* return this.http.get(environment.API_ENDPOINT + `company/${serviceType}/list/all/1/100`); */
        return this.http.get(environment.API_ENDPOINT + `${name}/list/all`);
    }

    /**
     * Get Event By Id API v2
     */
    public getEventById(id: number) {
        return this.http.get(environment.API_ENDPOINT + `scheduler/${id}/all`);
    }
}
