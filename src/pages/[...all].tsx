import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-2xl font-semibold">Page not found</div>
      <Link
        to="/"
        className="mt-5 rounded-lg border border-gray-100 bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        Back home
      </Link>
    </div>
  );
}
