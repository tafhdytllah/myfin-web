"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type PageTrailContextValue = {
  trail: string[];
  setTrail: (trail: string[]) => void;
};

const PageTrailContext = createContext<PageTrailContextValue | null>(null);

export function PageTrailProvider({ children }: PropsWithChildren) {
  const [trail, setTrail] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      trail,
      setTrail,
    }),
    [trail],
  );

  return (
    <PageTrailContext.Provider value={value}>{children}</PageTrailContext.Provider>
  );
}

export function usePageTrail(trail: Array<string | null | undefined>) {
  const context = useContext(PageTrailContext);

  if (!context) {
    throw new Error("usePageTrail must be used within PageTrailProvider.");
  }

  const trailKey = trail
    .filter((item): item is string => typeof item === "string" && item.length > 0)
    .join("::");

  useEffect(() => {
    const normalizedTrail = trail.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    );

    context.setTrail(normalizedTrail);

    return () => {
      context.setTrail([]);
    };
  }, [context, trailKey, trail]);
}

export function useCurrentPageTrail() {
  const context = useContext(PageTrailContext);

  if (!context) {
    throw new Error("useCurrentPageTrail must be used within PageTrailProvider.");
  }

  return context.trail;
}
