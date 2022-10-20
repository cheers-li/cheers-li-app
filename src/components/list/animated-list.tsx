import { useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { List, ListProps } from './list';
import { ListItem } from '~/types/List';

const THRESHOLD = 100;

interface AnimatedListProps<T> extends ListProps<T> {
  reload: () => void;
}

export const AnimatedList: React.FC<AnimatedListProps<ListItem>> = ({
  title,
  titleContent,
  loading,
  count,
  items,
  ItemComponent,
  reload,
  horizontalPadding,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [{ y, velocity }, api] = useSpring(() => ({
    y: 0,
    velocity: 0,
    config: { ...config, mass: 1, tension: 210, friction: 20 },
  }));

  const reloadItems = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    await reload();

    setTimeout(() => {
      api.start({ y: 0 });
      setRefreshing(false);
    }, 300);
  };

  const bind = useDrag(
    ({
      movement: [_newX, newY],
      down,
      velocity: [_vx, vy],
      direction: [_dx, dy],
    }) => {
      if (refreshing) {
        return;
      }
      if (!down) {
        if (newY >= THRESHOLD) {
          reloadItems();
          api.start({ velocity: 0, y: THRESHOLD, config: { duration: 250 } });
        } else {
          api.start({ velocity: 0, y: 0, config: { duration: 250 } });
        }
      } else {
        api.start({
          y: newY,
          velocity: dy < 0 ? -vy : vy,
          config: { duration: 80 },
        });
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { left: 0, right: 0, top: 0, bottom: THRESHOLD },
      rubberband: true,
    },
  );

  return (
    <div className="flex h-full flex-col items-center">
      <div className="relative h-full w-full overflow-hidden bg-sky-500">
        <animated.div
          {...bind()}
          className="relative h-full w-full cursor-grab bg-gray-50 dark:bg-black"
          style={{
            y,
            touchAction: 'pan-y',
          }}
        >
          <animated.div
            style={{
              transform:
                velocity &&
                velocity.to((v: number) => `translateY(${v * 50}px)`),
            }}
            className="max-h-[80vh] min-h-[50vh] overflow-y-scroll"
          >
            <List
              title={title}
              titleContent={titleContent}
              loading={loading}
              items={items}
              count={count}
              ItemComponent={ItemComponent}
              horizontalPadding={horizontalPadding}
            />
          </animated.div>
        </animated.div>
        <animated.div
          style={{
            y,
          }}
          className="absolute left-1/2 -top-16 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-2xl bg-white shadow-lg"
        >
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
        </animated.div>
      </div>
    </div>
  );
};
