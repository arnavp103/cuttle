import { Link } from 'react-router';
import { useState } from 'react';
import { nanoid } from 'nanoid';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

function Games() {
    // Example games with nanoid-style IDs
    const [games, setGames] = useState([
        { id: "V1StGXR8_Z5jdHi6B-myT", name: "Rudolph's Game", players: 1 },
        { id: "LJWvEMDsXYp2Hw7rYA-am", name: "Anna's Game", players: 2 },
        { id: "7oet_d9xzq3BeloxAqoez", name: "Haus's Game" },
    ]);

    const [username, setUsername] = useState('');

    const handleCreateGame = () => {
        if (username.trim() === '') {
            return;
        }

        const gameId = nanoid();
        const newGame = {
            id: gameId,
            name: `${username}'s Game`,
            players: 1
        };

        setGames([...games, newGame]);
        setUsername('');

        // Navigate to the new game page
        window.location.href = `/games/${gameId}`;
    };

    return (
        <div className="flex flex-col items-center min-h-screen w-full mx-auto bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6 mt-2">Games</h1>

            <Tabs defaultValue="list" className="w-3/5 mx-auto">
                <TabsList className="mb-4 w-full grid grid-cols-2">
                    <TabsTrigger
                        value="list"
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-black font-medium"
                    >
                        Games List
                    </TabsTrigger>
                    <TabsTrigger
                        value="create"
                        className="data-[state=active]:bg-amber-500 data-[state=active]:text-black font-medium"
                    >
                        Create Game
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="w-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-700">
                                <TableHead className="text-white font-bold text-center">Game Name</TableHead>
                                <TableHead className="text-white font-bold text-center">Players</TableHead>
                                <TableHead className="text-white font-bold text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {games.map(game => (
                                <TableRow key={game.id}>
                                    <TableCell className='text-center'>{game.name}</TableCell>
                                    <TableCell className='text-center'>{game.players || 0}/2</TableCell>
                                    <TableCell className='text-center'>
                                        <Link to={`/games/${game.id}`} className="text-blue-400 hover:text-blue-300 underline">
                                            Join
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="create" className="w-full">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 rounded border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter username"
                            />
                        </div>

                        <Button
                            onClick={handleCreateGame}
                            className="w-full bg-amber-600 hover:bg-amber-700 font-bold py-3 text-lg"
                        >
                            Create Game
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Games;
