import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
  TrackByFunction,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  InspectionDomainGroup,
  InspectionDomain,
} from '../../domain/inspectiondomaingroup';
import { InspectionDomainGroupService } from '../../services/inspectiondomaingroupservice';
import { TranslationService } from '../../services/translation.service';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/treetable';
import { InspectionDomainFormComponent } from '../inspection-domain-form/inspection-domain-form.component';

interface Column {
  field: string;
  header: string;
  filterMatchMode?: string;
}

@Component({
  selector: 'table-style-demo',
  templateUrl: './table-style-demo.component.html',
  standalone: true,
  imports: [
    TreeTableModule,
    CommonModule,
    BadgeModule,
    TranslatePipe,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    PaginatorModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,
    CheckboxModule,
    InspectionDomainFormComponent,
  ],
  providers: [InspectionDomainGroupService],
})
export class TableStyleDemoComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('tt') tt!: TreeTable;

  // Reactive state management
  private destroy$ = new Subject<void>();

  inspectionDomainGroups!: InspectionDomainGroup[];
  treeData: TreeNode[] = [];
  filteredTreeData: TreeNode[] = [];
  filterMode = 'lenient';
  statusFilter = 'all'; // 'all', 'active', 'inactive'

  // Pagination properties
  first = 0;
  rows = 5;
  totalRecords = 0;

  // Form properties
  showForm = false;
  editMode = false;
  selectedGroup: InspectionDomainGroup | null = null;

  // Inline dialog properties
  showGroupUpdateDialog = false;
  showChildAddDialog = false;
  selectedGroupForUpdate: InspectionDomainGroup | null = null;
  selectedGroupForChild: InspectionDomainGroup | null = null;

  // Forms
  groupUpdateForm: FormGroup;
  childAddForm: FormGroup;

  filterModes = [
    { label: 'Lenient', value: 'lenient' },
    { label: 'Strict', value: 'strict' },
  ];

  statusFilterOptions: { label: string; value: string }[] = [];

  cols: Column[] = [
    {
      field: 'groupName',
      header: 'table.groupName',
      filterMatchMode: 'contains',
    },
    { field: 'status', header: 'table.status', filterMatchMode: 'contains' },
    {
      field: 'totalChildren',
      header: 'table.totalChildren',
      filterMatchMode: 'equals',
    },
    {
      field: 'activeChildren',
      header: 'table.activeChildren',
      filterMatchMode: 'equals',
    },
    {
      field: 'inactiveChildren',
      header: 'table.inactiveChildren',
      filterMatchMode: 'equals',
    },
    {
      field: 'suspendedChildren',
      header: 'table.suspendedChildren',
      filterMatchMode: 'equals',
    },
    {
      field: 'actions',
      header: 'actions.title',
      filterMatchMode: 'contains',
    },
  ];

  constructor(
    private inspectionDomainGroupService: InspectionDomainGroupService,
    private translationService: TranslationService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    // Initialize group update form
    this.groupUpdateForm = this.fb.group({
      groupNameEn: ['', [Validators.required, Validators.minLength(2)]],
      groupNameAr: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [true],
    });

    // Initialize child add form
    this.childAddForm = this.fb.group({
      inspectionDomainEn: ['', [Validators.required, Validators.minLength(2)]],
      inspectionDomainAr: ['', [Validators.required, Validators.minLength(2)]],
      activationStatus: [true],
      numberOfValidQualifiedEntities: [0, [Validators.min(0)]],
      numberOfValidQualifiedInspectors: [0, [Validators.min(0)]],
      numberOfPendingQualificationRequests: [0, [Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadDemoData();
    this.updateStatusFilterOptions();
  }

  ngAfterViewInit() {
    // No custom filter setup needed here anymore as filtering is handled manually
  }

  loadDemoData() {
    this.inspectionDomainGroupService
      .getInspectionDomainGroups()
      .then((data) => {
        this.inspectionDomainGroups = data;
        this.transformToTreeData();
        this.cd.markForCheck();
      });
  }

  refreshSearch() {
    // Refresh the tree data when language changes to update searchable text
    this.transformToTreeData();
    this.updateStatusFilterOptions();
    this.cd.markForCheck();
  }

  updateStatusFilterOptions() {
    const currentLang = this.translationService.getCurrentLanguage();
    this.statusFilterOptions = [
      {
        label: currentLang === 'ar' ? 'الكل' : 'All',
        value: 'all',
      },
      {
        label: currentLang === 'ar' ? 'نشط' : 'Active',
        value: 'active',
      },
      {
        label: currentLang === 'ar' ? 'غير نشط' : 'Inactive',
        value: 'inactive',
      },
    ];
  }

  transformToTreeData() {
    this.treeData = this.inspectionDomainGroups.map((group) =>
      this.createTreeNode(group)
    );
    this.filteredTreeData = [...this.treeData];
    this.totalRecords = this.treeData.length;
  }

  getRowClass(rowData: any) {
    return {
      '!bg-primary !text-primary-contrast': !rowData.isActive,
    };
  }

  getRowStyle(rowData: any) {
    if (!rowData.isActive) {
      return { fontWeight: 'bold', fontStyle: 'italic' };
    }
    return {};
  }

  getStatusSeverity(rowData: any) {
    if (!rowData.isActive) return 'danger';
    else return 'success'; // Active status should always be green
  }

  getActiveStatusText(rowData: any): string {
    return rowData.isActive ? 'status.active' : 'status.inactive';
  }

  getChildActiveStatusText(child: InspectionDomain): string {
    return child.activationStatus ? 'status.active' : 'status.inactive';
  }

  getGroupName(rowData: any): string {
    const currentLang = this.translationService.getCurrentLanguage();
    return currentLang === 'ar' ? rowData.groupNameAr : rowData.groupNameEn;
  }

  getInspectionDomainName(child: InspectionDomain): string {
    const currentLang = this.translationService.getCurrentLanguage();
    return currentLang === 'ar'
      ? child.inspectionDomainAr
      : child.inspectionDomainEn;
  }

  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchValue = target.value.toLowerCase();

    // Filter only at parent level (groups), not children
    this.filterByParent(searchValue);
  }

  onColumnFilter(event: Event, field: string, filterMatchMode: string): void {
    const target = event.target as HTMLInputElement;
    const searchValue = target.value.toLowerCase();

    // Filter only at parent level (groups), not children
    this.filterByParent(searchValue, field);
  }

  filterByParent(searchValue: string, field?: string): void {
    if (!searchValue && this.statusFilter === 'all') {
      // If no search value and no status filters, show all groups
      this.filteredTreeData = this.inspectionDomainGroups.map((group) =>
        this.createTreeNode(group)
      );
    } else {
      // Filter groups based on search criteria
      this.filteredTreeData = this.inspectionDomainGroups
        .filter((group) => {
          let matchesSearch = true;
          let matchesStatusFilter = true;

          // Apply text search filter
          if (searchValue) {
            if (field === 'groupName' || !field) {
              // Search in group name (both Arabic and English)
              matchesSearch =
                group.groupNameAr.toLowerCase().includes(searchValue) ||
                group.groupNameEn.toLowerCase().includes(searchValue);
            } else if (field === 'status') {
              // Search in status (both Arabic and English)
              const statusText = (
                group.isActive ? 'نشط active' : 'غير نشط inactive'
              ).toLowerCase();
              matchesSearch = statusText.includes(searchValue);
            } else {
              // Search in other fields (numeric)
              matchesSearch = String(group[field as keyof typeof group] || '')
                .toLowerCase()
                .includes(searchValue);
            }
          }

          // Apply radio button status filter
          if (this.statusFilter === 'active' && !group.isActive) {
            matchesStatusFilter = false;
          }
          if (this.statusFilter === 'inactive' && group.isActive) {
            matchesStatusFilter = false;
          }

          return matchesSearch && matchesStatusFilter;
        })
        .map((group) => this.createTreeNode(group));
    }

    this.totalRecords = this.filteredTreeData.length;
    this.first = 0; // Reset to first page when filtering
    this.cd.markForCheck();
  }

  createTreeNode(group: InspectionDomainGroup): any {
    return {
      data: {
        id: group.id,
        groupName: this.getGroupName(group),
        groupNameAr: group.groupNameAr,
        groupNameEn: group.groupNameEn,
        status: this.getActiveStatusText(group),
        isActive: group.isActive,
        totalChildren: group.totalChildren,
        activeChildren: group.activeChildren,
        inactiveChildren: group.inactiveChildren,
        suspendedChildren: group.suspendedChildren,
        type: 'group',
      },
      children:
        group.children?.map((child) => ({
          data: {
            groupName: this.getInspectionDomainName(child),
            groupNameAr: child.inspectionDomainAr,
            groupNameEn: child.inspectionDomainEn,
            status: this.getChildActiveStatusText(child),
            isActive: child.activationStatus,
            totalChildren: child.numberOfValidQualifiedEntities,
            activeChildren: child.numberOfValidQualifiedInspectors,
            inactiveChildren: child.numberOfPendingQualificationRequests,
            suspendedChildren: 0,
            type: 'domain',
          },
        })) || [],
    };
  }

  getSearchPlaceholder(): string {
    const currentLang = this.translationService.getCurrentLanguage();
    return currentLang === 'ar' ? 'البحث العام' : 'Global Search';
  }

  getColumnFilterPlaceholder(field: string): string {
    const currentLang = this.translationService.getCurrentLanguage();
    const fieldTranslations: { [key: string]: { ar: string; en: string } } = {
      groupName: { ar: 'البحث في اسم المجموعة', en: 'Filter by Group Name' },
      status: { ar: 'البحث في الحالة', en: 'Filter by Status' },
      totalChildren: {
        ar: 'البحث في إجمالي الفروع',
        en: 'Filter by Total Children',
      },
      activeChildren: {
        ar: 'البحث في الفروع النشطة',
        en: 'Filter by Active Children',
      },
      inactiveChildren: {
        ar: 'البحث في الفروع غير النشطة',
        en: 'Filter by Inactive Children',
      },
      suspendedChildren: {
        ar: 'البحث في الفروع المعلقة',
        en: 'Filter by Suspended Children',
      },
    };

    const translation = fieldTranslations[field] || {
      ar: `البحث في ${field}`,
      en: `Filter by ${field}`,
    };
    return currentLang === 'ar' ? translation.ar : translation.en;
  }

  onStatusFilterChange(event: any): void {
    console.log('Status filter changed to:', this.statusFilter);
    console.log('Event:', event);
    // Re-apply the parent filter logic to update the filteredTreeData based on dropdown selection
    this.filterByParent(''); // Pass empty string to re-evaluate all groups against status filters
    console.log('Filtered data count:', this.filteredTreeData.length);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.cd.markForCheck();
  }

  onRowClick(rowData: any, event: Event): void {
    // Don't prevent default here, let the TreeTable handle row expansion
  }

  // Direct button handlers that bypass any TreeTable interference
  handleEditClick(rowData: any, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onUpdateGroup(rowData);
  }

  handleAddChildClick(rowData: any, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.onAddChild(rowData);
  }

  getPaginatedData(): TreeNode[] {
    const start = this.first;
    const end = this.first + this.rows;
    return this.filteredTreeData.slice(start, end);
  }

  // Form methods
  onAddNew() {
    this.editMode = false;
    this.selectedGroup = null;
    this.showForm = true;
  }

  onEditGroup(groupData: any) {
    console.log('onEditGroup called with:', groupData);
    // Find the original group data by ID
    const originalGroup = this.inspectionDomainGroups.find(
      (g) => g.id === groupData.id
    );

    if (originalGroup) {
      this.editMode = true;
      this.selectedGroup = originalGroup;
      this.showForm = true;
    } else {
      console.error('Group not found for edit:', groupData.id);
    }
  }

  onFormSave(groupData: InspectionDomainGroup) {
    console.log('onFormSave called with:', groupData);
    console.log('Edit mode:', this.editMode);

    if (this.editMode) {
      console.log('Updating existing group...');
      this.inspectionDomainGroupService
        .updateInspectionDomainGroup(groupData)
        .then((updatedGroup) => {
          console.log('Group updated successfully:', updatedGroup);
          this.loadDemoData();
          this.showForm = false;
        })
        .catch((error) => {
          console.error('Error updating group:', error);
        });
    } else {
      console.log('Adding new group...');
      this.inspectionDomainGroupService
        .addInspectionDomainGroup(groupData)
        .then((newGroup) => {
          console.log('Group added successfully:', newGroup);
          this.loadDemoData();
          this.showForm = false;
        })
        .catch((error) => {
          console.error('Error adding group:', error);
        });
    }
  }

  onFormCancel() {
    this.showForm = false;
    this.selectedGroup = null;
    this.editMode = false;
  }

  onFormVisibleChange(visible: boolean) {
    this.showForm = visible;
    if (!visible) {
      this.selectedGroup = null;
      this.editMode = false;
    }
  }

  // Inline dialog methods
  onUpdateGroup(groupData: any) {
    // Find the original group data by ID
    const originalGroup = this.inspectionDomainGroups.find(
      (g) => g.id === groupData.id
    );

    if (originalGroup) {
      this.selectedGroupForUpdate = originalGroup;
      this.groupUpdateForm.patchValue({
        groupNameEn: originalGroup.groupNameEn,
        groupNameAr: originalGroup.groupNameAr,
        isActive: originalGroup.isActive,
      });
      this.showGroupUpdateDialog = true;
      // Force change detection
      this.cd.detectChanges();
    } else {
      console.error('Group not found for update:', groupData.id);
    }
  }

  onAddChild(groupData: any) {
    // Find the original group data by ID
    const originalGroup = this.inspectionDomainGroups.find(
      (g) => g.id === groupData.id
    );

    if (originalGroup) {
      this.selectedGroupForChild = originalGroup;
      this.childAddForm.reset({
        inspectionDomainEn: '',
        inspectionDomainAr: '',
        activationStatus: true,
        numberOfValidQualifiedEntities: 0,
        numberOfValidQualifiedInspectors: 0,
        numberOfPendingQualificationRequests: 0,
      });
      this.showChildAddDialog = true;
      // Force change detection
      this.cd.detectChanges();
    } else {
      console.error('Group not found for child add:', groupData.id);
    }
  }

  // Form save methods
  onGroupUpdateSave() {
    if (this.groupUpdateForm.valid && this.selectedGroupForUpdate) {
      const formData = this.groupUpdateForm.value;
      const updatedGroup: InspectionDomainGroup = {
        ...this.selectedGroupForUpdate,
        groupNameEn: formData.groupNameEn,
        groupNameAr: formData.groupNameAr,
        isActive: formData.isActive,
      };

      this.inspectionDomainGroupService
        .updateInspectionDomainGroup(updatedGroup)
        .then((result) => {
          console.log('Group updated successfully:', result);
          this.loadDemoData();
          this.showGroupUpdateDialog = false;
          this.selectedGroupForUpdate = null;
        })
        .catch((error) => {
          console.error('Error updating group:', error);
        });
    } else {
      this.markFormGroupTouched(this.groupUpdateForm);
    }
  }

  onChildAddSave() {
    if (this.childAddForm.valid && this.selectedGroupForChild) {
      const formData = this.childAddForm.value;
      const newChild: InspectionDomain = {
        groupForInspectionDomainEn: this.selectedGroupForChild.groupNameEn,
        groupForInspectionDomainAr: this.selectedGroupForChild.groupNameAr,
        inspectionDomainEn: formData.inspectionDomainEn,
        inspectionDomainAr: formData.inspectionDomainAr,
        activationStatus: formData.activationStatus,
        numberOfValidQualifiedEntities: formData.numberOfValidQualifiedEntities,
        numberOfValidQualifiedInspectors:
          formData.numberOfValidQualifiedInspectors,
        numberOfPendingQualificationRequests:
          formData.numberOfPendingQualificationRequests,
      };

      this.inspectionDomainGroupService
        .addChildToGroup(this.selectedGroupForChild.id!, newChild)
        .then((result) => {
          console.log('Child added successfully:', result);
          this.loadDemoData();
          this.showChildAddDialog = false;
          this.selectedGroupForChild = null;
        })
        .catch((error) => {
          console.error('Error adding child:', error);
        });
    } else {
      this.markFormGroupTouched(this.childAddForm);
    }
  }

  // Helper method to mark form as touched
  markFormGroupTouched(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  // Dialog cancel methods
  onGroupUpdateCancel() {
    this.showGroupUpdateDialog = false;
    this.selectedGroupForUpdate = null;
    this.groupUpdateForm.reset();
  }

  onChildAddCancel() {
    this.showChildAddDialog = false;
    this.selectedGroupForChild = null;
    this.childAddForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
