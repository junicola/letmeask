import logoImg from '../assets/images/letmeask-logo-1.png'

import { useHistory, useParams} from 'react-router-dom'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { RoomCode } from './../components/RoomCode';
// import { useAuth } from './../hooks/useAuth';
// import { database } from '../services/firebase';
import { Question } from './../components/Question';
import { useRoom } from './../hooks/useRoom';
import { Button } from './../components/Button';
import { database } from '../services/firebase';
import { useTheme } from './../hooks/useTheme';

import lightImg from '../assets/images/sun.png'
import darkImg from '../assets/images/moon.png'

import '../styles/room.scss';

type RoomParams = {
    id: string,
}

export function AdminRoom() {
    const params = useParams<RoomParams>();
    // const { user } = useAuth();
    const history = useHistory();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);
    const { theme, toggleTheme } = useTheme();

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
           await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

    return (
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask logo"/>
                    <div>     
                        <RoomCode code={params.id}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                        <button onClick={toggleTheme} className="btn-toggle">
                            {theme === 'light' ?
                                <img src={lightImg} alt="Alterar tema do site" />
                                : <img src={darkImg} alt="Alterar tema do site" />
                            }
                        </button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                               { !question.isAnswered && (
                                   <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta respondida"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Destacar pergunta"/>
                                        </button>
                                   </>
                               )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta"/>
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}