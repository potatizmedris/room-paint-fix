import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState as useStateReact } from "react";

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  onAccountDeleted: () => void;
}

export function AccountSettings({
  open,
  onOpenChange,
  userId,
  userEmail,
  onAccountDeleted,
}: AccountSettingsProps) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState<"info" | "confirm">("info");
  const [dataStats, setDataStats] = useState<{ favoritesCount: number; photosCount: number }>({ 
    favoritesCount: 0, 
    photosCount: 0 
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (open && userId) {
      setLoadingStats(true);
      supabase
        .from("favorites")
        .select("id, photo_url")
        .eq("user_id", userId)
        .then(({ data }) => {
          if (data) {
            setDataStats({
              favoritesCount: data.length,
              photosCount: data.filter((f) => f.photo_url).length,
            });
          }
          setLoadingStats(false);
        });
    }
  }, [open, userId]);

  const handleClose = () => {
    setConfirmEmail("");
    setStep("info");
    setDataStats({ favoritesCount: 0, photosCount: 0 });
    onOpenChange(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail !== userEmail) {
      toast.error("Email does not match");
      return;
    }

    setIsDeleting(true);

    try {
      // Edge function handles all data cleanup (favorites, photos, then account)
      const { error: deleteError } = await supabase.functions.invoke("delete-user-account");

      if (deleteError) {
        throw deleteError;
      }

      toast.success("Your account has been deleted");
      onAccountDeleted();
      handleClose();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            {step === "info"
              ? "This action cannot be undone. All your data will be permanently deleted."
              : "Please confirm by typing your email address."}
          </DialogDescription>
        </DialogHeader>

        {step === "info" ? (
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-destructive">The following will be permanently deleted:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Your account and login credentials</li>
                    <li>• All saved favorite colors {!loadingStats && dataStats.favoritesCount > 0 && (
                      <span className="text-destructive font-medium">({dataStats.favoritesCount} saved)</span>
                    )}</li>
                    <li>• All uploaded photos {!loadingStats && dataStats.photosCount > 0 && (
                      <span className="text-destructive font-medium">({dataStats.photosCount} photos)</span>
                    )}</li>
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setStep("confirm")}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                Type <span className="font-mono text-foreground">{userEmail}</span> to confirm
              </Label>
              <Input
                id="confirm-email"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isDeleting}
              />
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setStep("info")} disabled={isDeleting}>
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmEmail !== userEmail || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete My Account"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
