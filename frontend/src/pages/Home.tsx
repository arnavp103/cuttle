import PlayingCard from '@/components/game/PlayingCard'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router';

function Home() {

    return (
        <div className={`flex flex-col justify-center items-center min-h-screen min-w-screen bg-gray-900 text-white`}>
            <h1 className="font-bold text-4xl mb-8">Cuttle</h1>
            <Button asChild className="bg-amber-600 font-bold text-lg hover:bg-amber-600">
                <Link to="/games" className="p-4 bg-amber-400 font-bold text-lg hover:bg-amber-700">Start a Game</Link>
            </Button >
            {/* <PlayingCard suit="hearts" rank="A" /> */}
        </div>
    )
}

export default Home
