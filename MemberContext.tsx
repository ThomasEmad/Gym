/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Member, MemberFormData, MembershipStatus, MembershipType } from '@/types/member';



interface MemberContextProps {
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: number, member: MemberFormData) => void;
  deleteMember: (id: number) => void;
  currentEditingId: number | null;
  setCurrentEditingId: (id: number | null) => void;
  showMemberModal: boolean;
  setShowMemberModal: (show: boolean) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  memberToDelete: number | null;
  setMemberToDelete: (id: number | null) => void;
  showToast: boolean;
  toastMessage: string;
  showToastMessage: (message: string) => void;
  activeSection: 'dashboard' | 'members';
  setActiveSection: (section: 'dashboard' | 'members') => void;
  addRecentActivity: (action: 'added' | 'updated' | 'deleted', memberName: string) => void;
  recentActivities: { action: string; memberName: string; timestamp: string }[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: MembershipStatus | '';
  setStatusFilter: (status: MembershipStatus | '') => void;
  typeFilter: MembershipType | '';
  setTypeFilter: (type: MembershipType | '') => void;
  memberIdCounter: number;
}

const MemberContext = createContext<MemberContextProps | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentEditingId, setCurrentEditingId] = useState<number | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'members'>('dashboard');
  const [recentActivities, setRecentActivities] = useState<{ action: string; memberName: string; timestamp: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MembershipStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<MembershipType | ''>('');
  const [memberIdCounter, setMemberIdCounter] = useState(1000);
  
  useEffect(() => {
  async function fetchMembers() {
    try {
      const res = await fetch(`http://localhost:8000/gymApi/members/`);
      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("API did not return an array");
      setMembers(data);
    } catch (err: any) {
      console.error("Error fetching members:", err.message);
    }
  }
  fetchMembers();
}, []);

  
  const addMember = async (member: MemberFormData) => {
  const res = await fetch("http://localhost:8000/gymApi/members/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });
  const newMember = await res.json();
  setMembers(prev => [...prev, newMember]);
  setMemberIdCounter(prev => prev + 1);
};


  const updateMember = async (id: number, formData: MemberFormData) => {
  const res = await fetch(`http://localhost:8000/gymApi/members/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const updatedMember = await res.json();
  setMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
};


const deleteMember = async (id: number) => {
  await fetch(`http://localhost:8000/gymApi/members/${id}/`, {
    method: "DELETE",
  });
  setMembers(prev => prev.filter(m => m.id !== id));
};


const showToastMessage = (message: string) => {
  setToastMessage(message);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 3000);
};

const addRecentActivity = (action: 'added' | 'updated' | 'deleted', memberName: string) => {
  const newActivity = {
    action,
    memberName,
    timestamp: new Date().toLocaleString()
  };
  
  const updatedActivities = [newActivity, ...recentActivities].slice(0, 5);
  setRecentActivities(updatedActivities);
};

const contextValue = {
  members,
  addMember,
  updateMember,
  deleteMember,
  currentEditingId,
  setCurrentEditingId,
  showMemberModal,
  setShowMemberModal,
  showDeleteModal,
  setShowDeleteModal,
  memberToDelete,
  setMemberToDelete,
  showToast,
  toastMessage,
  showToastMessage,
  activeSection,
  setActiveSection,
  addRecentActivity,
  recentActivities,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  memberIdCounter
  };

  return (
    <MemberContext.Provider value={contextValue}>
      {children}
    </MemberContext.Provider>
  );
};


export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};