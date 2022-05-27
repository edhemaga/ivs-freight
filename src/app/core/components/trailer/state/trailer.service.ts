import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';


import { TrailerStore } from './trailer.store';
import { TrailerResponse, TrailerService } from 'appcoretruckassist';

@Injectable({providedIn:'root'})

export class TrailerTService{
    constructor(private trailerStore:TrailerStore, private trailerService:TrailerService){}

    
    public getTrailerById(id:number):Observable<TrailerResponse>{
       return this.trailerService.apiTrailerIdGet(id);
    }
}