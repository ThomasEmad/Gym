"use client";
import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaRedo } from "react-icons/fa";
import { MembershipStatus, MembershipType, Member } from "@/types/member";
import { useMemberContext } from "@/context/MemberContext";
import { getMemberDisplayStatus } from "@/utils/statusUtils";
import LoadingSpinner from "./LoadingSpinner";

const MembersTable: React.FC = () => {
  const {
    members,
    setShowMemberModal,
    setCurrentEditingId,
    setMemberToDelete,
    setShowDeleteModal,
    searchTerm,
    statusFilter,
    typeFilter,
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    loading,
    error,
    refreshMembers,
  } = useMemberContext();

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesType = typeFilter === 'all' || member.membershipType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [members, searchTerm, statusFilter, typeFilter]);

  const handleEdit = (member: Member) => {
    setCurrentEditingId(member.id);
    setShowMemberModal(true);
  };

  const handleDelete = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Member Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={refreshMembers}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
            type="button"
          >
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <FaRedo className="mr-2" />}
            Refresh
          </button>
          <button
            onClick={() => setShowMemberModal(true)}
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50"
            type="button"
          >
            <FaPlus className="mr-2" /> Add New Member
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 text-sm">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={refreshMembers}
              className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Members
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MembershipStatus | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value={MembershipStatus.ACTIVE}>Active</option>
              <option value={MembershipStatus.INACTIVE}>Inactive</option>
              <option value={MembershipStatus.SUSPENDED}>Suspended</option>
              <option value={MembershipStatus.EXPIRED}>Expired</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as MembershipType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value={MembershipType.BASIC}>Basic</option>
              <option value={MembershipType.PREMIUM}>Premium</option>
              <option value={MembershipType.VIP}>VIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <LoadingSpinner className="mr-3" />
                      <span className="text-gray-500">Loading members...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {error ? 'Unable to load members.' : 'No members found. Click "Add New Member" to get started.'}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <tr key={member.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">ID: {member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.membershipType === MembershipType.VIP
                          ? 'bg-purple-100 text-purple-800'
                          : member.membershipType === MembershipType.PREMIUM
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.membershipType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === MembershipStatus.ACTIVE
                          ? 'bg-green-100 text-green-800'
                          : member.status === MembershipStatus.INACTIVE
                          ? 'bg-gray-100 text-gray-800'
                          : member.status === MembershipStatus.SUSPENDED
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getMemberDisplayStatus(member.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded"
                          title="Edit Member"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Member"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MembersTable;