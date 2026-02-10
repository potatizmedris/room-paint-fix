import { useState, useEffect, useRef } from "react";
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

interface AccountSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  onAccountDeleted: () => void;
}

const COUNTDOWN_SECONDS = 10;
const CONFIRM_PHRASE = "DELETE";

export function AccountSettings({
  open,
  onOpenChange,
  userId,
  userEmail,
  onAccountDeleted,
}: AccountSettingsProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [step, setStep] = useState<"info" | "countdown" | "confirm">("info");
  const [dataStats, setDataStats] = useState<{ favoritesCount: number; photosCount: number }>({
    favoritesCount: 0,
    photosCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => {
    if (step === "countdown") {
      setCountdown(COUNTDOWN_SECONDS);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStep("confirm");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const handleClose = () => {
    setConfirmText("");
    setStep("info");
    setCountdown(COUNTDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    setDataStats({ favoritesCount: 0, photosCount: 0 });
    onOpenChange(false);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== CONFIRM_PHRASE) {
      toast.error("Confirmation text does not match");
      return;
    }

    setIsDeleting(true);

    try {
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
              : step === "countdown"
              ? "Please wait before proceeding..."
              : "Please confirm by typing DELETE."}
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
              <Button variant="destructive" onClick={() => setStep("countdown")}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        ) : step === "countdown" ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">Are you really sure? Please wait before proceeding.</p>
              <div className="text-4xl font-bold text-destructive tabular-nums">{countdown}</div>
              <p className="text-xs text-muted-foreground mt-2">seconds remaining</p>
            </div>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Type <span className="font-mono text-destructive font-bold">{CONFIRM_PHRASE}</span> to confirm deletion
              </Label>
              <Input
                id="confirm-text"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type ${CONFIRM_PHRASE} here`}
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmText !== CONFIRM_PHRASE || isDeleting}
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
