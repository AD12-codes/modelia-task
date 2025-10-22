import { Link, Navigate, createFileRoute } from '@tanstack/react-router';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { useAuthQuery, useLogout } from '../hooks/useAuth';
import { useGenerations } from '../hooks/useGeneration';
import type { Generation } from '../services/generation.service';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: user, isLoading } = useAuthQuery();
  const logoutMutation = useLogout();
  const { data: generations, isLoading: isGenerationsLoading } = useGenerations();

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-700">Welcome, {user.fullName}!</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          <Link
            to="/studio"
            className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            AI Studio
          </Link>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-primary-700 mb-6">Your Generations</h2>

          {isGenerationsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
          ) : generations && generations.length > 0 ? (
            <div className="space-y-4">
              {generations.map((gen: Generation) => (
                <div
                  key={gen.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">Input Image</p>
                      <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                        <img
                          src={`http://localhost:3001${gen.inputImageUrl}`}
                          alt="Input"
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">Generated Output</p>
                      <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                        <img
                          src={gen.outputImageUrl}
                          alt="Output"
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Prompt:</span> {gen.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {new Date(gen.createdAt).toLocaleString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          gen.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {gen.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="text-7xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No generations yet</h3>
              <p className="mb-6">Start creating amazing fashion transformations!</p>
              <Link
                to="/studio"
                className="inline-block px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Your First Generation
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
