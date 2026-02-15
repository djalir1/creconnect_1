import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
}

export default function StatsCard({ label, value, icon, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div 
          className={`p-4 rounded-xl ${iconColor}`}
          style={{ fontSize: '1.5rem' }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
