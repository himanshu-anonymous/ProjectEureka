'use client';

import React from 'react';

export const NotFoundMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-md space-y-2 mt-4">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-content-primary">
        Page Not Found
      </h2>
      <p className="text-sm text-content-secondary leading-relaxed">
        The operational page or dataset you are looking for does not exist, has been archived, or moved to a different location.
      </p>
    </div>
  );
};
