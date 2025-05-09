/**
 * Organization management component for ProfitLens.
 * Allows users to create, select, and manage organizations.
 */
import React, { useState, useEffect } from 'react';
import { useOrganization, Organization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Check, Building, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface OrganizationManagerProps {
  onOrganizationSelected?: (organization: Organization) => void;
}

const OrganizationManager: React.FC<OrganizationManagerProps> = ({ onOrganizationSelected }) => {
  const { organizations, currentOrganization, loading, createOrganization, switchOrganization, fetchOrganizations } = useOrganization();
  const [newOrgName, setNewOrgName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    if (currentOrganization && onOrganizationSelected) {
      onOrganizationSelected(currentOrganization);
    }
  }, [currentOrganization, onOrganizationSelected]);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrgName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an organization name',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsCreating(true);
      const org = await createOrganization(newOrgName);
      
      if (org) {
        toast({
          title: 'Success',
          description: `Organization "${org.name}" created successfully`,
        });
        
        setNewOrgName('');
        setIsDialogOpen(false);
        
        if (onOrganizationSelected) {
          onOrganizationSelected(org);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create organization',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSwitchOrganization = (organizationId: string) => {
    switchOrganization(organizationId);
    
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      toast({
        title: 'Organization Switched',
        description: `Now working in "${org.name}"`,
      });
    }
  };

  if (loading && organizations.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading organizations...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Organization Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              {currentOrganization ? currentOrganization.name : 'Select Organization'}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Your Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSwitchOrganization(org.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                {org.name}
                {currentOrganization?.id === org.id && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Organization
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
                <DialogDescription>
                  Create a new organization to manage your financial data.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrganization}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      placeholder="Acme Inc."
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Organization'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrganizationManager;
