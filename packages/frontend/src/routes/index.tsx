import { Navigate, createFileRoute } from '@tanstack/react-router';
import { authService } from '../services/auth.service';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  const isAuthenticated = authService.isAuthenticated();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />;
}
