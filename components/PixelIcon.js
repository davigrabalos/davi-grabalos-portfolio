import { icons } from '@/lib/icons';

// Inline Streamline Pixel icon; sized in em so it follows the surrounding text.
export default function PixelIcon({ name, size = '1em', className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`pixel-icon ${className}`}
      aria-hidden
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icons[name] }}
      {...rest}
    />
  );
}
