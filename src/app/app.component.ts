import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableStyleDemoComponent } from './table-style-demo/table-style-demo.component';
import { DropdownModule } from 'primeng/dropdown';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService, Language } from '../services/translation.service';

@Component({
  selector: 'app-root',
  imports: [
    TableStyleDemoComponent,
    FormsModule,
    DropdownModule,
    TranslatePipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild(TableStyleDemoComponent) tableComponent!: TableStyleDemoComponent;

  title = 'InspectionDomainsCatalog';
  languages: Language[] = [];
  selectedLanguage: Language | null = null;

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.languages = this.translationService.getLanguages();
    this.translationService.initializeLanguage();

    // Set initial selected language
    const currentLang = this.translationService.getCurrentLanguage();
    this.selectedLanguage =
      this.languages.find((lang) => lang.code === currentLang) ||
      this.languages[0];

    // Set initial document direction for Arabic
    document.documentElement.dir = this.translationService.isRTL()
      ? 'rtl'
      : 'ltr';
    document.documentElement.lang = currentLang;
  }

  onLanguageChange(event: any) {
    if (event.value) {
      this.translationService.setLanguage(event.value);
      this.selectedLanguage =
        this.languages.find((lang) => lang.code === event.value) || null;

      // Update document direction for RTL support
      document.documentElement.dir = this.translationService.isRTL()
        ? 'rtl'
        : 'ltr';
      document.documentElement.lang = event.value;

      // Refresh search data in table component
      if (this.tableComponent) {
        this.tableComponent.refreshSearch();
      }
    }
  }
}
