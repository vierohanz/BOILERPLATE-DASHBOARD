import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (originRect?: DOMRect) => void;
}

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme:
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      setTheme: (theme: Theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: (originRect?: DOMRect) => {
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';

          if (!document.startViewTransition || !originRect) {
            applyTheme(next);
            return { theme: next };
          }

          const x = originRect.left + originRect.width / 2;
          const y = originRect.top + originRect.height / 2;
          const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
          );

          const transition = document.startViewTransition(() => {
            applyTheme(next);
          });

          transition.ready.then(() => {
            const clipPath = [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ];
            document.documentElement.animate(
              { clipPath },
              {
                duration: 450,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          });

          return { theme: next };
        });
      },
    }),
    {
      name: 'app_theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);
