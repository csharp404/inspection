import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('ar');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: any } = {};

  private languages: Language[] = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  constructor() {
    this.loadTranslations();
  }

  private async loadTranslations() {
    try {
      const enTranslations = await import('../locale/en.json');
      const arTranslations = await import('../locale/ar.json');

      this.translations = {
        en: enTranslations,
        ar: arTranslations,
      };
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  getLanguages(): Language[] {
    return this.languages;
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setLanguage(languageCode: string) {
    this.currentLanguageSubject.next(languageCode);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
  }

  translate(key: string): string {
    const currentLang = this.getCurrentLanguage();
    const translation = this.getNestedTranslation(
      this.translations[currentLang],
      key
    );
    return translation || key;
  }

  private getNestedTranslation(obj: any, key: string): string {
    return key.split('.').reduce((o, k) => o && o[k], obj);
  }

  // Initialize language from localStorage
  initializeLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (
      savedLanguage &&
      this.languages.some((lang) => lang.code === savedLanguage)
    ) {
      this.setLanguage(savedLanguage);
    }
  }

  // Check if current language is RTL
  isRTL(): boolean {
    return this.getCurrentLanguage() === 'ar';
  }
}
