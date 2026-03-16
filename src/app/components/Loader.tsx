interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Loader({ size = 35, color = '#000', className = '' }: LoaderProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        aspectRatio: 1,
        background: `
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 0 0,
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 100% 0,
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 100% 100%,
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 0 100%
        `,
        backgroundSize: '40% 40%',
        animation: 'loader-spin .5s infinite',
      }}
    />
  );
}
