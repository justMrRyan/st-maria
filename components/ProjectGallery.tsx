// components/ProjectGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/types';
import { PROJECT_CATEGORIES } from '@/lib/constants';
import { Sparkles, Filter, X } from 'lucide-react';

interface ProjectGalleryProps {
  projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
          projects.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, projects]);

  const categoryCounts = projects.reduce((acc, project) => {
    const category = project.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
      <div className="w-full">
        {/* Category Filter - Desktop */}
        <div className="hidden md:flex items-center gap-2 mb-10 flex-wrap">
          <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === 'All'
                      ? 'bg-[#2c1810] text-white shadow-lg shadow-[#2c1810]/20'
                      : 'bg-white text-[#8a7a6a] hover:bg-[#f8f4f0] hover:text-[#2c1810] border border-[#f0ebe6]'
              }`}
          >
            All
            <span className="ml-2 text-xs opacity-60">({projects.length})</span>
          </button>
          {PROJECT_CATEGORIES.map((category) => (
              <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                          ? 'bg-[#2c1810] text-white shadow-lg shadow-[#2c1810]/20'
                          : 'bg-white text-[#8a7a6a] hover:bg-[#f8f4f0] hover:text-[#2c1810] border border-[#f0ebe6]'
                  }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-60">
              ({categoryCounts[category] || 0})
            </span>
              </button>
          ))}
        </div>

        {/* Category Filter - Mobile */}
        <div className="md:hidden mb-6">
          <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#f0ebe6] rounded-full text-[#2c1810] text-sm font-medium"
          >
            <Filter className="h-4 w-4" />
            {selectedCategory === 'All' ? 'All Projects' : selectedCategory}
            <span className="ml-1 text-xs text-[#8a7a6a]">
            ({filteredProjects.length})
          </span>
          </button>

          {isFilterOpen && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-[#f0ebe6] shadow-lg">
                <div className="flex flex-wrap gap-2">
                  <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setIsFilterOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === 'All'
                              ? 'bg-[#2c1810] text-white'
                              : 'bg-[#f8f4f0] text-[#8a7a6a] hover:bg-[#f0ebe6]'
                      }`}
                  >
                    All ({projects.length})
                  </button>
                  {PROJECT_CATEGORIES.map((category) => (
                      <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              selectedCategory === category
                                  ? 'bg-[#2c1810] text-white'
                                  : 'bg-[#f8f4f0] text-[#8a7a6a] hover:bg-[#f0ebe6]'
                          }`}
                      >
                        {category} ({categoryCounts[category] || 0})
                      </button>
                  ))}
                </div>
              </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#8a7a6a]">
            Showing <span className="font-semibold text-[#2c1810]">{filteredProjects.length}</span> projects
            {selectedCategory !== 'All' && (
                <span className="text-[#2c1810] font-medium"> in {selectedCategory}</span>
            )}
          </p>
          {selectedCategory !== 'All' && (
              <button
                  onClick={() => setSelectedCategory('All')}
                  className="flex items-center gap-1 text-xs text-[#8a7a6a] hover:text-[#2c1810] transition-colors"
              >
                <X className="h-3 w-3" />
                Clear filter
              </button>
          )}
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project, index) => (
                  <ProjectCard
                      key={project.id}
                      project={project}
                      featured={index === 0 && selectedCategory === 'All'}
                  />
              ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-[#f8f4f0] rounded-2xl border border-[#f0ebe6]">
              <div className="flex flex-col items-center gap-4">
                <Sparkles className="h-12 w-12 text-[#b8a89a]" />
                <div>
                  <p className="text-lg font-medium text-[#2c1810]">No projects found</p>
                  <p className="text-sm text-[#8a7a6a] mt-1">
                    Try selecting a different category
                  </p>
                </div>
                <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-4 py-2 bg-[#2c1810] text-white rounded-full text-sm font-medium hover:bg-[#3d2820] transition-colors"
                >
                  View All Projects
                </button>
              </div>
            </div>
        )}
      </div>
  );
}