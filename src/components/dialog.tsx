import { FC } from 'react';

interface DialogProps {
  children: React.ReactNode;
}

export const Dialog: FC<DialogProps> = ({ children }) => (
  <div className="absolute top-0 left-0 z-10 h-full w-full bg-sky-900 bg-opacity-30 pt-20">
    <div className="h-full rounded-t-lg bg-gray-50 p-4 drop-shadow-md">
      {children}
    </div>
  </div>
);
