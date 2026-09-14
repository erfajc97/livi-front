import { useEffect, useState } from 'react';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';

const ANNOUNCEMENT_DEFAULT = 'Envíos a todo Ecuador · Empaque de regalo incluido';
/** Rotación automática entre promociones (ms). */
const ROTATE_MS = 6000;

/**
 * El setting `announcement_bar` guarda un JSON array de textos. Se acepta el
 * formato antiguo (un solo string plano) para no romper lo ya guardado.
 */
function parseAnnouncements(raw: unknown): string[] {
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === 'string' && t.trim() !== '');
    }
  } catch {
    /* valor plano (formato antiguo) */
  }
  return [raw];
}

/**
 * Barra superior de promociones. Los textos se administran desde el admin
 * (Ajustes → Barra superior). Rota sola y se puede cambiar manualmente con las
 * flechas de los extremos.
 */
export default function AnnouncementBar() {
  const [items, setItems] = useState<string[]>([ANNOUNCEMENT_DEFAULT]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`${API_ENDPOINTS.SETTINGS}/announcement_bar`)
      .then(({ data }) => {
        const list = parseAnnouncements(data?.data?.value ?? data?.value);
        if (list.length > 0) setItems(list);
      })
      .catch(() => {});
  }, []);

  // Rotación automática — se detiene al pasar el mouse o con un solo texto.
  useEffect(() => {
    if (items.length < 2 || paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  // Si el admin quita textos, el índice puede quedar fuera de rango.
  const current = items[index % items.length] ?? items[0];
  const hasMultiple = items.length > 1;

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + items.length) % items.length);

  const arrowCls =
    'absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-bg/60 transition-colors hover:text-bg';

  return (
    <div className="bg-accent">
      <div className="relative flex items-center justify-center overflow-hidden px-10 py-2.5 md:px-14">
        {hasMultiple && (
          <button
            type="button"
            onClick={() => go(-1)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-label="Promoción anterior"
            className={`${arrowCls} left-1 md:left-5`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <p
          key={index}
          className="announce-slide text-center font-mono text-[10px] uppercase leading-5 tracking-[0.22em] text-bg md:text-[11px]"
        >
          {current}
        </p>

        {hasMultiple && (
          <button
            type="button"
            onClick={() => go(1)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-label="Siguiente promoción"
            className={`${arrowCls} right-1 md:right-5`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
