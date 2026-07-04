export type ProjectConfig = {
  slug: string;
  name: string;
  owner: string;
  repo: string;
  branch: string;
  defaultFile: string;
  githubUrl: string;
  liveUrl: string;
};

export const projects = [
  {
    slug: "townbase",
    name: "Townbase",
    owner: "armancurr",
    repo: "townbase",
    branch: "main",
    defaultFile: "README.md",
    githubUrl: "https://github.com/armancurr/townbase",
    liveUrl: "https://townbase.vercel.app",
  },
  {
    slug: "bloomsite",
    name: "Bloomsite",
    owner: "armancurr",
    repo: "bloomsite",
    branch: "main",
    defaultFile: "README.md",
    githubUrl: "https://github.com/armancurr/bloomsite",
    liveUrl: "https://bloomsite.vercel.app",
  },
] satisfies ProjectConfig[];

export function getProjectBySlug(slug: string): ProjectConfig | undefined {
  return projects.find((project) => project.slug === slug);
}
