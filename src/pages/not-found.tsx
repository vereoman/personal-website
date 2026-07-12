import { PageFrame } from "../components/page-frame";

interface NotFoundPageProps {
  shortcutLabel: string;
}

export function NotFoundPage(props: NotFoundPageProps) {
  return (
    <PageFrame>
      <div class="flex min-h-[520px] flex-1 items-center justify-center p-8 text-center md:min-h-[660px]">
        <div>
          <h1 class="text-foreground mt-4 text-xl font-normal tracking-wide sm:text-2xl">
            Nothing here, but you can always <kbd>{props.shortcutLabel}</kbd>
          </h1>
        </div>
      </div>
    </PageFrame>
  );
}
