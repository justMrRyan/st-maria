// app/dashboard/projects/new/route.ts
'use client';

import ProjectForm from '@/components/ProjectForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NewProject() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href="/dashboard/projects">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] hover:border-[#b8a89a]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Projects
                    </Button>
                </Link>

                <div className="mt-6 flex items-start gap-4">
                    <div className="rounded-lg bg-[#f8f4f0] p-3 shadow-sm">
                        <Sparkles className="h-8 w-8 text-[#2c1810]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#2c1810]">Create New Project</h1>
                        <p className="text-[#8a7a6a] mt-1">
                            Add a new project to your portfolio
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-[#f0ebe6] p-6 shadow-sm">
                <ProjectForm />
            </div>
        </div>
    );
}