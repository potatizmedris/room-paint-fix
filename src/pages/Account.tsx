import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Trash2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { UserMenu } from "@/components/UserMenu";
import { AccountSettings } from "@/components/AccountSettings";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setUpdatingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setUpdatingEmail(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Confirmation sent",
        description: "Check your new email inbox to confirm the change.",
      });
      setNewEmail("");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Your password has been updated." });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="font-serif text-xl font-semibold text-foreground">Your Account</h1>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg space-y-8">
        {/* Current info */}
        <section className="glass-card rounded-2xl p-6 space-y-2">
          <h2 className="font-medium text-foreground">Account Info</h2>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.email}</span>
          </p>
        </section>

        {/* Change email */}
        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-medium text-foreground mb-4">Change Email</h2>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">New email address</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={updatingEmail || !newEmail.trim()} className="gap-2">
              {updatingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Email
            </Button>
          </form>
        </section>

        {/* Change password */}
        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-medium text-foreground mb-4">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={updatingPassword || !newPassword.trim()} className="gap-2">
              {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Password
            </Button>
          </form>
        </section>

        {/* Delete Account */}
        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-medium text-destructive mb-2">Delete Account</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => setAccountSettingsOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </section>
      </main>

      <AccountSettings
        open={accountSettingsOpen}
        onOpenChange={setAccountSettingsOpen}
        userId={user.id}
        userEmail={user.email || ""}
        onAccountDeleted={async () => {
          await signOut();
          navigate("/");
        }}
      />
    </div>
  );
};

export default Account;
