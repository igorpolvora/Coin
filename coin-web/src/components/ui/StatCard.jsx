import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  // Map bg classes to text classes for the icon
  const textColorClass = colorClass.replace('bg-', 'text-');
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow duration-200">
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${textColorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
