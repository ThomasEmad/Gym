'use client'
import { FaCheckCircle } from 'react-icons/fa';
import { useMemberContext } from '@/context/MemberContext';

const Toast: React.FC = () => {
  const { showToast, toastMessage } = useMemberContext();

  if (!showToast) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
      <div className="flex items-center">
        <FaCheckCircle className="mr-2" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

export default Toast;