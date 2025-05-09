/**
 * Organization context for ProfitLens.
 * Manages organization state and provides organization management methods.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from './AuthContext';

// Define types
export type Organization = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
};

type OrganizationContextType = {
  organizations: Organization[];
  currentOrganization: Organization | null;
  loading: boolean;
  error: string | null;
  fetchOrganizations: () => Promise<void>;
  createOrganization: (name: string) => Promise<Organization | null>;
  switchOrganization: (organizationId: string) => void;
  getOrganizationMembers: (organizationId: string) => Promise<OrganizationMember[]>;
  inviteMember: (organizationId: string, email: string, role: 'admin' | 'member') => Promise<boolean>;
  updateMemberRole: (memberId: string, role: 'admin' | 'member') => Promise<boolean>;
  removeMember: (memberId: string) => Promise<boolean>;
};

// Create the context with default values
const OrganizationContext = createContext<OrganizationContextType>({
  organizations: [],
  currentOrganization: null,
  loading: false,
  error: null,
  fetchOrganizations: async () => {},
  createOrganization: async () => null,
  switchOrganization: () => {},
  getOrganizationMembers: async () => [],
  inviteMember: async () => false,
  updateMemberRole: async () => false,
  removeMember: async () => false,
});

// Custom hook to use the organization context
export const useOrganization = () => useContext(OrganizationContext);

// Provider component
export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizations when the user changes
  useEffect(() => {
    if (user) {
      fetchOrganizations();
    } else {
      setOrganizations([]);
      setCurrentOrganization(null);
    }
  }, [user]);

  // Load the current organization from localStorage
  useEffect(() => {
    const storedOrgId = localStorage.getItem('currentOrganizationId');
    if (storedOrgId && organizations.length > 0) {
      const org = organizations.find(o => o.id === storedOrgId);
      if (org) {
        setCurrentOrganization(org);
      } else if (organizations.length > 0) {
        // If the stored org doesn't exist, use the first one
        setCurrentOrganization(organizations[0]);
        localStorage.setItem('currentOrganizationId', organizations[0].id);
      }
    } else if (organizations.length > 0) {
      // If no stored org, use the first one
      setCurrentOrganization(organizations[0]);
      localStorage.setItem('currentOrganizationId', organizations[0].id);
    }
  }, [organizations]);

  // Fetch organizations for the current user
  const fetchOrganizations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get organization memberships for the user
      const { data: memberships, error: membershipError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);
      
      if (membershipError) {
        throw membershipError;
      }
      
      if (memberships.length === 0) {
        setOrganizations([]);
        setCurrentOrganization(null);
        return;
      }
      
      // Get organization details
      const organizationIds = memberships.map(m => m.organization_id);
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', organizationIds);
      
      if (orgsError) {
        throw orgsError;
      }
      
      setOrganizations(orgs);
    } catch (err: any) {
      console.error('Error fetching organizations:', err);
      setError(err.message || 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  // Create a new organization
  const createOrganization = async (name: string): Promise<Organization | null> => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      // Create the organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ name })
        .select()
        .single();
      
      if (orgError) {
        throw orgError;
      }
      
      // Add the current user as the owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'owner'
        });
      
      if (memberError) {
        // Rollback organization creation
        await supabase.from('organizations').delete().eq('id', org.id);
        throw memberError;
      }
      
      // Update the organizations list
      setOrganizations(prev => [...prev, org]);
      
      // Set as current organization if it's the first one
      if (organizations.length === 0) {
        setCurrentOrganization(org);
        localStorage.setItem('currentOrganizationId', org.id);
      }
      
      return org;
    } catch (err: any) {
      console.error('Error creating organization:', err);
      setError(err.message || 'Failed to create organization');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Switch to a different organization
  const switchOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      localStorage.setItem('currentOrganizationId', org.id);
    }
  };

  // Get members of an organization
  const getOrganizationMembers = async (organizationId: string): Promise<OrganizationMember[]> => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', organizationId);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching organization members:', err);
      setError(err.message || 'Failed to fetch organization members');
      return [];
    }
  };

  // Invite a new member to an organization
  const inviteMember = async (organizationId: string, email: string, role: 'admin' | 'member'): Promise<boolean> => {
    try {
      // This is a simplified version. In a real app, you would:
      // 1. Check if the user exists in your system
      // 2. If yes, add them directly
      // 3. If no, send an invitation email
      
      // For now, we'll assume the user exists and we know their ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError) {
        throw new Error('User not found');
      }
      
      const { error } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organizationId,
          user_id: userData.id,
          role
        });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error inviting member:', err);
      setError(err.message || 'Failed to invite member');
      return false;
    }
  };

  // Update a member's role
  const updateMemberRole = async (memberId: string, role: 'admin' | 'member'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('id', memberId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error updating member role:', err);
      setError(err.message || 'Failed to update member role');
      return false;
    }
  };

  // Remove a member from an organization
  const removeMember = async (memberId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error removing member:', err);
      setError(err.message || 'Failed to remove member');
      return false;
    }
  };

  // Create the context value
  const value = {
    organizations,
    currentOrganization,
    loading,
    error,
    fetchOrganizations,
    createOrganization,
    switchOrganization,
    getOrganizationMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
  };

  // Return the provider
  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};
