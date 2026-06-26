/* project-1 component - commented out
import { useQuery } from "@tanstack/solid-query";
import { CaretRight, GitCommit as GitCommitIcon } from "phosphor-solid";
import { For, Show } from "solid-js";

import { getProjectBySlug } from "../config/projects";
import { fetchCommits, githubCacheTimes, githubQueryKeys } from "../lib/github";

type InteractiveProps = {
  onPress: () => void;
};

const project = {
  ...getProjectBySlug("bystanderland")!,
  description:
    "An interactive web project about presence, observation, and the small systems that make a place feel alive.",
};

function ShovelIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M245.66,69.66a8,8,0,0,1-11.32,0L216,51.31l-71,71L133.66,111l71-71L186.34,21.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,245.66,69.66ZM88,176a8,8,0,0,1-5.66-13.66L133.66,111,99.31,76.68a16,16,0,0,0-22.62,0l-56,56A15.89,15.89,0,0,0,16,144v80a16,16,0,0,0,16,16h80a15.86,15.86,0,0,0,11.31-4.69l56-56a16,16,0,0,0,0-22.62L145,122.34,93.66,173.66A8,8,0,0,1,88,176Z" />
    </svg>
  );
}

export function Project1(props: InteractiveProps) {
  const commitsQuery = useQuery(() => ({
    queryKey: githubQueryKeys.commits(project, project.branch),
    queryFn: ({ signal }) => fetchCommits(project, project.branch, signal),
    staleTime: githubCacheTimes.commits,
  }));
  const commits = () => commitsQuery.data?.slice(0, 4) ?? [];

  return (
    <section class="relative w-full">
      <div
        id="project-1"
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
                <ShovelIcon />
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
*/
