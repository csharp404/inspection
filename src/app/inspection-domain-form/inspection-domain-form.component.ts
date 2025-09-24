import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { InspectionDomainGroup } from '../../domain/inspectiondomaingroup';

@Component({
  selector: 'app-inspection-domain-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    CheckboxModule,
    MessageModule,
    TranslatePipe,
  ],
  templateUrl: './inspection-domain-form.component.html',
  styleUrls: ['./inspection-domain-form.component.css'],
})
export class InspectionDomainFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() editMode: boolean = false;
  @Input() groupData: InspectionDomainGroup | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<InspectionDomainGroup>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    this.form = this.fb.group({
      groupNameEn: ['', [Validators.required, Validators.minLength(2)]],
      groupNameAr: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [true],
    });
  }

  ngOnInit() {
    if (this.editMode && this.groupData) {
      this.populateForm();
    } else {
      this.resetForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      if (this.editMode && this.groupData) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    }

    if (changes['groupData'] && this.groupData && this.editMode) {
      this.populateForm();
    }
  }

  populateForm() {
    if (this.groupData) {
      this.form.patchValue({
        groupNameEn: this.groupData.groupNameEn,
        groupNameAr: this.groupData.groupNameAr,
        isActive: this.groupData.isActive,
      });
    }
  }

  resetForm() {
    this.form.reset({
      groupNameEn: '',
      groupNameAr: '',
      isActive: true,
    });
  }

  onSave() {
    if (this.form.valid) {
      this.isSubmitting = true;

      const formData = this.form.value;
      const groupData: InspectionDomainGroup = {
        id: this.editMode && this.groupData ? this.groupData.id : undefined,
        groupNameEn: formData.groupNameEn,
        groupNameAr: formData.groupNameAr,
        isActive: formData.isActive,
        totalChildren:
          this.editMode && this.groupData ? this.groupData.totalChildren : 0,
        activeChildren:
          this.editMode && this.groupData ? this.groupData.activeChildren : 0,
        inactiveChildren:
          this.editMode && this.groupData ? this.groupData.inactiveChildren : 0,
        suspendedChildren:
          this.editMode && this.groupData
            ? this.groupData.suspendedChildren
            : 0,
        children:
          this.editMode && this.groupData ? this.groupData.children : [],
      };

      // Simulate async operation
      setTimeout(() => {
        this.save.emit(groupData);
        this.isSubmitting = false;
        this.closeDialog();
      }, 500);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.closeDialog();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  markFormGroupTouched() {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return this.getTranslation('form.errors.required');
      }
      if (control.errors['minlength']) {
        return this.getTranslation('form.errors.minLength');
      }
    }
    return '';
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }

  getDialogTitle(): string {
    return this.editMode
      ? this.getTranslation('form.editTitle')
      : this.getTranslation('form.addTitle');
  }

  getSaveButtonText(): string {
    return this.editMode
      ? this.getTranslation('form.update')
      : this.getTranslation('form.create');
  }
}
