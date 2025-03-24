// Enable client-side functionality in Next.js
'use client';

// Import necessary React hooks and form handling library
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// Define TypeScript interfaces for form data structure
interface BusinessData {
  businessIdea: string;
  industry: string;
  targetAudience: string;
  keyFeatures: string;
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

// Define the API URL based on environment
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000/api' 
  : '/api';

interface Analysis {
  competitors: string[] | string;
  design: string;
}

// Main component for the home page
export default function Home() {
  // State management for loading status, analysis results, and errors
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);
  
  // Initialize form handling with React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessData>();

  // Handle form submission
  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert FormData to a proper object
      const data: BusinessData = {
        businessIdea: formData.get('businessIdea')?.toString() || '',
        industry: formData.get('industry')?.toString() || '',
        targetAudience: formData.get('targetAudience')?.toString() || '',
        keyFeatures: formData.get('keyFeatures')?.toString() || ''
      };

      console.log('Sending request to:', API_URL);
      console.log('Request data:', data);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${responseText}`);
      }

      const result = JSON.parse(responseText);
      setResult(result);

    } catch (error) {
      console.error('Error in onSubmit:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
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
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);
      }} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
        {/* Business Idea input field */}
        <div>
          <label htmlFor="businessIdea" className="block text-sm font-medium text-gray-700">
            Business Idea
          </label>
          <textarea
            id="businessIdea"
            name="businessIdea"
            {...register('businessIdea', { required: 'Please describe your business idea' })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe your business idea..."
          />
          {errors.businessIdea && (
            <p className="mt-1 text-sm text-red-600">{errors.businessIdea.message}</p>
          )}
        </div>

        {/* Industry input field */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
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
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
            Target Audience
          </label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            {...register('targetAudience', { required: 'Please specify your target audience' })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Young professionals, Small business owners"
          />
          {errors.targetAudience && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAudience.message}</p>
          )}
        </div>

        {/* Key Features input field */}
        <div>
          <label htmlFor="keyFeatures" className="block text-sm font-medium text-gray-700">
            Key Features
          </label>
          <textarea
            id="keyFeatures"
            name="keyFeatures"
            {...register('keyFeatures', { required: 'Please list your key features' })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="List the main features of your product/service..."
          />
          {errors.keyFeatures && (
            <p className="mt-1 text-sm text-red-600">{errors.keyFeatures.message}</p>
          )}
        </div>

        {/* Submit button with loading state */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
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
      {result && (
        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Competitors Analysis</h2>
            {Array.isArray(result.competitors) ? (
              <ul className="list-disc pl-5">
                {result.competitors.map((competitor, index) => (
                  <li key={index} className="mb-2">{competitor}</li>
                ))}
              </ul>
            ) : (
              <p className="whitespace-pre-wrap">{result.competitors}</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Design Recommendations</h2>
            <p className="whitespace-pre-wrap">{result.design}</p>
          </div>
        </div>
      )}
    </main>
  );
}
