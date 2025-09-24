import { Injectable } from '@angular/core';
import {
  InspectionDomainGroup,
  InspectionDomain,
} from '../domain/inspectiondomaingroup';

@Injectable({
  providedIn: 'root',
})
export class InspectionDomainGroupService {
  private groups: InspectionDomainGroup[] = [];
  private nextId: number = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    this.groups = [
      {
        id: 'group-1',
        groupNameAr: 'مجموعة السلامة العامة',
        groupNameEn: 'General Safety Group',
        isActive: true,
        totalChildren: 3,
        activeChildren: 2,
        inactiveChildren: 0,
        suspendedChildren: 1,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة السلامة العامة',
            groupForInspectionDomainEn: 'General Safety Group',
            inspectionDomainAr: 'معدات الإطفاء',
            inspectionDomainEn: 'Fire Equipment',
            activationStatus: true,
            numberOfValidQualifiedEntities: 5,
            numberOfValidQualifiedInspectors: 2,
            numberOfPendingQualificationRequests: 1,
          },
          {
            groupForInspectionDomainAr: 'مجموعة السلامة العامة',
            groupForInspectionDomainEn: 'General Safety Group',
            inspectionDomainAr: 'خروج الطوارئ',
            inspectionDomainEn: 'Emergency Exits',
            activationStatus: true,
            numberOfValidQualifiedEntities: 3,
            numberOfValidQualifiedInspectors: 1,
            numberOfPendingQualificationRequests: 0,
          },
          {
            groupForInspectionDomainAr: 'مجموعة السلامة العامة',
            groupForInspectionDomainEn: 'General Safety Group',
            inspectionDomainAr: 'أنظمة الإنذار',
            inspectionDomainEn: 'Alarm Systems',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 2,
          },
        ],
      },
      {
        id: 'group-2',
        groupNameAr: 'مجموعة الصحة الغذائية',
        groupNameEn: 'Food Health Group',
        isActive: true,
        totalChildren: 2,
        activeChildren: 2,
        inactiveChildren: 0,
        suspendedChildren: 0,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة الصحة الغذائية',
            groupForInspectionDomainEn: 'Food Health Group',
            inspectionDomainAr: 'المطابخ',
            inspectionDomainEn: 'Kitchens',
            activationStatus: true,
            numberOfValidQualifiedEntities: 4,
            numberOfValidQualifiedInspectors: 2,
            numberOfPendingQualificationRequests: 1,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الصحة الغذائية',
            groupForInspectionDomainEn: 'Food Health Group',
            inspectionDomainAr: 'المطاعم',
            inspectionDomainEn: 'Restaurants',
            activationStatus: true,
            numberOfValidQualifiedEntities: 6,
            numberOfValidQualifiedInspectors: 3,
            numberOfPendingQualificationRequests: 0,
          },
        ],
      },
      {
        id: 'group-3',
        groupNameAr: 'مجموعة البيئة',
        groupNameEn: 'Environment Group',
        isActive: false,
        totalChildren: 2,
        activeChildren: 0,
        inactiveChildren: 2,
        suspendedChildren: 0,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة البيئة',
            groupForInspectionDomainEn: 'Environment Group',
            inspectionDomainAr: 'إدارة النفايات',
            inspectionDomainEn: 'Waste Management',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 1,
          },
          {
            groupForInspectionDomainAr: 'مجموعة البيئة',
            groupForInspectionDomainEn: 'Environment Group',
            inspectionDomainAr: 'جودة الهواء',
            inspectionDomainEn: 'Air Quality',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 0,
          },
        ],
      },
      {
        groupNameAr: 'مجموعة البناء والتشييد',
        groupNameEn: 'Construction Group',
        isActive: true,
        totalChildren: 4,
        activeChildren: 3,
        inactiveChildren: 1,
        suspendedChildren: 0,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة البناء والتشييد',
            groupForInspectionDomainEn: 'Construction Group',
            inspectionDomainAr: 'الخرسانة',
            inspectionDomainEn: 'Concrete',
            activationStatus: true,
            numberOfValidQualifiedEntities: 8,
            numberOfValidQualifiedInspectors: 4,
            numberOfPendingQualificationRequests: 2,
          },
          {
            groupForInspectionDomainAr: 'مجموعة البناء والتشييد',
            groupForInspectionDomainEn: 'Construction Group',
            inspectionDomainAr: 'الحديد',
            inspectionDomainEn: 'Steel',
            activationStatus: true,
            numberOfValidQualifiedEntities: 6,
            numberOfValidQualifiedInspectors: 3,
            numberOfPendingQualificationRequests: 1,
          },
          {
            groupForInspectionDomainAr: 'مجموعة البناء والتشييد',
            groupForInspectionDomainEn: 'Construction Group',
            inspectionDomainAr: 'الطوب',
            inspectionDomainEn: 'Brickwork',
            activationStatus: true,
            numberOfValidQualifiedEntities: 4,
            numberOfValidQualifiedInspectors: 2,
            numberOfPendingQualificationRequests: 0,
          },
          {
            groupForInspectionDomainAr: 'مجموعة البناء والتشييد',
            groupForInspectionDomainEn: 'Construction Group',
            inspectionDomainAr: 'الدهانات',
            inspectionDomainEn: 'Painting',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 3,
          },
        ],
      },
      {
        groupNameAr: 'مجموعة الطاقة',
        groupNameEn: 'Energy Group',
        isActive: false,
        totalChildren: 3,
        activeChildren: 0,
        inactiveChildren: 3,
        suspendedChildren: 0,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة الطاقة',
            groupForInspectionDomainEn: 'Energy Group',
            inspectionDomainAr: 'الطاقة الشمسية',
            inspectionDomainEn: 'Solar Energy',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 5,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الطاقة',
            groupForInspectionDomainEn: 'Energy Group',
            inspectionDomainAr: 'الطاقة الريحية',
            inspectionDomainEn: 'Wind Energy',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 3,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الطاقة',
            groupForInspectionDomainEn: 'Energy Group',
            inspectionDomainAr: 'الطاقة النووية',
            inspectionDomainEn: 'Nuclear Energy',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 1,
          },
        ],
      },
      {
        groupNameAr: 'مجموعة التكنولوجيا',
        groupNameEn: 'Technology Group',
        isActive: true,
        totalChildren: 5,
        activeChildren: 4,
        inactiveChildren: 1,
        suspendedChildren: 0,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة التكنولوجيا',
            groupForInspectionDomainEn: 'Technology Group',
            inspectionDomainAr: 'البرمجيات',
            inspectionDomainEn: 'Software',
            activationStatus: true,
            numberOfValidQualifiedEntities: 15,
            numberOfValidQualifiedInspectors: 8,
            numberOfPendingQualificationRequests: 6,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التكنولوجيا',
            groupForInspectionDomainEn: 'Technology Group',
            inspectionDomainAr: 'الأجهزة',
            inspectionDomainEn: 'Hardware',
            activationStatus: true,
            numberOfValidQualifiedEntities: 10,
            numberOfValidQualifiedInspectors: 5,
            numberOfPendingQualificationRequests: 3,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التكنولوجيا',
            groupForInspectionDomainEn: 'Technology Group',
            inspectionDomainAr: 'الشبكات',
            inspectionDomainEn: 'Networks',
            activationStatus: true,
            numberOfValidQualifiedEntities: 8,
            numberOfValidQualifiedInspectors: 4,
            numberOfPendingQualificationRequests: 2,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التكنولوجيا',
            groupForInspectionDomainEn: 'Technology Group',
            inspectionDomainAr: 'الأمن السيبراني',
            inspectionDomainEn: 'Cybersecurity',
            activationStatus: true,
            numberOfValidQualifiedEntities: 6,
            numberOfValidQualifiedInspectors: 3,
            numberOfPendingQualificationRequests: 1,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التكنولوجيا',
            groupForInspectionDomainEn: 'Technology Group',
            inspectionDomainAr: 'الذكاء الاصطناعي',
            inspectionDomainEn: 'Artificial Intelligence',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 4,
          },
        ],
      },
      {
        groupNameAr: 'مجموعة التعليم',
        groupNameEn: 'Education Group',
        isActive: true,
        totalChildren: 4,
        activeChildren: 3,
        inactiveChildren: 0,
        suspendedChildren: 1,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة التعليم',
            groupForInspectionDomainEn: 'Education Group',
            inspectionDomainAr: 'المدارس',
            inspectionDomainEn: 'Schools',
            activationStatus: true,
            numberOfValidQualifiedEntities: 20,
            numberOfValidQualifiedInspectors: 10,
            numberOfPendingQualificationRequests: 8,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التعليم',
            groupForInspectionDomainEn: 'Education Group',
            inspectionDomainAr: 'الجامعات',
            inspectionDomainEn: 'Universities',
            activationStatus: true,
            numberOfValidQualifiedEntities: 15,
            numberOfValidQualifiedInspectors: 7,
            numberOfPendingQualificationRequests: 5,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التعليم',
            groupForInspectionDomainEn: 'Education Group',
            inspectionDomainAr: 'المعاهد',
            inspectionDomainEn: 'Institutes',
            activationStatus: true,
            numberOfValidQualifiedEntities: 12,
            numberOfValidQualifiedInspectors: 6,
            numberOfPendingQualificationRequests: 3,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التعليم',
            groupForInspectionDomainEn: 'Education Group',
            inspectionDomainAr: 'مراكز التدريب',
            inspectionDomainEn: 'Training Centers',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 2,
          },
        ],
      },
      {
        groupNameAr: 'مجموعة الصحة',
        groupNameEn: 'Health Group',
        isActive: true,
        totalChildren: 6,
        activeChildren: 5,
        inactiveChildren: 1,
        suspendedChildren: 0,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة الصحة',
            groupForInspectionDomainEn: 'Health Group',
            inspectionDomainAr: 'المستشفيات',
            inspectionDomainEn: 'Hospitals',
            activationStatus: true,
            numberOfValidQualifiedEntities: 25,
            numberOfValidQualifiedInspectors: 12,
            numberOfPendingQualificationRequests: 10,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الصحة',
            groupForInspectionDomainEn: 'Health Group',
            inspectionDomainAr: 'العيادات',
            inspectionDomainEn: 'Clinics',
            activationStatus: true,
            numberOfValidQualifiedEntities: 18,
            numberOfValidQualifiedInspectors: 9,
            numberOfPendingQualificationRequests: 7,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الصحة',
            groupForInspectionDomainEn: 'Health Group',
            inspectionDomainAr: 'الصيدليات',
            inspectionDomainEn: 'Pharmacies',
            activationStatus: true,
            numberOfValidQualifiedEntities: 30,
            numberOfValidQualifiedInspectors: 15,
            numberOfPendingQualificationRequests: 12,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الصحة',
            groupForInspectionDomainEn: 'Health Group',
            inspectionDomainAr: 'المختبرات',
            inspectionDomainEn: 'Laboratories',
            activationStatus: true,
            numberOfValidQualifiedEntities: 14,
            numberOfValidQualifiedInspectors: 7,
            numberOfPendingQualificationRequests: 4,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الصحة',
            groupForInspectionDomainEn: 'Health Group',
            inspectionDomainAr: 'مراكز الرعاية',
            inspectionDomainEn: 'Care Centers',
            activationStatus: true,
            numberOfValidQualifiedEntities: 22,
            numberOfValidQualifiedInspectors: 11,
            numberOfPendingQualificationRequests: 8,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الصحة',
            groupForInspectionDomainEn: 'Health Group',
            inspectionDomainAr: 'الطب البيطري',
            inspectionDomainEn: 'Veterinary Medicine',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 3,
          },
        ],
      },
      {
        groupNameAr: 'مجموعة التصنيع',
        groupNameEn: 'Manufacturing Group',
        isActive: false,
        totalChildren: 4,
        activeChildren: 0,
        inactiveChildren: 4,
        suspendedChildren: 0,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة التصنيع',
            groupForInspectionDomainEn: 'Manufacturing Group',
            inspectionDomainAr: 'المنسوجات',
            inspectionDomainEn: 'Textiles',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 6,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التصنيع',
            groupForInspectionDomainEn: 'Manufacturing Group',
            inspectionDomainAr: 'الأغذية',
            inspectionDomainEn: 'Food Processing',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 4,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التصنيع',
            groupForInspectionDomainEn: 'Manufacturing Group',
            inspectionDomainAr: 'الكيماويات',
            inspectionDomainEn: 'Chemicals',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 2,
          },
          {
            groupForInspectionDomainAr: 'مجموعة التصنيع',
            groupForInspectionDomainEn: 'Manufacturing Group',
            inspectionDomainAr: 'المعادن',
            inspectionDomainEn: 'Metals',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 1,
          },
        ],
      },
      {
        groupNameAr: 'مجموعة الترفيه',
        groupNameEn: 'Entertainment Group',
        isActive: true,
        totalChildren: 3,
        activeChildren: 2,
        inactiveChildren: 0,
        suspendedChildren: 1,
        children: [
          {
            groupForInspectionDomainAr: 'مجموعة الترفيه',
            groupForInspectionDomainEn: 'Entertainment Group',
            inspectionDomainAr: 'السينما',
            inspectionDomainEn: 'Cinema',
            activationStatus: true,
            numberOfValidQualifiedEntities: 8,
            numberOfValidQualifiedInspectors: 4,
            numberOfPendingQualificationRequests: 2,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الترفيه',
            groupForInspectionDomainEn: 'Entertainment Group',
            inspectionDomainAr: 'المسارح',
            inspectionDomainEn: 'Theaters',
            activationStatus: true,
            numberOfValidQualifiedEntities: 6,
            numberOfValidQualifiedInspectors: 3,
            numberOfPendingQualificationRequests: 1,
          },
          {
            groupForInspectionDomainAr: 'مجموعة الترفيه',
            groupForInspectionDomainEn: 'Entertainment Group',
            inspectionDomainAr: 'الملاهي',
            inspectionDomainEn: 'Amusement Parks',
            activationStatus: false,
            numberOfValidQualifiedEntities: 0,
            numberOfValidQualifiedInspectors: 0,
            numberOfPendingQualificationRequests: 3,
          },
        ],
      },
    ];

    // Add IDs to existing groups and set nextId
    this.groups.forEach((group, index) => {
      if (!group.id) {
        group.id = `group-${index + 1}`;
      }
    });
    this.nextId = this.groups.length + 1;
  }

  getInspectionDomainGroups(): Promise<InspectionDomainGroup[]> {
    return new Promise((resolve) => {
      // Simulate async operation
      setTimeout(() => {
        resolve([...this.groups]);
      }, 200);
    });
  }

  addInspectionDomainGroup(
    group: InspectionDomainGroup
  ): Promise<InspectionDomainGroup> {
    return new Promise((resolve) => {
      // Simulate async operation
      setTimeout(() => {
        const newGroup = {
          ...group,
          id: `group-${this.nextId++}`,
        };
        this.groups.push(newGroup);
        resolve(newGroup);
      }, 300);
    });
  }

  updateInspectionDomainGroup(
    group: InspectionDomainGroup
  ): Promise<InspectionDomainGroup> {
    return new Promise((resolve, reject) => {
      // Simulate async operation
      setTimeout(() => {
        const index = this.groups.findIndex((g) => g.id === group.id);

        if (index !== -1) {
          // Update group counters before saving
          this.updateGroupCounters(group);
          this.groups[index] = { ...group };
          resolve(this.groups[index]);
        } else {
          reject(new Error('Group not found'));
        }
      }, 300);
    });
  }

  deleteInspectionDomainGroup(group: InspectionDomainGroup): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Simulate async operation
      setTimeout(() => {
        const index = this.groups.findIndex((g) => g.id === group.id);

        if (index !== -1) {
          this.groups.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error('Group not found'));
        }
      }, 300);
    });
  }

  // Add child to specific group
  addChildToGroup(
    groupId: string,
    child: InspectionDomain
  ): Promise<InspectionDomainGroup> {
    return new Promise((resolve, reject) => {
      // Simulate async operation
      setTimeout(() => {
        const groupIndex = this.groups.findIndex((g) => g.id === groupId);

        if (groupIndex !== -1) {
          const group = this.groups[groupIndex];

          // Initialize children array if it doesn't exist
          if (!group.children) {
            group.children = [];
          }

          // Add the new child
          group.children.push(child);

          // Update group counters
          this.updateGroupCounters(group);

          // Update the group in the array
          this.groups[groupIndex] = { ...group };

          resolve(this.groups[groupIndex]);
        } else {
          reject(new Error(`Group with ID ${groupId} not found`));
        }
      }, 300);
    });
  }

  // Update child in specific group
  updateChildInGroup(
    groupId: string,
    childIndex: number,
    updatedChild: InspectionDomain
  ): Promise<InspectionDomainGroup> {
    return new Promise((resolve, reject) => {
      // Simulate async operation
      setTimeout(() => {
        const groupIndex = this.groups.findIndex((g) => g.id === groupId);

        if (groupIndex !== -1) {
          const group = this.groups[groupIndex];

          if (group.children && group.children[childIndex]) {
            // Update the specific child
            group.children[childIndex] = updatedChild;

            // Update group counters
            this.updateGroupCounters(group);

            // Update the group in the array
            this.groups[groupIndex] = { ...group };

            resolve(this.groups[groupIndex]);
          } else {
            reject(
              new Error(
                `Child at index ${childIndex} not found in group ${groupId}`
              )
            );
          }
        } else {
          reject(new Error(`Group with ID ${groupId} not found`));
        }
      }, 300);
    });
  }

  // Helper method to update group counters
  private updateGroupCounters(group: InspectionDomainGroup): void {
    if (!group.children) {
      group.children = [];
    }

    group.totalChildren = group.children.length;
    group.activeChildren = group.children.filter(
      (child) => child.activationStatus
    ).length;
    group.inactiveChildren = group.children.filter(
      (child) => !child.activationStatus
    ).length;
    group.suspendedChildren = 0; // Assuming no suspended children for now
  }
}
