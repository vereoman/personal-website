// import { useQuery } from "@tanstack/solid-query";
// import { For, Show } from "solid-js";

import { getProjectBySlug } from "../config/projects";
import { CellRail } from "./cell-rail";
// import { fetchCommits, githubCacheTimes, githubQueryKeys } from "../lib/github";

type InteractiveProps = {
  onPress: () => void;
};

const project = {
  ...getProjectBySlug("townbase")!,
  description:
    "An interactive town-building base for shaping a small place through simple systems and readable state.",
};

export function Project1(props: InteractiveProps) {
  // const commitsQuery = useQuery(() => ({
  //   queryKey: githubQueryKeys.commits(project, project.branch),
  //   queryFn: ({ signal }) => fetchCommits(project, project.branch, signal),
  //   staleTime: githubCacheTimes.commits,
  // }));
  // const commits = () => commitsQuery.data?.slice(0, 4) ?? [];

  return (
    <section class="section-tone-project relative w-full">
      <div
        id="project-1"
        class="border-border bg-background relative mx-auto grid w-full max-w-[var(--frame-w)] content-center border-x border-b px-8 py-14 sm:px-12 md:h-[var(--section-h)] md:min-h-[360px] md:px-20 lg:px-24 md:py-0"
        onPointerDown={props.onPress}
      >
        <CellRail side="left" />
        <CellRail side="right" />
        <span
          aria-hidden="true"
          class="bg-border pointer-events-none absolute z-10 bottom-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
        />
        <span aria-hidden="true" class="pointer-events-none absolute bottom-0 left-0 z-10">
          <span class="absolute bottom-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute bottom-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <span aria-hidden="true" class="pointer-events-none absolute right-0 bottom-0 z-10">
          <span class="absolute right-[-1px] bottom-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute right-[-1px] bottom-[-8px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <div class="mx-auto grid w-full grid-cols-1 gap-10 md:grid-cols-3 md:items-start md:gap-16">
          <div>
            <h2 class="text-foreground text-left text-lg font-semibold sm:text-xl">Projects</h2>
            <p class="mt-2 max-w-48 text-sm leading-5 text-[var(--text-muted)]">
              Projects I’ve worked on.
            </p>
          </div>
          <div class="max-w-2xl md:col-span-2">
            <a
              href={project.liveUrl}
              class="text-foreground flex w-fit items-center gap-2 hover:text-[var(--text-subtle)]"
              rel="noreferrer"
              target="_blank"
              aria-label={`Open ${project.name} site`}
            >
              <h3 class="text-lg leading-none font-semibold sm:text-xl">{project.name}</h3>
            </a>
            <p class="mt-6 text-left text-base leading-6 text-[var(--text-subtle)] sm:text-lg sm:leading-7 md:text-justify">
              {project.description}
            </p>
            {/* <Show when={commits().length}>
                <div class="mt-8 overflow-hidden sm:mt-10">
                  <div class="space-y-2">
                    <For each={commits()}>
                      {(commit) => (
                        <a
                          href={commit.html_url}
                          class="group hover:text-foreground grid min-w-0 grid-cols-[16px_minmax(0,1fr)] items-center gap-2 text-base text-[var(--text-subtle)]"
                          rel="noreferrer"
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
              </Show> */}
          </div>
        </div>
      </div>
    </section>
  );
}
