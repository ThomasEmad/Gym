// src/utils/statusUtils.ts

import { parseISO, isBefore, addDays, startOfDay } from 'date-fns';

type MemberDisplayStatus = 'Expired' | 'Expiring Soon' | 'Active' | 'Suspended';

export const getMemberDisplayStatus = (
  status: string,
  endDateString: string
): MemberDisplayStatus => {
  
  // 1. Check for non-date-based statuses first.
  if (status === 'suspended') {
    return 'Suspended';
  }

  const today = startOfDay(new Date());
  const endDate = startOfDay(parseISO(endDateString));

  // 2. Check if the membership is already expired
  if (status === 'expired' || isBefore(endDate, today)) {
    return 'Expired';
  }

  // 3. Check if it's expiring soon (e.g., within the next 7 days)
  const sevenDaysFromNow = addDays(today, 7);
  if (isBefore(endDate, sevenDaysFromNow)) {
    return 'Expiring Soon';
  }

  // 4. Otherwise, it's active
  return 'Active';
};