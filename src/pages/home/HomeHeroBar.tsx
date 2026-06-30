import { PageBrandBlock } from '@/ui/app-shell/PageBrandBlock';
import { PageUserBlock } from '@/ui/app-shell/PageUserBlock';

export function HomeHeroBar() {
  return (
    <div className="flex items-center justify-between gap-4 shrink-0">
      <PageBrandBlock />
      <PageUserBlock />
    </div>
  );
}
