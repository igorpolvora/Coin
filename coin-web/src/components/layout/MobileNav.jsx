import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, CreditCard, PiggyBank, Target } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transações', href: '/transactions', icon: ArrowRightLeft },
  { name: 'Cartões', href: '/cards', icon: CreditCard },
  { name: 'Cofre', href: '/vault', icon: PiggyBank },
  { name: 'Orçamento', href: '/budget', icon: Target },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center h-16"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navigation.map((item) => {
        const isActive = location.pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive ? 'text-primary-600' : 'text-gray-500'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
              {item.name}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileNav;
