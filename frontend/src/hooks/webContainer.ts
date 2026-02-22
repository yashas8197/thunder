import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

let instancePromise: Promise<WebContainer> | null = null;

function getWebContainer(): Promise<WebContainer> {
  if (!instancePromise) {
    instancePromise = WebContainer.boot();
  }
  return instancePromise;
}

export function useWebContainer() {
  const [webContainer, setWebContainer] = useState<WebContainer>();

  useEffect(() => {
    let cancelled = false;
    getWebContainer().then((instance) => {
      if (!cancelled) setWebContainer(instance);
    });
    return () => { cancelled = true; };
  }, []);

  return webContainer;
}
