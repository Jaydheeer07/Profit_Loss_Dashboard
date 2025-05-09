/**
 * Organization setup page for ProfitLens.
 * Shown when a user first logs in and needs to create or select an organization.
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization, Organization } from '@/contexts/OrganizationContext';
import OrganizationManager from '@/components/auth/OrganizationManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OrganizationSetupPage: React.FC = () => {
  const { organizations, currentOrganization, loading } = useOrganization();
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has a selected organization, redirect to dashboard
    if (!loading && currentOrganization) {
      navigate('/dashboard');
    }
  }, [currentOrganization, loading, navigate]);

  const handleOrganizationSelected = (organization: Organization) => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome to ProfitLens</h1>
          <p className="mt-2 text-sm text-gray-600">Transform Data into Decisions</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Select or Create an Organization</CardTitle>
            <CardDescription>
              Organizations help you manage your financial data and collaborate with team members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <OrganizationManager onOrganizationSelected={handleOrganizationSelected} />
              
              {organizations.length === 0 && !loading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    You don't have any organizations yet. Create your first organization to get started.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationSetupPage;
