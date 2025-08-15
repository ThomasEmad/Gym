@@ .. @@
-  const handleDelete = () => {
+  const handleDelete = async () => {
     if (memberToDelete !== null) {
       const member = members.find(m => m.id === memberToDelete);
       if (member) {
-        deleteMember(memberToDelete);
-        showToastMessage('Member deleted successfully!');
-        addRecentActivity('deleted', member.fullName);
+        try {
+          await deleteMember(memberToDelete);
+          showToastMessage('Member deleted successfully!');
+          addRecentActivity('deleted', member.fullName);
+          setShowDeleteModal(false);
+        } catch (error) {
+          const errorMessage = error instanceof Error ? error.message : 'Failed to delete member';
+          showToastMessage(`Error: ${errorMessage}`);
+        }
+      } else {
+        showToastMessage('Member not found');
+        setShowDeleteModal(false);
       }
-      setShowDeleteModal(false);
     }
   };