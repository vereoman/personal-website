import { useQuery } from "@tanstack/solid-query";
import { CaretRight, GitCommit as GitCommitIcon } from "phosphor-solid";
import { For, Show } from "solid-js";

import { getProjectBySlug } from "../config/projects";
import { fetchCommits, githubCacheTimes, githubQueryKeys } from "../lib/github";

type InteractiveProps = {
  onPress: () => void;
};

const project = {
  ...getProjectBySlug("bloomsite")!,
  description:
    "A focused site project for growing polished pages from a simple, maintainable content base.",
};

function BloomIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M245.83,121.63a15.53,15.53,0,0,0-9.52-7.33,73.55,73.55,0,0,0-22.17-2.22c4-19.85,1-35.55-2-44.86a16.17,16.17,0,0,0-18.8-10.88,85.53,85.53,0,0,0-28.55,12.12,94.58,94.58,0,0,0-27.11-33.25,16.05,16.05,0,0,0-19.26,0A94.58,94.58,0,0,0,91.26,68.46,85.53,85.53,0,0,0,62.71,56.34,16.14,16.14,0,0,0,43.92,67.22c-3,9.31-6,25-2.06,44.86a73.55,73.55,0,0,0-22.17,2.22,15.53,15.53,0,0,0-9.52,7.33,16,16,0,0,0-1.6,12.26c3.39,12.58,13.8,36.49,45.33,55.33S113.13,208,128.05,208s42.67,0,74-18.78c31.53-18.84,41.94-42.75,45.33-55.33A16,16,0,0,0,245.83,121.63ZM62.1,175.49C35.47,159.57,26.82,140.05,24,129.7a59.61,59.61,0,0,1,22.5-1.17,129.08,129.08,0,0,0,9.15,19.41,142.28,142.28,0,0,0,34,39.56A114.92,114.92,0,0,1,62.1,175.49ZM128,190.4c-9.33-6.94-32-28.23-32-71.23C96,76.7,118.38,55.24,128,48c9.62,7.26,32,28.72,32,71.19C160,162.17,137.33,183.46,128,190.4Zm104-60.68c-2.77,10.24-11.4,29.81-38.09,45.77a114.92,114.92,0,0,1-27.55,12,142.28,142.28,0,0,0,34-39.56,129.08,129.08,0,0,0,9.15-19.41A59.69,59.69,0,0,1,232,129.71Z" />
    </svg>
  );
}

export function Project2(props: InteractiveProps) {
  const commitsQuery = useQuery(() => ({
    queryKey: githubQueryKeys.commits(project, project.branch),
    queryFn: ({ signal }) => fetchCommits(project, project.branch, signal),
    staleTime: githubCacheTimes.commits,
  }));
  const commits = () => commitsQuery.data?.slice(0, 4) ?? [];

  return (
    <section class="relative w-full">
      <div class="site-pattern pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2" />

      <div
        id="project-2"
        class="border-border bg-background relative mx-auto grid w-full max-w-6xl content-center border-x border-b px-8 py-14 sm:px-12 md:h-[min(66vw,660px)] md:min-h-[360px] md:px-16 md:py-0"
        onPointerDown={props.onPress}
      >
        <span
          aria-hidden="true"
          class="bg-border pointer-events-none absolute bottom-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
        />
        <span aria-hidden="true" class="pointer-events-none absolute bottom-0 left-0 z-10">
          <span class="absolute bottom-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute bottom-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <span aria-hidden="true" class="pointer-events-none absolute right-0 bottom-0 z-10">
          <span class="absolute right-[-1px] bottom-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute right-[-1px] bottom-[-8px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <div class="mx-auto max-w-xl">
          <div>
            <div>
              <a
                href={project.githubUrl}
                class="text-foreground flex w-fit items-center gap-2 hover:text-[var(--text-subtle)]"
                rel="noreferrer"
                target="_blank"
                aria-label={`Open ${project.name} repository on GitHub`}
              >
                <BloomIcon />
                <CaretRight class="text-[var(--text-muted)]" size={18} weight="fill" />
                <h2 class="text-xl leading-none font-semibold sm:text-2xl">{project.name}</h2>
              </a>
              <p class="mt-6 text-left text-lg leading-relaxed text-[var(--text-subtle)] sm:text-xl md:text-justify">
                {project.description}
              </p>
            </div>
            <Show when={commits().length}>
              <div class="mt-8 overflow-hidden sm:mt-10">
                <div class="space-y-2">
                  <For each={commits()}>
                    {(commit) => (
                      <a
                        href={commit.html_url}
                        class="group hover:text-foreground grid min-w-0 grid-cols-[16px_minmax(0,1fr)] items-center gap-2 text-base text-[var(--text-subtle)]"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <GitCommitIcon
                          class="group-hover:text-foreground text-[var(--text-muted)]"
                          size={15}
                          weight="fill"
                        />
                        <span class="truncate">{commit.commit.message.split("\n")[0]}</span>
                      </a>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
}
