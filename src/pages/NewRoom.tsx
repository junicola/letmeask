import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import illustration from '../assets/images/letmeask-gif.gif'
import logoImg from '../assets/images/letmeask-logo-2.png'

import { Button } from './../components/Button';
import { useAuth } from './../hooks/useAuth';

import lightImg from '../assets/images/sun.png'
import darkImg from '../assets/images/moon.png'

import '../styles/auth.scss'
import { database } from '../services/firebase';
import { useTheme } from './../hooks/useTheme';

export function NewRoom() {
    const { user } = useAuth();

    const { theme, toggleTheme } = useTheme();

    const history = useHistory();
    const [ newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        });

        history.push(`admin/rooms/${firebaseRoom.key}`);

    }

    return (
        <div id="page-auth" className={theme}>
            <aside>
                <img src={illustration} alt="Ilustração simbolizando perguntas e respostas"/>
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
                    <img src={logoImg} alt="Letmeask logo"/>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}