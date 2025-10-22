import { Link, Navigate, createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthQuery, useLogout } from '../hooks/useAuth';
import { useGenerate } from '../hooks/useGeneration';

export const Route = createFileRoute('/studio')({
  component: StudioPage,
});

function StudioPage() {
  const { data: user, isLoading: isAuthLoading } = useAuthQuery();
  const logoutMutation = useLogout();
  const generateMutation = useGenerate();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  if (isAuthLoading) {
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) {
      return;
    }

    generateMutation.mutate(
      { image: selectedImage, prompt: prompt.trim() },
      {
        onSuccess: () => {
          setSelectedImage(null);
          setImagePreview(null);
          setPrompt('');
          window.location.href = '/dashboard';
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-primary-50 via-white to-secondary-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">AI Fashion Studio</h1>
          <p className="text-gray-600">Transform your fashion images with AI-powered generation</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="h-fit">
            <h2 className="text-2xl font-bold text-primary-700 mb-6">Create Generation</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="text-6xl">📸</div>
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the fashion transformation you want..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!selectedImage || !prompt.trim() || generateMutation.isPending}
              isLoading={generateMutation.isPending}
              className="w-full"
            >
              {generateMutation.isPending ? 'Generating...' : 'Generate Image'}
            </Button>

            {generateMutation.isError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠️ {generateMutation.error?.message || 'Generation failed. Please try again.'}
                </p>
              </div>
            )}

            {generateMutation.isSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Image generated successfully! Redirecting to dashboard...
                </p>
              </div>
            )}
          </Card>

          <div className="mt-6 text-center">
            <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
