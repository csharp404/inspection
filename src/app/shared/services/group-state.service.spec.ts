import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GroupStateService } from './group-state.service';
import { InspectionDomainGroupService } from '../../../services/inspectiondomaingroupservice';
import {
  InspectionDomainGroup,
  InspectionDomain,
} from '../interfaces/group-management.interface';

describe('GroupStateService', () => {
  let service: GroupStateService;
  let mockGroupService: jasmine.SpyObj<InspectionDomainGroupService>;

  const mockGroup: InspectionDomainGroup = {
    id: '1',
    groupNameEn: 'Test Group',
    groupNameAr: 'مجموعة تجريبية',
    isActive: true,
    totalChildren: 0,
    activeChildren: 0,
    inactiveChildren: 0,
    suspendedChildren: 0,
    children: [],
  };

  const mockChild: InspectionDomain = {
    groupForInspectionDomainEn: 'Test Group',
    groupForInspectionDomainAr: 'مجموعة تجريبية',
    inspectionDomainEn: 'Test Child',
    inspectionDomainAr: 'طفل تجريبي',
    activationStatus: true,
    numberOfValidQualifiedEntities: 5,
    numberOfValidQualifiedInspectors: 3,
    numberOfPendingQualificationRequests: 2,
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('InspectionDomainGroupService', [
      'getInspectionDomainGroups',
      'addInspectionDomainGroup',
      'updateInspectionDomainGroup',
      'deleteInspectionDomainGroup',
    ]);

    TestBed.configureTestingModule({
      providers: [
        GroupStateService,
        { provide: InspectionDomainGroupService, useValue: spy },
      ],
    });

    service = TestBed.inject(GroupStateService);
    mockGroupService = TestBed.inject(
      InspectionDomainGroupService
    ) as jasmine.SpyObj<InspectionDomainGroupService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial data', (done) => {
    mockGroupService.getInspectionDomainGroups.and.returnValue(of([mockGroup]));

    service.groups$.subscribe((groups) => {
      expect(groups).toEqual([mockGroup]);
      done();
    });
  });

  it('should add a new group', (done) => {
    const newGroup = { ...mockGroup, id: '2' };
    mockGroupService.addInspectionDomainGroup.and.returnValue(of(newGroup));

    service.addGroup(mockGroup).subscribe((result) => {
      expect(result).toEqual(newGroup);
      done();
    });
  });

  it('should add a child to a group', (done) => {
    const groupWithChild = {
      ...mockGroup,
      children: [mockChild],
      totalChildren: 1,
      activeChildren: 1,
    };
    mockGroupService.updateInspectionDomainGroup.and.returnValue(
      of(groupWithChild)
    );

    service.addChildToGroup('1', mockChild).subscribe((result) => {
      expect(result.children).toContain(mockChild);
      expect(result.totalChildren).toBe(1);
      done();
    });
  });

  it('should handle errors gracefully', (done) => {
    mockGroupService.getInspectionDomainGroups.and.returnValue(
      throwError(() => new Error('Test error'))
    );

    service.groupState$.subscribe((state) => {
      if (state.error) {
        expect(state.error).toContain('Failed to load groups');
        done();
      }
    });
  });

  it('should show child form with correct state', () => {
    service.showChildForm(mockGroup, mockChild);

    service.childFormState$.subscribe((state) => {
      expect(state.isVisible).toBe(true);
      expect(state.isEditMode).toBe(true);
      expect(state.selectedChild).toEqual(mockChild);
      expect(state.parentGroup).toEqual(mockGroup);
    });
  });

  it('should hide child form', () => {
    service.hideChildForm();

    service.childFormState$.subscribe((state) => {
      expect(state.isVisible).toBe(false);
      expect(state.isEditMode).toBe(false);
      expect(state.selectedChild).toBeNull();
      expect(state.parentGroup).toBeNull();
    });
  });
});
