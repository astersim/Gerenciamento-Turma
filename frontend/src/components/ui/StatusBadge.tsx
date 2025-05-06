import React from 'react';

interface StatusBadgeProps {
  active: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ active }) => {
  return (
    <span className={`badge ${active ? 'bg-success' : 'bg-danger'}`}>
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
};

export default StatusBadge;