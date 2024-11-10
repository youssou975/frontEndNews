import React, { useEffect, useState } from 'react';
import api from '../../services/axiosConfig';
import { News } from '../../types/niew';
import './view.css';
import { Link } from 'react-router-dom';

const NewsList: React.FC = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState<{ [key: string]: string }>({});
    const [totalScore, setTotalScore] = useState<number>(0);

    useEffect(() => {
        fetchNews();
        fetchTotalScore();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await api.get('/news/viewNews');
            setNewsList(Array.isArray(response.data.formattedNews) ? response.data.formattedNews : []);
        } catch (error) {
            console.error("Erreur lors de la récupération des news:", error);
        }
    };

    const fetchTotalScore = async () => {
        try {
            const response = await api.get('/score/totalscore');
            setTotalScore(response.data.totalScore || 0);
        } catch (error) {
            console.error("Erreur lors de la récupération du score total:", error);
        }
    };

    // Fonction pour ajouter un ami
    const handleAddFriend = async (friendId: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.post('/friend/addFriend', { friendId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Mise à jour du message de succès
            setSuccessMessage(prevMessages => ({
                ...prevMessages,
                [friendId]: 'Auteur ajouté en tant qu\'ami !'
            }));
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'ami:', error);
            setSuccessMessage(prevMessages => ({
                ...prevMessages,
                [friendId]: 'Erreur lors de l\'ajout de l\'ami.'
            }));
        }
    };

    const handleAddComment = async (newsId: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(`/news/addComment`, { newsId, texte: comments[newsId] || '' }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setComments(prevComments => ({
                ...prevComments,
                [newsId]: ''
            }));

            setSuccessMessage(prevMessages => ({
                ...prevMessages,
                [newsId]: 'Commentaire ajouté avec succès !'
            }));

            fetchNews();

            setTimeout(() => {
                setSuccessMessage(prevMessages => ({
                    ...prevMessages,
                    [newsId]: ''
                }));
            }, 3000);
        } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire:", error);
        }
    };

    const handleLikeDislike = async (newsId: string, isLike: boolean) => {
        try {
            const token = localStorage.getItem('token');
            await api.post(`/news/likeDislikeNews`, { newsId, isLike }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNews();
        } catch (error) {
            console.error("Erreur lors de l'action Like/Dislike:", error);
        }
    };

    return (
        <div className="container">
            <br />
            <h2 className="text-center mb-4">Page des News</h2>

            <div className="total-score text-center mb-4">
                <h3>Total Score des News: {totalScore}</h3>
            </div>

            <Link to="/add-news">
                <button className="btn btn-primary mb-3">
                    Ajouter une News
                </button>
            </Link>

            {newsList.map((news) => (
                <div className="card mb-3" key={news._id}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <div className="avatar me-2"></div>
                                <div>
                                    <strong>{news.auteur}</strong>
                                    <small className="text-muted">• {new Date(news.dateAjout).toLocaleDateString()}</small>
                                </div>
                            </div>
                            {/* Bouton Ajouter en tant qu'ami */}
                            <button
                                className="btn btn-outline-info btn-sm"
                                onClick={() => handleAddFriend(news.auteur)}
                            >
                                Ajouter ami
                            </button>
                        </div>

                        <h5 className="card-title">{news.titre}</h5>
                        <p className="card-text">{news.url}</p>

                        <div className="d-flex justify-content-start mb-3">
                            <button className="btn btn-outline-success me-2" onClick={() => handleLikeDislike(news._id, true)}>
                                👍 {news.likes} Likes
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => handleLikeDislike(news._id, false)}>
                                👎 {news.dislikes} Dislikes
                            </button>
                        </div>

                        <div className="comment-section mt-4">
                            {successMessage[news._id] && <p className="text-success">{successMessage[news._id]}</p>}
                            <div className="d-flex align-items-center mb-2">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Ajouter un commentaire..."
                                    value={comments[news._id] || ''}
                                    onChange={(e) => setComments(prevComments => ({
                                        ...prevComments,
                                        [news._id]: e.target.value
                                    }))} 
                                />
                                <button className="btn btn-sm btn-primary" onClick={() => handleAddComment(news._id)}>
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {newsList.length === 0 && <p className="text-center">Aucune news trouvée.</p>}
        </div>
    );
};

export default NewsList;
