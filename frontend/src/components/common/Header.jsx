import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderNavigationBase } from '@/components/application/app-navigation/header-navigation';
import { setActivePortal } from '../../store/uiSlice';
import { UserCheck, Briefcase } from 'lucide-react';

export const Header = () => {
  const dispatch = useDispatch();
  const activePortal = useSelector((state) => state.ui.activePortal);

  // Enterprise application portals mapped to HeaderNavigation items
  const portalItems = [
    { label: "Candidate Intelligence", href: "/candidate", id: "candidate", icon: UserCheck },
    { label: "Recruiter ATS Pipeline", href: "/recruiter", id: "recruiter", icon: Briefcase },
  ];

  return (
    <HeaderNavigationBase
      brandName="AI Candidate Intelligence"
      activeUrl={`/${activePortal}`}
      items={portalItems}
      onNavigate={(item) => dispatch(setActivePortal(item.id))}
    />
  );
};

export default Header;
