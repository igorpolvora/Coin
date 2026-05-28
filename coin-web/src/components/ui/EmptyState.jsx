import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
