import { Navigate, createFileRoute } from '@tanstack/react-router';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { useAuthQuery, useLogout } from '../hooks/useAuth';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: user, isLoading } = useAuthQuery();
  const logoutMutation = useLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <h2 className="text-2xl font-bold text-primary-700 mb-4">Welcome, {user.fullName}!</h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium text-gray-900">User ID:</span> {user.id}
            </p>
            <p>
              <span className="font-medium text-gray-900">Account Created:</span>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h3 className="font-semibold text-primary-800 mb-2">🎉 Authentication Complete!</h3>
            <p className="text-sm text-primary-700">
              Your account is set up and ready to go. This dashboard demonstrates secure
              authentication with JWT tokens and React Query for server state management.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
