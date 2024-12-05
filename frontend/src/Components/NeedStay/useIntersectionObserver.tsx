import { useEffect, useState, useRef } from 'react';

const useIntersectionObserver = <T extends Element>(
  options: IntersectionObserverInit
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible] as const;
};

export default useIntersectionObserver;
