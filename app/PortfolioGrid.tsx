"use client";
import React from "react";

type Project = {
  title: string;
  category: string;
  image: string;
  image2?: string;
};

export default function PortfolioGrid({ portfolio }: { portfolio: Project[] }) {
  function changesrc(newSrc: string | undefined) {
    return (e: React.MouseEvent<HTMLImageElement>) => {
      if (newSrc) {
        e.currentTarget.src = newSrc;
      }
    };
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {portfolio.map((project, index) => (
        <div key={index} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={project.image || "/projects/1.jpg"}
              alt={project.title}
              className="w-full h-64 object-cover group-hover: transition-transform duration-700"
              onMouseEnter={changesrc(project.image2)}
              onMouseLeave={changesrc(project.image)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}