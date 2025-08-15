// src/components/MemberModal.tsx

"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import {
  MembershipStatus,
  MembershipType,
  Member,
  MemberFormData,
} from "@/types/member";
import { useMemberContext } from "@/context/MemberContext";
import { addMonths, addYears, parseISO } from "date-fns";

const MemberModal: React.FC = () => {
  const {
    currentEditingId,
    setShowMemberModal,
    members,
    addMember,
    updateMember,
    showToastMessage,
    addRecentActivity,
    memberIdCounter,
  } = useMemberContext();

  const [formData, setFormData] = useState<MemberFormData>({
    fullName: "",
    memberId: `GM${memberIdCounter.toString().padStart(4, "0")}`,
    email: "",
    phone: "",
    membershipType: "monthly" as MembershipType,
    status: "active" as MembershipStatus,
    startDate: new Date().toISOString().split("T")[0],
    endDate: addMonths(new Date(), 1).toISOString().split("T")[0],
    notes: "",
  });

  const [isCustomDate, setIsCustomDate] = useState(false);

  useEffect(() => {
    if (currentEditingId !== null) {
      const member = members.find((m) => m.id === currentEditingId);
      if (member) {
        setFormData({
          fullName: member.fullName,
          memberId: member.memberId,
          email: member.email,
          phone: member.phone || "",
          membershipType: member.membershipType,
          status: member.status,
          startDate: member.startDate,
          endDate: member.endDate,
          notes: member.notes || "",
        });
        if (
          !["monthly", "quarterly", "annual"].includes(member.membershipType)
        ) {
          setIsCustomDate(true);
        } else {
          setIsCustomDate(false);
        }
      }
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        fullName: "",
        memberId: `GM${memberIdCounter.toString().padStart(4, "0")}`,
        email: "",
        phone: "",
        membershipType: "monthly",
        status: "active",
        startDate: today,
        endDate: addMonths(new Date(today), 1).toISOString().split("T")[0],
        notes: "",
      });
      setIsCustomDate(false);
    }
  }, [currentEditingId, members, memberIdCounter]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "membershipType" && value === "custom") {
      setIsCustomDate(true);
      setFormData((prev) => ({
        ...prev,
        membershipType: value as MembershipType, // Cast here to satisfy TypeScript
      }));
    } else if (name === "membershipType" && value !== "custom") {
      setIsCustomDate(false);
      setFormData((prev) => ({ ...prev, [name]: value as MembershipType }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const calculateEndDate = () => {
      if (isCustomDate) {
        return;
      }

      const startDate = formData.startDate;
      const membershipType = formData.membershipType;

      if (startDate && membershipType && membershipType !== "custom") {
        const start = parseISO(startDate);
        let endDate = new Date(start);

        switch (membershipType) {
          case "monthly":
            endDate = addMonths(endDate, 1);
            break;
          case "quarterly":
            endDate = addMonths(endDate, 3);
            break;
          case "annual":
            endDate = addYears(endDate, 1);
            break;
        }

        const newEndDate = endDate.toISOString().split("T")[0];

        if (newEndDate !== formData.endDate) {
          setFormData((prev) => ({
            ...prev,
            endDate: newEndDate,
          }));
        }
      }
    };

    calculateEndDate();
  }, [
    formData.startDate,
    formData.membershipType,
    isCustomDate,
    formData.endDate,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentEditingId !== null) {
      updateMember(currentEditingId, formData);
      showToastMessage("Member updated successfully!");
      addRecentActivity("updated", formData.fullName);
    } else {
      const newMember: Member = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addMember(newMember);
      showToastMessage("Member added successfully!");
      addRecentActivity("added", formData.fullName);
    }

    setShowMemberModal(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">
              {currentEditingId !== null ? "Edit Member" : "Add New Member"}
            </h3>
            <button
              onClick={() => setShowMemberModal(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member ID
              </label>
              <input
                type="text"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Type *
              </label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gym-accent focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gym-accent focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gym-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                readOnly={!isCustomDate}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gym-accent focus:border-transparent ${
                  !isCustomDate ? "bg-gray-100" : ""
                }`}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gym-accent focus:border-transparent"
              placeholder="Special instructions or notes..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => setShowMemberModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gym-accent text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center cursor-pointer"
            >
              <FaSave className="mr-2" /> Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
