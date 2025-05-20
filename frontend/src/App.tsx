import { Routes, Route, Link } from 'react-router'
import './index.css'
import Home from './pages/Home'
import Games from './pages/Games'
import Match from './pages/Match'
import Rules from './pages/Rules'
import NotFound from './pages/NotFound'

function App() {
    return (
        <>
            <nav className="border-b bg-indigo-900 shadow-lg">
                <div className="container mx-auto flex h-20 items-center px-4">
                    <div className="flex h-full">
                        <Link
                            to="/"
                            className="flex items-center px-8 h-full text-lg font-bold text-white hover:bg-indigo-800 transition-all duration-200 border-b-4 border-transparent hover:border-amber-400"
                        >
                            Home
                        </Link>
                        <Link
                            to="/games"
                            className="flex items-center px-8 h-full text-lg font-bold text-white hover:bg-indigo-800 transition-all duration-200 border-b-4 border-transparent hover:border-amber-400"
                        >
                            Games
                        </Link>
                        <Link
                            to="/rules"
                            className="flex items-center px-8 h-full text-lg font-bold text-white hover:bg-indigo-800 transition-all duration-200 border-b-4 border-transparent hover:border-amber-400"
                        >
                            Rules
                        </Link>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<Games />} />
                <Route path="/games/:id" element={<Match />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default App
