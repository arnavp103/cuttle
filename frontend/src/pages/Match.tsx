import { useParams, Link } from 'react-router';
import Board from '@/components/game/Board';

function Match() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen min-w-screen bg-gray-900 text-white">
            <div className="w-3/5 h-9/10 mx-auto text-center">
                <Board />
            </div>
            <p className="my-4">Details for game ID: {id}</p>
            <div className="mt-6 flex flex-col gap-2">
                <Link to="/games" className="text-blue-400 hover:text-blue-300 underline">
                    Back to Games List
                </Link>
                <Link to="/" className="text-green-400 hover:text-green-300 underline">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default Match;
