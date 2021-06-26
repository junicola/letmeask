import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import illustration from '../assets/images/letmeask-gif.gif'
import logoImg from '../assets/images/letmeask-logo-2.png'
import googleIconImg from '../assets/images/google-icon.svg'
import lightImg from '../assets/images/sun.png'
import darkImg from '../assets/images/moon.png'
import { Button } from './../components/Button';

import '../styles/auth.scss'
import { useAuth } from './../hooks/useAuth';
import { database } from '../services/firebase';
import { useTheme } from './../hooks/useTheme';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    const { theme, toggleTheme } = useTheme();

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exists');
            return;
        }

        if (roomRef.val().closedAt) {
            alert('Room already closed');
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth" className={theme}>
            <aside>
                <img src={illustration} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <button onClick={toggleTheme} className="btn-toggle">
                    {theme === 'light' ?
                        <img src={lightImg} alt="Alterar tema do site" />
                        : <img src={darkImg} alt="Alterar tema do site" />
                    }
                </button>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask logo" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}