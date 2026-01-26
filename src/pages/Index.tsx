import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ColorPicker, type ColorOption } from "@/components/ColorPicker";
import { ImagePreview } from "@/components/ImagePreview";
import { ProcessingOverlay } from "@/components/ProcessingOverlay";
import { AuthDialog } from "@/components/AuthDialog";
import { useWallColorChanger } from "@/hooks/useWallColorChanger";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { Paintbrush, Sparkles, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  const { isProcessing, processedImage, changeWallColor, clearProcessedImage } = useWallColorChanger();
  const { user, loading: authLoading, signOut } = useAuth();
  const { favorites, loading: favoritesLoading, addFavorite, removeFavorite, isFavorite } = useFavorites(user?.id);

  const handleImageSelect = (imageData: string) => {
    setOriginalImage(imageData);
    clearProcessedImage();
  };

  const handleClearImage = () => {
    setOriginalImage(null);
    setSelectedColor(null);
    clearProcessedImage();
  };

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    if (originalImage) {
      changeWallColor(originalImage, color);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Paintbrush className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">Wall Color Studio</h1>
              <p className="text-xs text-muted-foreground">Visualize your perfect wall color</p>
            </div>
          </div>

          {/* Auth Section */}
          <div>
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setAuthDialogOpen(true)}>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!originalImage ? (
            // Upload State
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-semibold text-foreground mb-3">
                  Transform Your Walls
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Take a photo of any wall and instantly see how different colors would look in your space
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>

              {/* Features */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI accurately identifies walls and applies realistic color changes
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <Paintbrush className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">12+ Colors</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from curated designer colors or pick your own custom shade
                  </p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Compare & Download</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between before and after, then download your visualization
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Editor State
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image Preview */}
                <div className="lg:col-span-2 relative">
                  <ImagePreview
                    originalImage={originalImage}
                    processedImage={processedImage}
                    onClear={handleClearImage}
                  />
                  {isProcessing && (
                    <ProcessingOverlay colorName={selectedColor?.name} />
                  )}
                </div>

                {/* Color Picker Sidebar */}
                <div className="glass-card rounded-2xl p-6">
                  <ColorPicker
                    selectedColor={selectedColor}
                    onColorSelect={handleColorSelect}
                    disabled={isProcessing}
                    favorites={favorites}
                    favoritesLoading={favoritesLoading}
                    onAddFavorite={addFavorite}
                    onRemoveFavorite={removeFavorite}
                    isFavorite={isFavorite}
                    currentPhoto={originalImage}
                    isAuthenticated={!!user}
                    onAuthRequired={() => setAuthDialogOpen(true)}
                  />

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Tip: Click any color to instantly preview it on your wall. The AI will preserve all furniture and decorations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by AI • Results may vary based on image quality and lighting
          </p>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default Index;
