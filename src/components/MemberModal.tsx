@@ .. @@
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();

-    if (currentEditingId !== null) {
-      updateMember(currentEditingId, formData);
-      showToastMessage("Member updated successfully!");
-      addRecentActivity("updated", formData.fullName);
-    } else {
-      const newMember: Member = {
-        id: Date.now(),
-        ...formData,
-        createdAt: new Date().toISOString(),
-      };
-      addMember(newMember);
-      showToastMessage("Member added successfully!");
-      addRecentActivity("added", formData.fullName);
-    }
+    const handleAsync = async () => {
+      try {
+        if (currentEditingId !== null) {
+          await updateMember(currentEditingId, formData);
+          showToastMessage("Member updated successfully!");
+          addRecentActivity("updated", formData.fullName);
+        } else {
+          await addMember(formData);
+          showToastMessage("Member added successfully!");
+          addRecentActivity("added", formData.fullName);
+        }
+        setShowMemberModal(false);
+      } catch (error) {
+        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
+        showToastMessage(`Error: ${errorMessage}`);
+      }
+    };

-    setShowMemberModal(false);
+    handleAsync();
   };