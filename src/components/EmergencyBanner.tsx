import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Language } from '../types';

interface EmergencyBannerProps {
  isVisible: boolean;
  lang: Language;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ isVisible, lang }) => {
  if (!isVisible) return null;
  const isAr = lang === 'ar';

  return (
    <div className="bg-red-950/90 border-b border-red-500 text-red-200 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 animate-pulse sticky top-[69px] z-30">
      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
      <span>
        {isAr
          ? 'تحذير طوارئ: تم تفعيل زر الإيقاف السريع (Kill Switch)! تم تعليق كافة الوكلاء واستدعاءات الـ API لحماية النظام والبيانات.'
          : 'EMERGENCY SHUTDOWN ACTIVE: Rapid Kill Switch engaged. All agent execution and API billing routes are temporarily frozen.'}
      </span>
    </div>
  );
};
