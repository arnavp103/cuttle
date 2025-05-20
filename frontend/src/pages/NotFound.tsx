import { Link } from 'react-router';

function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen min-w-screen bg-gray-900 text-white">
            <h1 className="text-4xl mb-4">404 - Page Not Found</h1>
            <p className="text-xl mb-8">The page you're looking for doesn't exist.</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
                Go Home
            </Link>
        </div>
    );
}

export default NotFound;
