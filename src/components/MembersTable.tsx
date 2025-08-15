@@ .. @@
 "use client";
 import React, { useMemo } from "react";
-import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
+import { FaEdit, FaTrash, FaPlus, FaRedo } from "react-icons/fa";
 import { MembershipStatus, MembershipType, Member } from "@/types/member";
 import { useMemberContext } from "@/context/MemberContext";
 import { getMemberDisplayStatus } from "@/utils/statusUtils";
+import LoadingSpinner from "./LoadingSpinner";

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
+    loading,
+    error,
+    refreshMembers,
   } = useMemberContext();

@@ .. @@
       <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold text-gray-800">Member Management</h2>
-        <button
-          onClick={() => setShowMemberModal(true)}
-          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
-          type="button"
-        >
-          <FaPlus className="mr-2" /> Add New Member
-        </button>
+        <div className="flex space-x-3">
+          <button
+            onClick={refreshMembers}
+            disabled={loading}
+            className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
+            type="button"
+          >
+            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <FaRedo className="mr-2" />}
+            Refresh
+          </button>
+          <button
+            onClick={() => setShowMemberModal(true)}
+            disabled={loading}
+            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50"
+            type="button"
+          >
+            <FaPlus className="mr-2" /> Add New Member
+          </button>
+        </div>
       </div>

+      {/* Error Display */}
+      {error && (
+        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
+          <div className="flex items-center">
+            <div className="text-red-600 text-sm">
+              <strong>Error:</strong> {error}
+            </div>
+            <button
+              onClick={refreshMembers}
+              className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
+            >
+              Try Again
+            </button>
+          </div>
+        </div>
+      )}
+
       {/* Search & Filters */}
       <div className="bg-white rounded-xl shadow-lg p-6">
@@ .. @@
             <tbody>
-              {filteredMembers.length === 0 ? (
+              {loading ? (
+                <tr>
+                  <td colSpan={7} className="px-6 py-8 text-center">
+                    <div className="flex items-center justify-center">
+                      <LoadingSpinner className="mr-3" />
+                      <span className="text-gray-500">Loading members...</span>
+                    </div>
+                  </td>
+                </tr>
+              ) : filteredMembers.length === 0 ? (
                 <tr>
                   <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
-                    No members found. Click "Add New Member" to get started.
+                    {error ? 'Unable to load members.' : 'No members found. Click "Add New Member" to get started.'}
                   </td>
                 </tr>
               ) : (