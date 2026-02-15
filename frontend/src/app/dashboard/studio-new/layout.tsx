'use client';

import { Providers } from "./Providers";
import StudioLayout from "./components/Layout";

export default function StudioNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <StudioLayout>{children}</StudioLayout>
    </Providers>
  );
}
