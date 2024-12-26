import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type HrContact = Database['public']['Tables']['hr_contacts']['Row'];

interface CompanyInfo {
  hrEmail: string;
  linkedinUrl: string;
  emailTemplate: string;
}

const JobSearchForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hr_contacts')
        .select('*')
        .ilike('company', `%${companyName}%`)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const response: CompanyInfo = {
          hrEmail: data.email,
          linkedinUrl: `https://www.linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
          emailTemplate: `Dear ${data.name},

I hope this email finds you well. I came across ${data.company}'s innovative work and was immediately drawn to your company's mission.

With my experience in [relevant field] and a proven track record of [key achievement], I believe I could be a valuable addition to your team.

I would welcome the opportunity to discuss how my background aligns with your needs and learn more about current opportunities at ${data.company}.

Thank you for considering my interest. I look forward to your response.

Best regards,
[Your name]`
        };

        setCompanyInfo(response);
        toast({
          title: "Success",
          description: "Company information retrieved successfully",
        });
      } else {
        toast({
          title: "Not Found",
          description: "No HR contact found for this company",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve company information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            "Searching..."
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </form>

      {companyInfo && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">HR Email</h3>
                <p className="text-sm">{companyInfo.hrEmail}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">LinkedIn</h3>
                <a 
                  href={companyInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {companyInfo.linkedinUrl}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cold Email Template</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-lg">
                {companyInfo.emailTemplate}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobSearchForm;