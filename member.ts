// src/types/member.ts

export type MembershipStatus = "active" | "suspended" | "expired";

// Add 'custom' to the MembershipType union
export type MembershipType = "monthly" | "quarterly" | "annual" | "custom";

export interface Member {
  end_date: string;
  id: number;
  fullName: string;
  memberId: string;
  email: string;
  phone?: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: string;
}

export interface MemberFormData {
  fullName: string;
  memberId: string;
  email: string;
  phone?: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  notes?: string;
}