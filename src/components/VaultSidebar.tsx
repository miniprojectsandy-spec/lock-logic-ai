import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Grid, 
  Star, 
  Globe, 
  Briefcase, 
  Wallet, 
  Mail, 
  Gamepad2, 
  ShoppingBag, 
  User,
  RefreshCw,
  Shield,
  Image as ImageIcon,
  Users,
  Plane,
  Calendar,
  FileText,
  BookOpen
} from 'lucide-react';

interface VaultSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: Record<string, number>;
  onGeneratorClick?: () => void;
  onBreachCheckerClick?: () => void;
  isPhotoVault?: boolean;
  isDocumentVault?: boolean;
}

const credentialCategoryIcons: Record<string, React.ReactNode> = {
  'All': <Grid className="h-4 w-4" />,
  'Favorites': <Star className="h-4 w-4" />,
  'Social': <Globe className="h-4 w-4" />,
  'Work': <Briefcase className="h-4 w-4" />,
  'Finance': <Wallet className="h-4 w-4" />,
  'Email': <Mail className="h-4 w-4" />,
  'Gaming': <Gamepad2 className="h-4 w-4" />,
  'Shopping': <ShoppingBag className="h-4 w-4" />,
  'Personal': <User className="h-4 w-4" />,
};

const photoCategoryIcons: Record<string, React.ReactNode> = {
  'All': <Grid className="h-4 w-4" />,
  'Favorites': <Star className="h-4 w-4" />,
  'Personal': <User className="h-4 w-4" />,
  'Family': <Users className="h-4 w-4" />,
  'Work': <Briefcase className="h-4 w-4" />,
  'Travel': <Plane className="h-4 w-4" />,
  'Events': <Calendar className="h-4 w-4" />,
  'Documents': <FileText className="h-4 w-4" />,
};

const documentCategoryIcons: Record<string, React.ReactNode> = {
  'All': <Grid className="h-4 w-4" />,
  'Favorites': <Star className="h-4 w-4" />,
  'Personal': <User className="h-4 w-4" />,
  'Work': <Briefcase className="h-4 w-4" />,
  'Financial': <Wallet className="h-4 w-4" />,
  'Legal': <Shield className="h-4 w-4" />,
  'Medical': <FileText className="h-4 w-4" />,
  'Education': <FileText className="h-4 w-4" />,
  'Other': <FileText className="h-4 w-4" />,
};

const credentialCategories = ['All', 'Favorites', 'Social', 'Work', 'Finance', 'Email', 'Gaming', 'Shopping', 'Personal'];
const photoCategories = ['All', 'Favorites', 'Personal', 'Family', 'Work', 'Travel', 'Events', 'Documents'];
const documentCategories = ['All', 'Favorites', 'Personal', 'Work', 'Financial', 'Legal', 'Medical', 'Education', 'Other'];

export function VaultSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  categoryCounts,
  onGeneratorClick,
  onBreachCheckerClick,
  isPhotoVault = false,
  isDocumentVault = false
}: VaultSidebarProps) {
  const navigate = useNavigate();
  const categories = isDocumentVault ? documentCategories : isPhotoVault ? photoCategories : credentialCategories;
  const categoryIcons = isDocumentVault ? documentCategoryIcons : isPhotoVault ? photoCategoryIcons : credentialCategoryIcons;

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            {isDocumentVault ? (
              <FileText className="h-5 w-5 text-primary-foreground" />
            ) : isPhotoVault ? (
              <ImageIcon className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Lock className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              {isDocumentVault ? 'Document Vault' : isPhotoVault ? 'Photo Vault' : 'Secure Vault'}
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              {categoryCounts.All || 0} {isDocumentVault ? 'document' : isPhotoVault ? 'photo' : 'credential'}{(categoryCounts.All || 0) !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          <div className="mb-3">
            <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide px-3 mb-2">
              Categories
            </p>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  selectedCategory === category 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {categoryIcons[category]}
                <span className="flex-1 text-left">{category}</span>
                <span className="text-xs text-sidebar-foreground/60">
                  {categoryCounts[category] || 0}
                </span>
              </Button>
            ))}
          </div>

          <div className="pt-3 border-t border-sidebar-border">
            <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wide px-3 mb-2">
              Navigation
            </p>
            {isDocumentVault ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => navigate('/vault')}
                >
                  <Lock className="h-4 w-4" />
                  <span>Password Vault</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => navigate('/photos')}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Photo Vault</span>
                </Button>
              </>
            ) : isPhotoVault ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => navigate('/vault')}
                >
                  <Lock className="h-4 w-4" />
                  <span>Password Vault</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => navigate('/documents')}
                >
                  <FileText className="h-4 w-4" />
                  <span>Document Vault</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => navigate('/photos')}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Photo Vault</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => navigate('/documents')}
                >
                  <FileText className="h-4 w-4" />
                  <span>Document Vault</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={() => navigate('/articles')}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Security Articles</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={onGeneratorClick}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Generator</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  onClick={onBreachCheckerClick}
                >
                  <Shield className="h-4 w-4" />
                  <span>Check Breach</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
