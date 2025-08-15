/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo } from "react";
import { parseISO, addDays, isBefore, startOfDay } from "date-fns";
import { FaUsers, FaUserPlus, FaExclamationTriangle, FaUserTimes, FaPlus, FaList, FaDownload } from "react-icons/fa";
import { useMemberContext } from "@/context/MemberContext";

/**
 * Helpers
 */
const safeParseDate = (date?: string | null): Date | null => {
  if (!date) return null;
  try {
    const d = parseISO(date);
    // parseISO may return Invalid Date; guard that
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

const colorClasses: Record<string, { border: string; btn: string; btnHover: string }> = {
  orange: { border: "border-orange-500", btn: "bg-orange-500", btnHover: "hover:bg-orange-600" },
  green: { border: "border-green-500", btn: "bg-green-500", btnHover: "hover:bg-green-600" },
  yellow: { border: "border-yellow-500", btn: "bg-yellow-500", btnHover: "hover:bg-yellow-600" },
  red: { border: "border-red-500", btn: "bg-red-500", btnHover: "hover:bg-red-600" },
  gray: { border: "border-gray-500", btn: "bg-gray-600", btnHover: "hover:bg-gray-700" },
};

const StatCard = ({ label, value, color, icon }: { label: string; value: number; color: keyof typeof colorClasses; icon: React.ReactNode }) => {
  const cls = colorClasses[color];
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${cls.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, color, icon, label }: { onClick: () => void; color: keyof typeof colorClasses; icon: React.ReactNode; label: string }) => {
  const cls = colorClasses[color];
  return (
    <button
      onClick={onClick}
      className={`${cls.btn} text-white px-6 py-3 rounded-lg ${cls.btnHover} transition-colors flex items-center cursor-pointer`}
      type="button"
    >
      {icon}
      <span className="mr-2" />
      {label}
    </button>
  );
};

const Dashboard: React.FC = () => {
  const { members: ctxMembers, setActiveSection, setShowMemberModal, recentActivities, showToastMessage } = useMemberContext();

  // ensure members is an array
  const members = Array.isArray(ctxMembers) ? ctxMembers : [];

  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const sevenDaysFromNow = addDays(today, 7);

    const activeMembers = members.filter((m: any) => m?.status === "active").length;

    const newThisMonth = members.filter((m: any) => {
      const created = safeParseDate(m?.createdAt) || safeParseDate(m?.startDate);
      return !!created && created.getMonth() === today.getMonth() && created.getFullYear() === today.getFullYear();
    }).length;

    const expiringSoon = members.filter((m: any) => {
      const end = safeParseDate(m?.endDate);
      return m?.status === "active" && end && isBefore(end, sevenDaysFromNow) && !isBefore(end, today);
    }).length;

    const expired = members.filter((m: any) => {
      const end = safeParseDate(m?.endDate);
      return m?.status === "expired" || (!!end && isBefore(end, today));
    }).length;

    return { activeMembers, newThisMonth, expiringSoon, expired };
  }, [members]);

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(members ?? [], null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gym-members-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToastMessage?.("Data exported successfully!");
    } catch (error) {
      console.error("Export JSON error:", error);
      showToastMessage?.("Export failed");
    }
  };

  const handleExportPDF = async () => {
    try {
      // dynamic import to avoid SSR issues and to load plugin properly
      const [{ default: jsPDF }, _autoTable] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
      const doc = new jsPDF();
      (doc as any).autoTable({
        head: [[ "ID", "Full Name", "Email", "Phone", "Membership", "Status", "Start Date", "End Date" ]],
        body: (members ?? []).map((m: any) => [
          m?.memberId ?? "N/A",
          m?.fullName ?? "N/A",
          m?.email ?? "N/A",
          m?.phone ?? "N/A",
          m?.membershipType ?? "N/A",
          m?.status ?? "N/A",
          m?.startDate ?? "N/A",
          m?.endDate ?? "N/A",
        ]),
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });
      doc.save(`gym-members-${new Date().toISOString().split("T")[0]}.pdf`);
      showToastMessage?.("PDF exported successfully!");
    } catch (err) {
      console.error("Export PDF error:", err);
      showToastMessage?.("PDF export failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Members" value={stats.activeMembers} color="orange" icon={<FaUsers className="text-orange-500 text-3xl" />} />
        <StatCard label="New This Month" value={stats.newThisMonth} color="green" icon={<FaUserPlus className="text-green-500 text-3xl" />} />
        <StatCard label="Expiring Soon" value={stats.expiringSoon} color="yellow" icon={<FaExclamationTriangle className="text-yellow-500 text-3xl" />} />
        <StatCard label="Expired" value={stats.expired} color="red" icon={<FaUserTimes className="text-red-500 text-3xl" />} />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <ActionButton onClick={() => setShowMemberModal(true)} color="orange" icon={<FaPlus className="mr-2" />} label="Add New Member" />
          <ActionButton onClick={() => setActiveSection("members")} color="gray" icon={<FaList className="mr-2" />} label="View All Members" />
          <ActionButton onClick={handleExportJSON} color="green" icon={<FaDownload className="mr-2" />} label="Export Data" />
          <ActionButton onClick={handleExportPDF} color="green" icon={<FaDownload className="mr-2" />} label="Export PDF" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(!recentActivities || recentActivities.length === 0) ? (
            <p className="text-gray-500 text-center py-8">No recent activity to display</p>
          ) : (
            recentActivities.map((activity: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {activity.action === "added" && <FaUserPlus className="text-green-500 mr-3" />}
                  {activity.action === "updated" && <FaExclamationTriangle className="text-blue-500 mr-3" />}
                  {activity.action === "deleted" && <FaUserTimes className="text-red-500 mr-3" />}
                  <span>Member <strong>{activity.memberName ?? "N/A"}</strong> was {activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.timestamp ?? ""}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
