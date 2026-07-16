// app/projects/route.ts
import { getSupabaseClient } from '@/lib/supabase/server';
import ProjectCard from '@/components/ProjectCard';

export default async function ProjectsPage() {
  const supabase = getSupabaseClient();

  const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
      <main className="min-h-screen bg-[#faf8f6] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2c1810]">Portfolio</h1>
            <p className="text-[#8a7a6a] mt-2">Explore my interior design projects</p>
            <div className="w-20 h-1 bg-[#2c1810] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    featured={index === 0} // First project is featured
                />
            ))}
          </div>
        </div>
      </main>
  );
}