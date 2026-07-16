'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProjectForm from '@/components/ProjectForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Project } from '@/types'
import { toast } from 'sonner'

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projectId, setProjectId] = useState<string>('')

  useEffect(() => {
    const loadParams = async () => {
      const { id } = await params
      setProjectId(id)
      fetchProject(id)
    }
    loadParams()
  }, [params])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const data = await response.json()
      setProject(data)
    } catch (error) {
      toast.error('Failed to load project')
      router.push('/dashboard/projects')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">
            ← Back to Projects
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mt-4">Edit Project</h1>
        <p className="text-muted-foreground mt-2">
          Update project details and images
        </p>
      </div>

      {/* Form */}
      {project && <ProjectForm project={project} />}
    </div>
  )
}
