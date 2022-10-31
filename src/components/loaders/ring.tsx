import clsx from 'clsx';
import store from '~/store';

export type Props = {
  /* size in pixel */
  size?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const RingLoader = ({ size = 80, className, style }: Props) => {
  const [dark] = store.useState<boolean>('dark');
  const color = dark ? '#e5e5e5' : '#1f2937';

  const circles = [...Array(4)].map((_, index) => {
    return (
      <div
        key={index}
        style={{
          borderColor: `${color} transparent transparent transparent`,
          width: size * 0.8,
          height: size * 0.8,
          margin: size * 0.1,
          borderWidth: size * 0.1,
        }}
      ></div>
    );
  });

  return (
    <div
      className={clsx('lds-ring', className)}
      style={{ width: size, height: size, ...style }}
    >
      {circles}
    </div>
  );
};
