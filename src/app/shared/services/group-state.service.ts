import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  InspectionDomainGroup,
  InspectionDomain,
  GroupState,
  ChildFormState,
  GroupActionEvent,
  ChildActionEvent,
} from '../interfaces/group-management.interface';
import { InspectionDomainGroupService } from '../../../services/inspectiondomaingroupservice';

/**
 * Centralized state management service for group and child operations
 * Implements reactive state management with RxJS
 */
@Injectable({
  providedIn: 'root',
})
export class GroupStateService {
  // State subjects
  private readonly _groups$ = new BehaviorSubject<InspectionDomainGroup[]>([]);
  private readonly _groupState$ = new BehaviorSubject<GroupState>({
    isLoading: false,
    error: null,
    selectedGroupId: null,
    lastUpdated: new Date(),
  });
  private readonly _childFormState$ = new BehaviorSubject<ChildFormState>({
    isVisible: false,
    isEditMode: false,
    selectedChild: null,
    parentGroup: null,
  });

  // Public observables
  public readonly groups$ = this._groups$.asObservable();
  public readonly groupState$ = this._groupState$.asObservable();
  public readonly childFormState$ = this._childFormState$.asObservable();

  // Computed observables
  public readonly activeGroups$ = this.groups$.pipe(
    map((groups) => groups.filter((group) => group.isActive))
  );

  public readonly selectedGroup$ = combineLatest([
    this.groups$,
    this._groupState$,
  ]).pipe(
    map(([groups, state]) =>
      state.selectedGroupId
        ? groups.find((g) => g.id === state.selectedGroupId)
        : null
    )
  );

  constructor(private groupService: InspectionDomainGroupService) {
    this.loadInitialData();
  }

  /**
   * Load initial data from service
   */
  private loadInitialData(): void {
    this.setLoading(true);
    this.groupService
      .getInspectionDomainGroups()
      .pipe(
        tap((groups) => {
          this._groups$.next(groups);
          this.updateLastModified();
        }),
        catchError((error) => {
          this.setError('Failed to load groups: ' + error.message);
          return [];
        })
      )
      .subscribe(() => this.setLoading(false));
  }

  /**
   * Add a new group
   */
  addGroup(group: InspectionDomainGroup): Observable<InspectionDomainGroup> {
    this.setLoading(true);
    return this.groupService.addInspectionDomainGroup(group).pipe(
      tap((newGroup) => {
        const currentGroups = this._groups$.value;
        this._groups$.next([...currentGroups, newGroup]);
        this.updateLastModified();
      }),
      catchError((error) => {
        this.setError('Failed to add group: ' + error.message);
        throw error;
      }),
      tap(() => this.setLoading(false))
    );
  }

  /**
   * Update an existing group
   */
  updateGroup(group: InspectionDomainGroup): Observable<InspectionDomainGroup> {
    this.setLoading(true);
    return this.groupService.updateInspectionDomainGroup(group).pipe(
      tap((updatedGroup) => {
        const currentGroups = this._groups$.value;
        const index = currentGroups.findIndex((g) => g.id === updatedGroup.id);
        if (index !== -1) {
          currentGroups[index] = updatedGroup;
          this._groups$.next([...currentGroups]);
          this.updateLastModified();
        }
      }),
      catchError((error) => {
        this.setError('Failed to update group: ' + error.message);
        throw error;
      }),
      tap(() => this.setLoading(false))
    );
  }

  /**
   * Add a child to a specific group
   */
  addChildToGroup(
    groupId: string,
    child: InspectionDomain
  ): Observable<InspectionDomainGroup> {
    this.setLoading(true);
    const currentGroups = this._groups$.value;
    const group = currentGroups.find((g) => g.id === groupId);

    if (!group) {
      this.setError('Group not found');
      this.setLoading(false);
      throw new Error('Group not found');
    }

    // Add child to group
    const updatedGroup = {
      ...group,
      children: [...(group.children || []), child],
      totalChildren: (group.totalChildren || 0) + 1,
      activeChildren: child.activationStatus
        ? (group.activeChildren || 0) + 1
        : group.activeChildren || 0,
      inactiveChildren: !child.activationStatus
        ? (group.inactiveChildren || 0) + 1
        : group.inactiveChildren || 0,
    };

    return this.updateGroup(updatedGroup);
  }

  /**
   * Update a child within a group
   */
  updateChildInGroup(
    groupId: string,
    childIndex: number,
    updatedChild: InspectionDomain
  ): Observable<InspectionDomainGroup> {
    this.setLoading(true);
    const currentGroups = this._groups$.value;
    const group = currentGroups.find((g) => g.id === groupId);

    if (!group || !group.children || childIndex >= group.children.length) {
      this.setError('Child not found');
      this.setLoading(false);
      throw new Error('Child not found');
    }

    const oldChild = group.children[childIndex];
    const updatedGroup = {
      ...group,
      children: group.children.map((child, index) =>
        index === childIndex ? updatedChild : child
      ),
      activeChildren: this.calculateActiveChildren([
        ...group.children,
        updatedChild,
      ]),
      inactiveChildren: this.calculateInactiveChildren([
        ...group.children,
        updatedChild,
      ]),
    };

    return this.updateGroup(updatedGroup);
  }

  /**
   * Delete a child from a group
   */
  deleteChildFromGroup(
    groupId: string,
    childIndex: number
  ): Observable<InspectionDomainGroup> {
    this.setLoading(true);
    const currentGroups = this._groups$.value;
    const group = currentGroups.find((g) => g.id === groupId);

    if (!group || !group.children || childIndex >= group.children.length) {
      this.setError('Child not found');
      this.setLoading(false);
      throw new Error('Child not found');
    }

    const updatedGroup = {
      ...group,
      children: group.children.filter((_, index) => index !== childIndex),
      totalChildren: (group.totalChildren || 0) - 1,
      activeChildren: this.calculateActiveChildren(
        group.children.filter((_, index) => index !== childIndex)
      ),
      inactiveChildren: this.calculateInactiveChildren(
        group.children.filter((_, index) => index !== childIndex)
      ),
    };

    return this.updateGroup(updatedGroup);
  }

  /**
   * Show child form for adding/editing
   */
  showChildForm(
    parentGroup: InspectionDomainGroup,
    child?: InspectionDomain
  ): void {
    this._childFormState$.next({
      isVisible: true,
      isEditMode: !!child,
      selectedChild: child || null,
      parentGroup,
    });
  }

  /**
   * Hide child form
   */
  hideChildForm(): void {
    this._childFormState$.next({
      isVisible: false,
      isEditMode: false,
      selectedChild: null,
      parentGroup: null,
    });
  }

  /**
   * Set selected group
   */
  setSelectedGroup(groupId: string | null): void {
    const currentState = this._groupState$.value;
    this._groupState$.next({
      ...currentState,
      selectedGroupId: groupId,
    });
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.loadInitialData();
  }

  // Private helper methods
  private setLoading(isLoading: boolean): void {
    const currentState = this._groupState$.value;
    this._groupState$.next({
      ...currentState,
      isLoading,
      error: isLoading ? null : currentState.error,
    });
  }

  private setError(error: string): void {
    const currentState = this._groupState$.value;
    this._groupState$.next({
      ...currentState,
      error,
      isLoading: false,
    });
  }

  private updateLastModified(): void {
    const currentState = this._groupState$.value;
    this._groupState$.next({
      ...currentState,
      lastUpdated: new Date(),
    });
  }

  private calculateActiveChildren(children: InspectionDomain[]): number {
    return children.filter((child) => child.activationStatus).length;
  }

  private calculateInactiveChildren(children: InspectionDomain[]): number {
    return children.filter((child) => !child.activationStatus).length;
  }
}
