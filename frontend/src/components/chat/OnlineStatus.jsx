import React from 'react';

const OnlineStatus = ({ isOnline }) => {
  if (!isOnline) return null;

  return (
    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
  );
};

export default OnlineStatus;
