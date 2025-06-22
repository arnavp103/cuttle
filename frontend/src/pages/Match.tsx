import { useParams, Link } from 'react-router';
import Board from '@/components/game/Board';
import { Button } from '@/components/ui/button';

function Match() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen min-w-screen bg-gray-900 text-white">
            <div className="w-3/5 h-9/10 mx-auto text-center">
                <Board />
            </div>
            <p className="my-4">Details for game ID: {id}</p>
            <div className="mt-6 flex flex-col gap-2">
                <Button asChild className="text-gray-400 hover:text-white underline hover:cursor-pointer">
                    <Link to="/" className="pb-4">← Back to Home</Link>
                </Button>
            </div>  
        </div>
    );
}

export default Match;
