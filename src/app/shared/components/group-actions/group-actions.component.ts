import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { InspectionDomainGroup } from '../../../domain/inspectiondomaingroup';

/**
 * Reusable component for group action buttons
 * Implements single responsibility principle
 */
@Component({
  selector: 'app-group-actions',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslatePipe],
  template: `
    <div class="flex gap-2 justify-center" *ngIf="group">
      <!-- Edit Group Button -->
      <p-button
        [label]="'actions.edit' | translate"
        severity="info"
        size="small"
        [disabled]="disabled"
        (onClick)="onEditGroup()"
        [loading]="isLoading"
        icon="pi pi-pencil"
      >
      </p-button>

      <!-- Manage Children Button -->
      <p-button
        [label]="'actions.manageChildren' | translate"
        severity="success"
        size="small"
        [disabled]="disabled"
        (onClick)="onManageChildren()"
        [loading]="isLoading"
        icon="pi pi-users"
      >
      </p-button>

      <!-- Add Child Button (Alternative approach) -->
      <p-button
        *ngIf="showAddChildButton"
        [label]="'actions.addChild' | translate"
        severity="help"
        size="small"
        [disabled]="disabled"
        (onClick)="onAddChild()"
        [loading]="isLoading"
        icon="pi pi-plus"
      >
      </p-button>
    </div>
  `,
  styles: [
    `
      .flex {
        display: flex;
      }
      .gap-2 {
        gap: 0.5rem;
      }
      .justify-center {
        justify-content: center;
      }
    `,
  ],
})
export class GroupActionsComponent {
  @Input() group: InspectionDomainGroup | null = null;
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() showAddChildButton: boolean = false;

  @Output() editGroup = new EventEmitter<InspectionDomainGroup>();
  @Output() manageChildren = new EventEmitter<InspectionDomainGroup>();
  @Output() addChild = new EventEmitter<InspectionDomainGroup>();

  onEditGroup(): void {
    if (this.group) {
      this.editGroup.emit(this.group);
    }
  }

  onManageChildren(): void {
    if (this.group) {
      this.manageChildren.emit(this.group);
    }
  }

  onAddChild(): void {
    if (this.group) {
      this.addChild.emit(this.group);
    }
  }
}
