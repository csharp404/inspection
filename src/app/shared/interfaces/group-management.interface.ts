/**
 * Enhanced interfaces for group and child management
 * Provides type safety and clear data contracts
 */

export interface GroupState {
  isLoading: boolean;
  error: string | null;
  selectedGroupId: string | null;
  lastUpdated: Date;
}

export interface ChildFormState {
  isVisible: boolean;
  isEditMode: boolean;
  selectedChild: InspectionDomain | null;
  parentGroup: InspectionDomainGroup | null;
}

export interface GroupActionEvent {
  type: 'add' | 'edit' | 'delete' | 'manageChildren';
  groupId: string;
  data?: any;
}

export interface ChildActionEvent {
  type: 'add' | 'edit' | 'delete';
  groupId: string;
  childId?: string;
  data?: InspectionDomain;
}

// Re-export existing interfaces for convenience
export {
  InspectionDomainGroup,
  InspectionDomain,
} from '../../../domain/inspectiondomaingroup';
