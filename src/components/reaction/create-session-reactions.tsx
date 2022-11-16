import { PlusIcon } from '@heroicons/react/24/outline';
import { FC, useEffect, useRef, useState } from 'react';

import {
  CameraPreview,
  CameraPreviewOptions,
} from '@capacitor-community/camera-preview';
import clsx from 'clsx';
import { uploadReaction } from '~/services/reactions';

interface PointerPosition {
  x: number;
  y: number;
}

interface SessionReactionsProps {
  sessionId: string;
  profileId: string;
  refetch: () => unknown;
}

export const CreateSessionReaction: FC<SessionReactionsProps> = ({
  sessionId,
  profileId,
  refetch,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const touchLocationRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isInPosition, setIsInPosition] = useState(false);
  const [position, setPosition] = useState<PointerPosition>();

  const cameraPreviewOptions: CameraPreviewOptions = {
    position: 'front',
    height: 500,
    width: 500,
    parent: 'preview',
    disableAudio: true,
  };

  useEffect(() => {
    if (isOpen) {
      start();
    }
  }, [isOpen]);

  useEffect(() => {
    if (position && touchLocationRef && touchLocationRef.current) {
      touchLocationRef.current.style.transform = `translate(${
        position.x - 20
      }px, ${position.y - 20}px)`;
    }
  }, [position]);

  const start = async () => {
    await CameraPreview.start(cameraPreviewOptions);
    setIsReady(true);
  };

  const capture = async () => {
    if (!isInPosition) {
      setIsOpen(false);
      return;
    }

    const file = await CameraPreview.capture(cameraPreviewOptions);
    await CameraPreview.stop();
    await uploadReaction(sessionId, file.value, profileId);
    refetch();
    setIsOpen(false);
  };

  const moved = (e: any) => {
    const { clientX: x, clientY: y } = e.targetTouches[0];
    setPosition({ x: parseInt(x), y: parseInt(y) });

    const targetLocation: DOMRect | undefined =
      previewRef?.current?.getBoundingClientRect();

    if (targetLocation && isReady) {
      const { top, left, right, bottom } = targetLocation;

      if (y > top && y < bottom && x > left && x < right) {
        setIsInPosition(true);
        return;
      }
    }
    setIsInPosition(false);
  };

  return (
    <div>
      <div
        onTouchStart={() => setIsOpen(true)}
        onTouchEnd={capture}
        onTouchMove={(e) => moved(e)}
        className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <PlusIcon className="h-8 w-8" />
      </div>

      {isOpen && (
        <div
          onClick={capture}
          className="fixed top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center gap-10 backdrop-blur"
        >
          <div>
            <h2 className="text-center text-3xl font-bold text-white">
              Send a Reaction
            </h2>
            <p className="text-center text-sm text-gray-200">
              Slide over the preview and release to send
            </p>
          </div>

          <div
            className="h-[80vw] w-[80vw] overflow-hidden rounded-full bg-white"
            id="preview"
            ref={previewRef}
          ></div>
          {position && (
            <div
              className="fixed top-0 left-0 h-10 w-10 rounded-full bg-gray-600"
              ref={touchLocationRef}
            ></div>
          )}
          <div
            className={clsx(
              'fixed -z-10 h-full w-full opacity-70 transition-all',
              {
                'bg-green-500': isInPosition,
                'bg-red-500': !isInPosition,
              },
            )}
          ></div>
        </div>
      )}
    </div>
  );
};

const ImagePreview = ({ data }: any) => (
  <div className="h-24 w-24">
    <img className="rounded-full" src={`data:image/jpeg;base64,${data}`} />
  </div>
);
