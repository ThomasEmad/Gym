'use client'
import React, { useState } from 'react';
import { FaDumbbell, FaChartBar, FaUsers, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useMemberContext } from '@/context/MemberContext';

const Navigation: React.FC = () => {
  const { activeSection, setActiveSection } = useMemberContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Type-safe navItems to match activeSection type
  const navItems: { id: 'dashboard' | 'members'; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FaChartBar,
      color: 'text-blue-600'
    },
    {
      id: 'members',
      label: 'Members',
      icon: FaUsers,
      color: 'text-green-600'
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FaDumbbell className="text-orange-500 text-2xl" />
            <h1 className="text-xl font-bold text-gray-800">FitTrack</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`text-lg ${isActive ? 'text-orange-600' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50">
            <FaUserCircle className="text-gray-500 text-xl" />
            <div>
              <p className="text-sm font-medium text-gray-700">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
