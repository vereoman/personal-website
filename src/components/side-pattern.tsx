export function SidePattern() {
  return (
    <>
      <span
        aria-hidden="true"
        class="rail-pattern pointer-events-none absolute top-0 right-[calc(100%+1px)]"
      />
      <span
        aria-hidden="true"
        class="rail-pattern pointer-events-none absolute top-0 left-[calc(100%+1px)]"
      />
    </>
  );
}
