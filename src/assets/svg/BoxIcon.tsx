export default function BoxIcon({ width = 52, height = 46 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12.65 2.8a1 1 0 0 0-1.3 0L2 10.5V21a1 1 0 0 0 1 1h6v-7h6v7h6a1 1 0 0 0 1-1V10.5L12.65 2.8z" fill="#CDB989"/>
      <path d="M20 7V2h-4v3.02L20 7z" fill="#CDB989"/>
    </svg>
  );
}
