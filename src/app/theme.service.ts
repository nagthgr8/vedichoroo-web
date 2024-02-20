// theme.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<string>('dark');
  currentTheme$ = this.currentThemeSubject.asObservable();

  toggleTheme() {
    const newTheme = this.currentThemeSubject.value === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    this.currentThemeSubject.next(newTheme);
  }
}
