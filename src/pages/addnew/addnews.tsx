import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig'; // Votre fichier de configuration axios
import './addnews.css';

const AddNews: React.FC = () => {
    const navigate = useNavigate();
    const [titre, setTitre] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Message de succès

    // Fonction pour gérer l'ajout de la news
    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');  // Vérification si le formulaire est bien soumis

        // Vérification des champs requis
        if (!titre || !url) {
            setError("Tous les champs doivent être remplis.");
            console.log("Fields are not complete");  // Affiche quand les champs sont incomplets
            return;
        }

        try {
            console.log('Sending request to the server...');
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Token invalide ou expiré. Veuillez vous reconnecter.");
                console.log('No valid token');
                return;
            }

            const response = await api.post('/news/addNew', {
                titre,
                url,
                dateAjout: new Date().toISOString(), // Date actuelle
                auteur: localStorage.getItem('login') || 'Anonyme', // L'utilisateur connecté, sinon 'Anonyme'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Response received:', response);  // Vérification de la réponse

            if (response.status === 201) {
                setSuccessMessage('News ajoutée avec succès');
                console.log('Ajout réussi');  // Ce log devrait être exécuté si la réponse est correcte
                setTimeout(() => {
                    navigate('/'); // Rediriger vers la page d'accueil
                }, 2000);
            } else {
                setError("Une erreur s'est produite lors de l'ajout de la news.");
                console.log('Response status is not 200');
            }
        } catch (error: any) {
            console.log('An error occurred:', error);  // Ajout d'un log pour l'erreur
            setError("Une erreur s'est produite lors de l'ajout de la news.");
        }
    };

    return (
        <div>
            <br />
            <br />
            <br />
            
        <div className="add-news-container">
            <br />
            <br />
            <br />
            <h2>Ajouter une News</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>} {/* Message de succès */}
            <form onSubmit={handleAddNews}>
                <div className="form-group">
                    <label htmlFor="url">URL</label>
                    <input
                        type="text"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Entrez l'URL"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="titre">Titre</label>
                    <input
                        type="text"
                        id="titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        placeholder="Entrez le titre de la news"
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Ajouter la News
                </button>
            </form>
        </div>
        </div>
    );
};

export default AddNews;
