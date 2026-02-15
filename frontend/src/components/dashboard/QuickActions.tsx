import { FaCalendar, FaUsers, FaChartLine } from 'react-icons/fa';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface QuickActionsProps {
  onCalendarClick?: () => void;
  onClientsClick?: () => void;
  onAnalyticsClick?: () => void;
}

export default function QuickActions({ onCalendarClick, onClientsClick, onAnalyticsClick }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'calendar',
      label: 'Manage Calendar',
      icon: <FaCalendar className="text-indigo-600" />,
      onClick: () => onCalendarClick ? onCalendarClick() : console.log('Manage Calendar clicked')
    },
    {
      id: 'clients',
      label: 'View Clients',
      icon: <FaUsers className="text-indigo-600" />,
      onClick: () => onClientsClick ? onClientsClick() : console.log('View Clients clicked')
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <FaChartLine className="text-indigo-600" />,
      onClick: () => onAnalyticsClick ? onAnalyticsClick() : console.log('Analytics clicked')
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 group"
          >
            <div className="text-2xl">{action.icon}</div>
            <span className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
