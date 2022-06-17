import { Injectable } from "@angular/core";
import { CalendarStore } from "./calendar.store";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { SharedService } from "src/app/core/services/shared/shared.service";

@Injectable({ providedIn: "root" })
export class CalendarStoreService {
  constructor(private calendarStore: CalendarStore, private http: HttpClient, private sharedService: SharedService) {}

}
