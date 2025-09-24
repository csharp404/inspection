# Group Management System

## Overview

This module provides a comprehensive solution for managing groups and their children with reactive state management, following Angular best practices.

## Architecture

### Components

- **EnhancedTableStyleDemoComponent**: Main table component with reactive state management
- **GroupActionsComponent**: Reusable action buttons for groups
- **InspectionDomainFormComponent**: Form for adding/editing groups
- **InspectionDomainChildFormComponent**: Form for adding/editing children

### Services

- **GroupStateService**: Centralized state management using RxJS
- **InspectionDomainGroupService**: Data service for CRUD operations

### Interfaces

- **GroupState**: State interface for group operations
- **ChildFormState**: State interface for child form operations
- **GroupActionEvent**: Event interface for group actions
- **ChildActionEvent**: Event interface for child actions

## Key Features

### 1. Reactive State Management

```typescript
// Subscribe to groups data
this.groupStateService.groups$.subscribe((groups) => {
  // Handle groups data
});

// Subscribe to loading state
this.groupStateService.groupState$.subscribe((state) => {
  this.isLoading = state.isLoading;
});
```

### 2. Dynamic Child Addition

```typescript
// Add child to specific group
onAddChild(group: InspectionDomainGroup): void {
  this.groupStateService.showChildForm(group);
}

// Handle child form save
onChildFormSave(childData: InspectionDomain): void {
  const operation = this.groupStateService.addChildToGroup(
    this.selectedGroupId,
    childData
  );

  operation.subscribe({
    next: () => console.log('Child added successfully'),
    error: (error) => console.error('Error adding child:', error)
  });
}
```

### 3. Two-Way Data Binding

```typescript
// Template binding
<app-inspection-domain-child-form
  [visible]="childFormState.isVisible"
  [editMode]="childFormState.isEditMode"
  [childData]="childFormState.selectedChild"
  [parentGroupNameEn]="childFormState.parentGroup?.groupNameEn || ''"
  (save)="onChildFormSave($event)"
  (cancel)="onChildFormCancel()"
>
</app-inspection-domain-child-form>
```

### 4. Event Handling

```typescript
// Group action events
onEditGroup(group: InspectionDomainGroup): void {
  this.selectedGroup = group;
  this.groupEditMode = true;
  this.showGroupForm = true;
}

onManageChildren(group: InspectionDomainGroup): void {
  this.groupStateService.showChildForm(group);
}
```

### 5. Performance Optimizations

```typescript
// Track by functions
trackByGroupId: TrackByFunction<InspectionDomainGroup> = (index, group) => group.id;
trackByChildIndex: TrackByFunction<InspectionDomain> = (index, child) => index;

// OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## Best Practices Implemented

### 1. Single Responsibility Principle

- Each component has a single, well-defined responsibility
- Services are focused on specific functionality

### 2. Reactive Programming

- Uses RxJS for state management
- Implements proper subscription management with takeUntil

### 3. Type Safety

- Comprehensive TypeScript interfaces
- Strict typing throughout the application

### 4. Error Handling

- Centralized error handling in services
- User-friendly error messages

### 5. Performance

- TrackBy functions for \*ngFor loops
- OnPush change detection strategy
- Lazy loading and pagination

### 6. Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility

### 7. Internationalization

- Translation service integration
- RTL language support

## Usage Examples

### Adding a New Child

```typescript
// 1. User clicks "Add Child" button
onAddChild(group: InspectionDomainGroup): void {
  this.groupStateService.showChildForm(group);
}

// 2. Child form opens with parent group context
// 3. User fills form and clicks save
onChildFormSave(childData: InspectionDomain): void {
  this.groupStateService.addChildToGroup(group.id, childData)
    .subscribe({
      next: () => {
        // Success - UI updates automatically via reactive state
        this.showSuccessMessage();
      },
      error: (error) => {
        // Error handling
        this.showErrorMessage(error);
      }
    });
}
```

### Editing an Existing Child

```typescript
// 1. User clicks edit on a child
onEditChild(group: InspectionDomainGroup, child: InspectionDomain): void {
  this.groupStateService.showChildForm(group, child);
}

// 2. Form opens with existing data
// 3. User modifies and saves
onChildFormSave(updatedChild: InspectionDomain): void {
  this.groupStateService.updateChildInGroup(
    group.id,
    childIndex,
    updatedChild
  ).subscribe({
    next: () => {
      // UI updates automatically
    }
  });
}
```

## Testing

### Unit Tests

```typescript
describe("GroupStateService", () => {
  it("should add a child to a group", (done) => {
    service.addChildToGroup("1", mockChild).subscribe((result) => {
      expect(result.children).toContain(mockChild);
      done();
    });
  });
});
```

### Integration Tests

- Test component interactions
- Test service integration
- Test error scenarios

## Performance Considerations

1. **Lazy Loading**: Load data only when needed
2. **Pagination**: Implement pagination for large datasets
3. **Virtual Scrolling**: For very large lists
4. **Memoization**: Cache expensive calculations
5. **OnPush Strategy**: Minimize change detection cycles

## Security

1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: Sanitize HTML content
3. **CSRF Protection**: Implement CSRF tokens
4. **Authorization**: Check user permissions

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Angular 17+
- PrimeNG 17+
- RxJS 7+
- TypeScript 5+
