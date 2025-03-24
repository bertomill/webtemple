// Enable client-side functionality in Next.js
'use client';

// Import necessary React hooks and form handling library
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// Define TypeScript interfaces for form data structure
interface BusinessFormData {
  business_idea: string;
  industry: string;
  target_audience: string;
  key_features: string;
}

// Define interface for competitor information
interface Competitor {
  name: string;
  website: string;
}

// Define interface for the complete analysis response from the API
interface AnalysisResponse {
  competitors: Competitor[];
  recommendation: string;
}

// Main component for the home page
export default function Home() {
  // State management for loading status, analysis results, and errors
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize form handling with React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessFormData>();

  // Handle form submission
  const onSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Send POST request to backend API
      const response = await fetch('https://webtemple.vercel.app/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response was successful
      if (!response.ok) {
        throw new Error('Failed to analyze business');
      }

      // Parse and store the analysis results
      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      // Handle and display any errors that occur
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false);
    }
  };

  return (
    // Main container with responsive padding and maximum width
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-8 text-center">
        Website Design Research Assistant
      </h1>

      {/* Business analysis form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
        {/* Business Idea input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Idea
          </label>
          <textarea
            {...register('business_idea', { required: 'Please describe your business idea' })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe your business idea..."
          />
          {errors.business_idea && (
            <p className="mt-1 text-sm text-red-600">{errors.business_idea.message}</p>
          )}
        </div>

        {/* Industry input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <input
            type="text"
            {...register('industry', { required: 'Please specify your industry' })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Healthcare, Technology, Education"
          />
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
          )}
        </div>

        {/* Target Audience input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Audience
          </label>
          <input
            type="text"
            {...register('target_audience', { required: 'Please specify your target audience' })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Young professionals, Small business owners"
          />
          {errors.target_audience && (
            <p className="mt-1 text-sm text-red-600">{errors.target_audience.message}</p>
          )}
        </div>

        {/* Key Features input field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key Features
          </label>
          <textarea
            {...register('key_features', { required: 'Please list your key features' })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="List the main features of your product/service..."
          />
          {errors.key_features && (
            <p className="mt-1 text-sm text-red-600">{errors.key_features.message}</p>
          )}
        </div>

        {/* Submit button with loading state */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Business'}
        </button>
      </form>

      {/* Error message display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Analysis results display */}
      {analysis && (
        <div className="mt-8 space-y-6">
          {/* Competitor Analysis section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Competitor Analysis</h2>
            <ul className="space-y-4">
              {analysis.competitors.map((competitor, index) => (
                <li key={index} className="border-b pb-2">
                  <h3 className="font-medium">{competitor.name}</h3>
                  <a
                    href={competitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit Website →
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Design Recommendations section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Design Recommendations</h2>
            <div className="prose max-w-none">
              {analysis.recommendation.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
