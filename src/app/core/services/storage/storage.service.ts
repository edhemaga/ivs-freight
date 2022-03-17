import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Attachment, File} from "../../model/attachment";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) {
  }

  public uploadFiles(
    guid: string,
    entity: string,
    id: number,
    files: File[],
    property?: string,
    propertyGuid?: string,
  ) {
    const data: Attachment = {
      guid,
      table: entity,
      id,
      property,
      propertyGuid,
      files
    };

    return this.http.post(environment.API_ENDPOINT + 'storage/b64/upload', data);
  }

  public deleteFiles(files: any) {
    return this.http.put(environment.API_ENDPOINT + 'storage/multiple/delete', files);
  }

  public getDocuments() {
    return this.http.get(environment.API_ENDPOINT + `storage/document/list/1/${environment.perPage}`);
  }
}
