import { Link } from '@tanstack/react-router';
import { Button } from '../ui/Button';

interface HeaderProps {
  user?: { fullName: string; email: string } | null;
  onLogout?: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo-modelia.PQ_YE_P7.svg" alt="Modelia" className="h-8 w-auto" />
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, <span className="font-medium text-primary-600">{user.fullName}</span>
                </span>
                {onLogout && (
                  <Button onClick={onLogout} variant="outline" className="text-sm">
                    Logout
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" className="text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
