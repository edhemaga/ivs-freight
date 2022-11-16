import { Injectable } from '@angular/core';
import { UserService } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class UserModalService {
    constructor(private userService: UserService) {}
}
