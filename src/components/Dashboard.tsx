@@ .. @@
 import React, { useMemo } from "react";
 import { parseISO, addDays, isBefore, startOfDay } from "date-fns";
 import { FaUsers, FaUserPlus, FaExclamationTriangle, FaUserTimes, FaPlus, FaList, FaDownload } from "react-icons/fa";
 import { useMemberContext } from "@/context/MemberContext";
+import LoadingSpinner from "./LoadingSpinner";

@@ .. @@
 const Dashboard: React.FC = () => {
-  const { members: ctxMembers, setActiveSection, setShowMemberModal, recentActivities, showToastMessage } = useMemberContext();
+  const { 
+    members: ctxMembers, 
+    setActiveSection, 
+    setShowMemberModal, 
+    recentActivities, 
+    showToastMessage,
+    loading,
+    error,
+    refreshMembers
+  } = useMemberContext();

@@ .. @@
       <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
+        {loading && (
+          <div className="flex items-center text-gray-600">
+            <LoadingSpinner size="sm" className="mr-2" />
+            <span className="text-sm">Updating...</span>
+          </div>
+        )}
       </div>

+      {/* Error Display */}
+      {error && (
+        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
+          <div className="flex items-center justify-between">
+            <div className="text-red-600 text-sm">
+              <strong>Error:</strong> {error}
+            </div>
+            <button
+              onClick={refreshMembers}
+              className="text-red-600 hover:text-red-800 text-sm underline"
+            >
+              Refresh Data
+            </button>
+          </div>
+        </div>
+      )}
+
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">