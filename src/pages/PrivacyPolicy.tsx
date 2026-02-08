import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-xl font-semibold text-foreground">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to Wall Color Studio ("we," "our," or "us"). We are committed to protecting your personal data 
              and respecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your 
              information when you use our application.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">2. Data We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Account Information</h3>
                <p className="text-muted-foreground">
                  When you create an account, we collect your email address and a securely hashed password. 
                  We do not store your password in plain text.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Photos and Images</h3>
                <p className="text-muted-foreground">
                  When you upload photos of your walls, these images are processed by our AI to visualize color changes. 
                  If you save a color to your favorites, the associated photo may be stored in our secure storage. 
                  <strong className="text-foreground"> We understand these photos may contain sensitive information about your home.</strong>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Favorites</h3>
                <p className="text-muted-foreground">
                  We store your saved color preferences and associated photos to provide a personalized experience.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">3. How We Use Your Data</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>• To provide and improve our wall color visualization service</li>
              <li>• To save your color preferences and favorites</li>
              <li>• To authenticate your identity and secure your account</li>
              <li>• To respond to your inquiries and provide customer support</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-muted-foreground">
              Under the General Data Protection Regulation (GDPR), we process your data based on:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• <strong className="text-foreground">Consent:</strong> You provide consent when creating an account and uploading photos</li>
              <li>• <strong className="text-foreground">Contract:</strong> Processing is necessary to provide our services to you</li>
              <li>• <strong className="text-foreground">Legitimate Interest:</strong> To improve our services and ensure security</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">5. Data Storage and Security</h2>
            <p className="text-muted-foreground">
              Your data is stored securely using industry-standard encryption:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Data encrypted at rest (AES-256) and in transit (TLS 1.3)</li>
              <li>• Row-Level Security ensures you can only access your own data</li>
              <li>• Photos are stored in private storage buckets accessible only by you</li>
              <li>• Regular security audits and automatic backups</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">6. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground">
              Under GDPR, you have the following rights:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• <strong className="text-foreground">Right to Access:</strong> View all data we hold about you</li>
              <li>• <strong className="text-foreground">Right to Rectification:</strong> Correct inaccurate personal data</li>
              <li>• <strong className="text-foreground">Right to Erasure:</strong> Delete your account and all associated data</li>
              <li>• <strong className="text-foreground">Right to Data Portability:</strong> Export your data in a portable format</li>
              <li>• <strong className="text-foreground">Right to Object:</strong> Object to processing of your personal data</li>
              <li>• <strong className="text-foreground">Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, you can delete your account directly from the application 
              or contact us at the email provided below.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data for as long as your account is active. When you delete your account, 
              all associated data including photos and favorites are permanently deleted within 30 days.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">8. Third-Party Services</h2>
            <p className="text-muted-foreground">
              We use AI services to process your images for color visualization. These services process 
              images in real-time and do not retain your photos after processing is complete.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">9. Cookies</h2>
            <p className="text-muted-foreground">
              We use essential cookies only to maintain your session and authentication state. 
              We do not use tracking or advertising cookies.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or wish to exercise your rights, 
              please contact us at: <strong className="text-foreground">privacy@wallcolorstudio.app</strong>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-serif font-semibold text-foreground">11. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wall Color Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
