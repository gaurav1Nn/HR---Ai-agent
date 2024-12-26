import JobSearchForm from '@/components/JobSearchForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-8">Job Application Assistant</h1>
        <JobSearchForm />
      </main>
    </div>
  );
};

export default Index;