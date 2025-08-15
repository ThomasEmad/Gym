'use client'
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useMemberContext } from '@/context/MemberContext';

const DeleteModal: React.FC = () => {
  const { 
    memberToDelete, 
    setShowDeleteModal, 
    deleteMember,
    showToastMessage,
    addRecentActivity,
    members
  } = useMemberContext();

  const handleDelete = () => {
    if (memberToDelete !== null) {
      const member = members.find(m => m.id === memberToDelete);
      if (member) {
        deleteMember(memberToDelete);
        showToastMessage('Member deleted successfully!');
        addRecentActivity('deleted', member.fullName);
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-blue-950/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-3xl mr-4" />
            <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
          </div>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this member? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;