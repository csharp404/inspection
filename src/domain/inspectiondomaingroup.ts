export interface InspectionDomainGroup {
  id?: string; // Unique identifier for the group
  groupNameAr: string; // Group for Inspection Domain (Arabic)
  groupNameEn: string; // Group for Inspection Domain (English)
  isActive: boolean; // Activation Status
  totalChildren: number; // Number of Child inspection domains (Total)
  activeChildren: number; // Number of Child inspection domains (Active)
  inactiveChildren: number; // Number of Child inspection domains (Inactive)
  suspendedChildren: number; // Number of Child inspection domains (Temporarily Suspended)
  children: InspectionDomain[]; // Children inspection domains
}
export interface InspectionDomain {
  groupForInspectionDomainAr: string;
  groupForInspectionDomainEn: string;
  inspectionDomainAr: string;
  inspectionDomainEn: string;
  activationStatus: boolean;
  numberOfValidQualifiedEntities: number;
  numberOfValidQualifiedInspectors: number;
  numberOfPendingQualificationRequests: number;
}
