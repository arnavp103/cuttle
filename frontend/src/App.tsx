import { Routes, Route, Link } from 'react-router'
import './index.css'
import Home from './pages/Home'
import Play from './pages/Play'
import Match from './pages/Match'
import Rules from './pages/Rules'
import NotFound from './pages/NotFound'
import Chat from './pages/Chat';
import { WebRTCProvider } from './context/WebRTCProvider'
import { GameProvider } from './context/GameProvider'

function App() {
    return (
        <WebRTCProvider>
            <GameProvider>
            <nav className="border-b bg-indigo-900 shadow-lg">
                <div className="container mx-auto flex h-20 items-center px-4">
                    <div className="flex h-full">
                        <Link
                            to="/"
                            className="flex items-center px-24 h-full text-xl font-bold text-white hover:bg-indigo-800 transition-all duration-200 border-b-4 border-transparent hover:border-amber-400"
                        >
                            Home
                        </Link>
                        <Link
                            to="/play"
                            className="flex items-center px-24 h-full text-xl font-bold text-white hover:bg-indigo-800 transition-all duration-200 border-b-4 border-transparent hover:border-amber-400"
                        >
                            Play
                        </Link>
                        <Link
                            to="/rules"
                            className="flex items-center px-24 h-full text-xl font-bold text-white hover:bg-indigo-800 transition-all duration-200 border-b-4 border-transparent hover:border-amber-400"
                        >
                            Rules
                        </Link>
                    </div>
                </div>
            </nav>
            </GameProvider>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/play/:id" element={<Match />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </WebRTCProvider>
    )
}

export default App
