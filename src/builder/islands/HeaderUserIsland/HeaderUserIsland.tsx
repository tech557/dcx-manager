import { useRef, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Save, X, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useBuilderStore } from '@/store/builderStore';
import { useAutosave } from '@/hooks/useAutosave';
import { getThemePreferenceScope, useTheme } from '@/hooks/useTheme';
import { HeaderUserActionsMenu } from './HeaderUserActionsMenu';
import { useToggle } from '@/hooks/useToggle';

interface HeaderUserIslandProps {
  onExport?: () => void;
  onImport?: () => void;
}

export function HeaderUserIsland({ onExport, onImport }: HeaderUserIslandProps) {
  const { versionId = 'v-1' } = useParams();
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const saveStatus = useBuilderStore((state) => state.saveStatus);
  const { saveNow } = useAutosave(versionId);
  const themePreferenceScope = useMemo(() => getThemePreferenceScope(versionId), [versionId]);
  const { isDark } = useTheme(themePreferenceScope);

  const [isMenuOpen, toggleMenu, , closeMenu] = useToggle();
  const menuContainerRef = useRef<HTMLDivElement>(null);

  function handleToggleTheme() {
    setThemeMode(isDark ? 'light' : 'dark');
  }

  // Click outside listener for the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeMenu]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`glass p-1.5 rounded-full flex items-center gap-2 transition-all duration-500 relative pointer-events-auto ${
        isDark ? 'glass-dark text-white' : 'glass-light text-black'
      }`}
      id="header-user-island"
      ref={menuContainerRef}
    >
      {/* 1. Theme Toggle button */}
      <button
        onClick={handleToggleTheme}
        type="button"
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDark
            ? 'hover:bg-white/5 text-[var(--theme-accent)] hover:text-white'
            : 'hover:bg-black/5 text-gray-700 hover:text-black'
        } cursor-pointer`}
        aria-label="Toggle visual theme"
        title="Toggle visual theme"
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Divider */}
      <div className={`h-4 w-[1px] ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

      {/* 2. Manual Save & actions group */}
      <div className="flex items-center gap-0.5 relative" id="header-save-actions-group">
        <button
          onClick={() => void saveNow()}
          disabled={saveStatus === 'saving'}
          type="button"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative ${
            saveStatus === 'saving'
              ? `text-yellow-400 ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'} animate-pulse`
              : saveStatus === 'saved'
              ? `text-green-400 ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`
              : saveStatus === 'dirty'
              ? `text-[var(--theme-accent)] ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`
              : isDark
              ? 'text-white/50 hover:text-white hover:bg-white/5'
              : 'text-black/50 hover:text-black hover:bg-black/5'
          } cursor-pointer`}
          title={`Save immediately (Status: ${saveStatus})`}
          aria-label="Save current state"
        >
          <Save size={17} />
          {saveStatus === 'dirty' && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] animate-pulse" />
          )}
        </button>

        {/* Small arrow toggle button */}
        <button
          onClick={toggleMenu}
          type="button"
          className={`w-4 h-9 rounded-r-full flex items-center justify-center transition-all duration-300 ${
            isMenuOpen
              ? 'text-[var(--theme-accent)]'
              : isDark
              ? 'text-white/30 hover:text-white hover:bg-white/5'
              : 'text-black/30 hover:text-black hover:bg-black/5'
          } cursor-pointer`}
          aria-label="Workspace utility actions"
          title="Workspace utility actions"
        >
          <ChevronDown size={12} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Animate Dropdown Menu list */}
        <AnimatePresence>
          {isMenuOpen && (
            <HeaderUserActionsMenu
              onExport={onExport}
              onImport={onImport}
              onClose={closeMenu}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className={`h-4 w-[1px] ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

      {/* 4. Initials Display */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 font-sans font-black text-xs text-white ${
          isDark
            ? 'bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/30 hover:border-[var(--theme-accent)]/60'
            : 'bg-[var(--theme-accent)]/80 border border-transparent shadow'
        } cursor-pointer`}
        title="MS (Admin)"
      >
        MS
      </div>

      {/* Divider */}
      <div className={`h-4 w-[1px] ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

      {/* 5. Return to single-version room page exit button */}
      <Link
        to={`/version/${versionId}`}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDark
            ? 'hover:bg-red-500/10 text-white/50 hover:text-red-400'
            : 'hover:bg-red-500/5 text-black/50 hover:text-red-600'
        }`}
        id="header-logout-button"
        title="Exit to Version Page"
        aria-label="Exit to Version Page"
      >
        <X size={17} />
      </Link>
    </motion.div>
  );
}
