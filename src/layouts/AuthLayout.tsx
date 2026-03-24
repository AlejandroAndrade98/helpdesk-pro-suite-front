import React from 'react';
import { useTranslation } from 'react-i18next';
import { Headset } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(221 83% 25%) 50%, hsl(221 83% 35%) 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            <Headset className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">{t('appName')}</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-white" style={{ lineHeight: '1.1' }}>
            Streamline your<br />support operations
          </h1>
          <p className="max-w-md text-lg text-white/70">
            Manage tickets, track progress, and deliver exceptional customer support — all in one place.
          </p>
        </div>
        <p className="text-sm text-white/40">© 2026 HelpDesk. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Headset className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">{t('appName')}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
