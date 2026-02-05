 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent } from "@/components/ui/card";
 import { Hammer, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 import type { ProjectType } from "@/components/ProjectTypePicker";
 
 interface CraftsmenQuestionnairePageProps {
   projectType: ProjectType;
   onBack: () => void;
   onComplete: () => void;
 }
 
 interface FormData {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   address: string;
   city: string;
   postalCode: string;
   projectDescription: string;
 }
 
 const projectTypeLabels: Record<ProjectType, string> = {
   painting: "Painting Work",
   plumbing: "Plumbing",
   construction: "Construction",
   flooring: "Floor Laying",
   carpentry: "Carpentry",
   electrical: "Electrical",
 };
 
 export function CraftsmenQuestionnairePage({ projectType, onBack, onComplete }: CraftsmenQuestionnairePageProps) {
   const { toast } = useToast();
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [formData, setFormData] = useState<FormData>({
     firstName: "",
     lastName: "",
     email: "",
     phone: "",
     address: "",
     city: "",
     postalCode: "",
     projectDescription: "",
   });
 
   const handleInputChange = (field: keyof FormData, value: string) => {
     setFormData((prev) => ({ ...prev, [field]: value }));
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     // Basic validation
     if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
       toast({
         title: "Missing information",
         description: "Please fill in all required fields.",
         variant: "destructive",
       });
       return;
     }
 
     // TODO: Submit form data to backend
     console.log("Form submitted:", { ...formData, projectType });
     setIsSubmitted(true);
   };
 
   if (isSubmitted) {
     return (
       <div className="min-h-screen bg-background flex flex-col">
         <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
           <Card className="max-w-md w-full">
             <CardContent className="py-12 text-center space-y-6">
               <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                 <CheckCircle2 className="w-10 h-10 text-primary" />
               </div>
               <div className="space-y-2">
                 <h2 className="font-serif text-2xl font-semibold text-foreground">Thank You!</h2>
                 <p className="text-muted-foreground">
                   Your request has been submitted. A craftsman will contact you shortly to discuss your {projectTypeLabels[projectType].toLowerCase()} project.
                 </p>
               </div>
               <Button onClick={onComplete} className="mt-4">
                 Back to Home
               </Button>
             </CardContent>
           </Card>
         </main>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background flex flex-col">
       {/* Header */}
       <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
         <div className="container mx-auto px-4 py-4">
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={onBack}
             className="gap-2"
           >
             <ArrowLeft className="w-4 h-4" />
             Back
           </Button>
         </div>
       </header>
 
       {/* Content */}
       <main className="flex-1 container mx-auto px-4 py-12">
         <div className="max-w-lg mx-auto animate-fade-in">
           {/* Header */}
           <div className="text-center mb-8">
             <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center">
               <Hammer className="w-8 h-8 text-primary-foreground" />
             </div>
             <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
               Get Your {projectTypeLabels[projectType]} Quote
             </h1>
             <p className="text-muted-foreground">
               Fill in your details and we'll connect you with trusted local craftsmen
             </p>
           </div>
 
           {/* Form */}
           <Card>
             <CardContent className="pt-6">
               <form onSubmit={handleSubmit} className="space-y-4">
                 {/* Name fields */}
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="firstName">First Name *</Label>
                     <Input
                       id="firstName"
                       value={formData.firstName}
                       onChange={(e) => handleInputChange("firstName", e.target.value)}
                       placeholder="John"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="lastName">Last Name *</Label>
                     <Input
                       id="lastName"
                       value={formData.lastName}
                       onChange={(e) => handleInputChange("lastName", e.target.value)}
                       placeholder="Doe"
                     />
                   </div>
                 </div>
 
                 {/* Contact fields */}
                 <div className="space-y-2">
                   <Label htmlFor="email">Email *</Label>
                   <Input
                     id="email"
                     type="email"
                     value={formData.email}
                     onChange={(e) => handleInputChange("email", e.target.value)}
                     placeholder="john.doe@example.com"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="phone">Phone Number *</Label>
                   <Input
                     id="phone"
                     type="tel"
                     value={formData.phone}
                     onChange={(e) => handleInputChange("phone", e.target.value)}
                     placeholder="+46 70 123 4567"
                   />
                 </div>
 
                 {/* Address fields */}
                 <div className="space-y-2">
                   <Label htmlFor="address">Street Address</Label>
                   <Input
                     id="address"
                     value={formData.address}
                     onChange={(e) => handleInputChange("address", e.target.value)}
                     placeholder="123 Main Street"
                   />
                 </div>
 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="city">City</Label>
                     <Input
                       id="city"
                       value={formData.city}
                       onChange={(e) => handleInputChange("city", e.target.value)}
                       placeholder="Stockholm"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="postalCode">Postal Code</Label>
                     <Input
                       id="postalCode"
                       value={formData.postalCode}
                       onChange={(e) => handleInputChange("postalCode", e.target.value)}
                       placeholder="123 45"
                     />
                   </div>
                 </div>
 
                 {/* Project description */}
                 <div className="space-y-2">
                   <Label htmlFor="projectDescription">Project Description</Label>
                   <Textarea
                     id="projectDescription"
                     value={formData.projectDescription}
                     onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                     placeholder="Tell us about your project..."
                     rows={4}
                   />
                 </div>
 
                 <div className="pt-4">
                   <Button type="submit" className="w-full gap-2">
                     Submit Request
                     <ArrowRight className="w-4 h-4" />
                   </Button>
                 </div>
 
                 <p className="text-xs text-muted-foreground text-center">
                   By submitting, you agree to be contacted by our partner craftsmen.
                 </p>
               </form>
             </CardContent>
           </Card>
         </div>
       </main>
     </div>
   );
 }