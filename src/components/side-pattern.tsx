export function SidePattern() {
  return (
    <>
      <span
        aria-hidden="true"
        class="rail-pattern pointer-events-none absolute top-[-1px] right-[calc(100%+1px)] bottom-[-1px] w-screen"
      />
      <span
        aria-hidden="true"
        class="rail-pattern pointer-events-none absolute top-[-1px] bottom-[-1px] left-[calc(100%+1px)] w-screen"
      />
    </>
  );
}
