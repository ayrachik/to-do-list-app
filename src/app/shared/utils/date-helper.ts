import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateHelper {

  constructor() { }

  public areSameMonths(date1: Date, date2: Date): boolean {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  }
}
