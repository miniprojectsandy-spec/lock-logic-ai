import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VaultSidebar } from '@/components/VaultSidebar';
import { CredentialCard } from '@/components/CredentialCard';
import { CredentialDialog, CredentialFormData } from '@/components/CredentialDialog';
import { PasswordGenerator } from '@/components/PasswordGenerator';
import { BreachChecker } from '@/components/BreachChecker';
import { AIChatbot } from '@/components/AIChatbot';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Lock, 
  User,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { EncryptionService } from '@/lib/encryption';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Credential {
  id: string;
  user_id: string;
  title: string;
  website_url?: string | null;
  username?: string | null;
  encrypted_password: string;
  notes?: string | null;
  category: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export default function Vault() {
  const { user, masterPassword, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [breachCheckerOpen, setBreachCheckerOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!loading && (!user || !masterPassword)) {
      navigate('/auth');
    }
  }, [user, masterPassword, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCredentials();
    }
  }, [user]);

  useEffect(() => {
    filterCredentials();
    calculateCategoryCounts();
  }, [credentials, searchQuery, selectedCategory]);

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error: any) {
      toast.error('Failed to load credentials');
      console.error(error);
    }
  };

  const filterCredentials = () => {
    let filtered = credentials;

    // Category filter
    if (selectedCategory === 'Favorites') {
      filtered = filtered.filter(c => c.is_favorite);
    } else if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.username?.toLowerCase().includes(query) ||
          c.website_url?.toLowerCase().includes(query) ||
          c.notes?.toLowerCase().includes(query)
      );
    }

    setFilteredCredentials(filtered);
  };

  const calculateCategoryCounts = () => {
    const counts: Record<string, number> = {
      All: credentials.length,
      Favorites: credentials.filter(c => c.is_favorite).length,
    };

    const categories = ['Social', 'Work', 'Finance', 'Email', 'Gaming', 'Shopping', 'Personal'];
    categories.forEach(cat => {
      counts[cat] = credentials.filter(c => c.category === cat).length;
    });

    setCategoryCounts(counts);
  };

  const handleSaveCredential = async (formData: CredentialFormData) => {
    if (!masterPassword) {
      toast.error('Master password not available');
      return;
    }

    try {
      const encryptedPassword = EncryptionService.encrypt(formData.password, masterPassword);

      if (editingCredential) {
        const { error } = await supabase
          .from('credentials')
          .update({
            title: formData.title,
            website_url: formData.website_url || null,
            username: formData.username || null,
            encrypted_password: encryptedPassword,
            notes: formData.notes || null,
            category: formData.category,
          })
          .eq('id', editingCredential.id);

        if (error) throw error;
        toast.success('Credential updated successfully');
      } else {
        const { error } = await supabase.from('credentials').insert({
          title: formData.title,
          website_url: formData.website_url || null,
          username: formData.username || null,
          encrypted_password: encryptedPassword,
          notes: formData.notes || null,
          category: formData.category,
          user_id: user!.id,
        });

        if (error) throw error;
        toast.success('Credential added successfully');
      }

      await fetchCredentials();
      setEditingCredential(null);
    } catch (error: any) {
      toast.error('Failed to save credential');
      console.error(error);
      throw error;
    }
  };

  const handleDeleteCredential = async () => {
    if (!credentialToDelete) return;

    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', credentialToDelete);

      if (error) throw error;
      toast.success('Credential deleted successfully');
      await fetchCredentials();
    } catch (error: any) {
      toast.error('Failed to delete credential');
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setCredentialToDelete(null);
    }
  };

  const handleToggleFavorite = async (credential: Credential) => {
    try {
      const { error } = await supabase
        .from('credentials')
        .update({ is_favorite: !credential.is_favorite })
        .eq('id', credential.id);

      if (error) throw error;
      toast.success(credential.is_favorite ? 'Removed from favorites' : 'Added to favorites');
      await fetchCredentials();
    } catch (error: any) {
      toast.error('Failed to update favorite status');
      console.error(error);
    }
  };

  const handleEdit = (credential: Credential) => {
    if (!masterPassword) {
      toast.error('Master password not available');
      return;
    }

    try {
      const decryptedPassword = EncryptionService.decrypt(
        credential.encrypted_password,
        masterPassword
      );

      setEditingCredential(credential);
      setDialogOpen(true);
    } catch (error) {
      toast.error('Failed to decrypt password');
    }
  };

  const handleExport = () => {
    if (!masterPassword) {
      toast.error('Master password not available');
      return;
    }

    try {
      const exportData = credentials.map(c => ({
        ...c,
        password: EncryptionService.decrypt(c.encrypted_password, masterPassword),
        encrypted_password: undefined,
      }));

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `secure-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Vault exported successfully');
    } catch (error) {
      toast.error('Failed to export vault');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Lock className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading vault...</p>
        </div>
      </div>
    );
  }

  if (!user || !masterPassword) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <VaultSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categoryCounts={categoryCounts}
          onGeneratorClick={() => setGeneratorOpen(true)}
          onBreachCheckerClick={() => setBreachCheckerOpen(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search credentials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Credential
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatbotOpen(true)}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleExport}>
                <Download className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={signOut}>
                <Lock className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Credentials Grid */}
        <main className="flex-1 overflow-y-auto p-6">
          {filteredCredentials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Lock className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? 'No credentials found'
                  : selectedCategory === 'All'
                  ? 'No credentials yet'
                  : `No credentials in ${selectedCategory}`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first credential'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Credential
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCredentials.map((credential) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  onEdit={() => handleEdit(credential)}
                  onDelete={() => {
                    setCredentialToDelete(credential.id);
                    setDeleteDialogOpen(true);
                  }}
                  onToggleFavorite={() => handleToggleFavorite(credential)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <CredentialDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingCredential(null);
        }}
        onSave={handleSaveCredential}
        initialData={
          editingCredential
            ? {
                title: editingCredential.title,
                website_url: editingCredential.website_url || '',
                username: editingCredential.username || '',
                password: masterPassword
                  ? EncryptionService.decrypt(editingCredential.encrypted_password, masterPassword)
                  : '',
                notes: editingCredential.notes || '',
                category: editingCredential.category,
              }
            : null
        }
      />

      <Dialog open={generatorOpen} onOpenChange={setGeneratorOpen}>
        <DialogContent className="max-w-lg">
          <PasswordGenerator />
        </DialogContent>
      </Dialog>

      <Dialog open={breachCheckerOpen} onOpenChange={setBreachCheckerOpen}>
        <DialogContent className="max-w-lg">
          <BreachChecker />
        </DialogContent>
      </Dialog>

      <Dialog open={chatbotOpen} onOpenChange={setChatbotOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <AIChatbot />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credential</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this credential? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCredential} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}