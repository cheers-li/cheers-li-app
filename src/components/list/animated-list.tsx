import { useEffect, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useEffectOnce } from 'react-use';
import { FriendList } from '~/components/friends/friend-list';

const THRESHOLD = 100;

function Person({ name, points }: { name: string; points: number }) {
  return (
    <div className="mx-2 my-1 flex rounded-2xl bg-gray-200 px-4 py-3 dark:bg-neutral-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg text-3xl font-extrabold dark:bg-neutral-700">
        {name[0]}
      </div>
      <div className="ml-6 flex flex-col">
        <div className="mt-1 text-lg font-extrabold leading-5">{name}</div>
        <div className="text-base leading-5 dark:text-neutral-400">
          {points}p
        </div>
      </div>
    </div>
  );
}

const points = () => Math.floor(Math.random() * 10) + 5;
const generatePeople = () =>
  [
    <FriendList key={1} />,
    // <Person name="Sonja" points={points()} key="Sonja" />,
    // <Person name="Irma" points={points()} key="Irma" />,
    // <Person name="Conrad1" points={points()} key="Conrad" />,
    // <Person name="Conrad2" points={points()} key="Conrad2" />,
    // <Person name="Conrad3" points={points()} key="Conrad3" />,
    // <Person name="Conrad4" points={points()} key="Conrad4" />,
    // <Person name="Conrad5" points={points()} key="Conrad5" />,
    // <Person name="Conrad6" points={points()} key="Conrad6" />,
    // <Person name="Conrad7" points={points()} key="Conrad7" />,
    // <Person name="Conrad8" points={points()} key="Conrad8" />,
  ].sort((a, b) => b.props.points - a.props.points);

export const AnimatedList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [width, setWidth] = useState(0);
  const [people, setPeople] = useState(generatePeople());
  const [{ y, velocity }, api] = useSpring(() => ({
    y: 0,
    velocity: 0,
    config: { ...config, mass: 1, tension: 210, friction: 20 },
  }));

  const getViewportWidth = () => {
    setWidth(
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    );
  };
  useEffectOnce(() => {
    getViewportWidth();

    window.addEventListener('resize', getViewportWidth);
    return () => window.removeEventListener('resize', getViewportWidth);
  });

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (refreshing) {
      timerId = setTimeout(() => {
        setRefreshing(false);
        api.start({ y: 0 });
        setPeople(generatePeople());
      }, 1500);
    }
    return () => clearTimeout(timerId);
  }, [refreshing, api]);

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
          setRefreshing(true);
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
      <div
        className="relative h-full overflow-hidden bg-sky-500"
        style={{
          width,
        }}
      >
        <animated.div
          {...bind()}
          className="relative h-full cursor-grab bg-white p-5 dark:bg-black"
          style={{
            width,
            y,
            touchAction: 'pan-y',
          }}
        >
          <animated.div
            style={{
              transform:
                velocity && velocity.to((v) => `translateY(${v * 50}px)`),
            }}
          >
            {/* <div className="m-3 text-2xl font-extrabold text-black dark:text-white">
              Score
            </div> */}
            {/* <div className="flex flex-col">{people.map((p) => p)}</div> */}
            {people.map((p) => p)}
          </animated.div>
        </animated.div>
        <svg
          width={width}
          height="200"
          viewBox={`0 0 ${width} 200`}
          className="pointer-events-none absolute top-0"
        >
          <animated.path
            d={
              velocity &&
              velocity.to({
                range: [0, 0.8],
                output: [
                  `M 0,0 H ${width} C ${width},0 ${width},72.50348 ${width},100 254.75383,100 215.07491,100 140,100 64.925085,100 24.598835,100 0,100 0,72.56384 0,0 0,0 Z`,
                  `M 0,0 H ${width} C ${width},0 ${width},72.50348 ${width},100 ${width},129.1302 237.73173,160 140,160 42.268268,160 0,130.42487 0,100 0,72.56384 0,0 0,0 Z`,
                ],
              })
            }
            style={{
              transform: y.to((val) => `translateY(${val - THRESHOLD}px)`),
              fill: '#0ea4e9',
              stroke: 'none',
              strokeWidth: 1,
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1,
            }}
          />
        </svg>
        <animated.div
          style={{
            y,
            transform: 'translateX(-50%)',
            boxShadow: `0 2.8px 2.2px rgba(0, 0, 0, 0.02),
              0 6.7px 5.3px rgba(0, 0, 0, 0.028),
              0 12.5px 10px rgba(0, 0, 0, 0.035),
              0 22.3px 17.9px rgba(0, 0, 0, 0.042),
              0 41.8px 33.4px rgba(0, 0, 0, 0.05),
              0 100px 80px rgba(0, 0, 0, 0.07)
            `,
          }}
          className="absolute left-1/2 -top-16 h-8 w-8 rounded-2xl bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            height="100"
            width="100"
            className="relative left-2 -top-8 w-5 animate-spin stroke-current text-black"
            style={{
              transformOrigin: '50% 49.7%',
            }}
          >
            <g fill="none" strokeLinecap="round">
              <path
                d="M72.158 71.366c-10.8 11.17-27.874 13.42-41.2 5.43-13.324-7.99-19.382-24.112-14.617-38.9 4.767-14.79 19.097-24.34 34.58-23.047C66.405 16.14 78.953 27.937 81.2 43.31l-23.725-.42"
                strokeWidth="8"
              />
              <path d="M85.268 43.312V15.977" strokeWidth="10" />
            </g>
          </svg>
        </animated.div>
      </div>
    </div>
  );
};
