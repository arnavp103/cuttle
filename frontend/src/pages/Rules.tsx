import { Button } from '@/components/ui/button'
import { Link } from 'react-router';

function Rules() {
    return (
        <div className={`flex flex-col justify-center items-center min-h-screen min-w-screen bg-gray-900 text-white p-8`}>
            <h1 className="font-bold text-4xl mb-8">Game Rules</h1>

            <div className="max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-amber-400">How to Play Cuttle</h2>

                <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2 text-amber-300">Game Objective</h3>
                    <p className="mb-4">
                        Cuttle is a strategic card game played with a standard 52-card deck. The goal is to be the first
                        player to reach a point total of 21 or more using number cards on your side.
                    </p>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2 text-amber-300">Card Values</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Number cards (2-10): Worth their face value in points</li>
                        <li>Face cards (J, Q, K): Have special abilities</li>
                        <li>Aces: Can be used as powerful special cards</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3 className="text-xl font-medium mb-2 text-amber-300">Basic Rules</h3>
                    <p className="mb-4">
                        Players take turns drawing one card and performing one action. Actions include playing point
                        cards, playing face cards for their effects, or using special abilities.
                    </p>
                    <p>
                        Strategy involves building your point total while disrupting your opponent's progress through
                        clever use of face cards and special abilities.
                    </p>
                </section>
            </div>

            <Button asChild className="mt-8 bg-amber-600 font-bold text-lg hover:bg-amber-700">
                <Link to="/games" className="p-4">Start a Game</Link>
            </Button>
        </div>
    )
}

export default Rules
