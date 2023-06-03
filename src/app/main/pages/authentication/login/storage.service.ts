import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageSub = new Subject<string>();


  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    sessionStorage.setItem(key, data);
    this.storageSub.next('changed');
  }

  removeItem(key) {
    sessionStorage.removeItem(key);
    this.storageSub.next('changed');
  }
}
