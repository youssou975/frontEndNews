// src/types/News.ts

import { ObjectId } from 'mongoose';

export interface Comment {
    auteur: string;
    texte: string;
    date: Date;
}

export interface News {
    _id: string; // L'ID MongoDB
    url: string;
    titre: string;
    dateAjout: string;
    auteur: string;
    likes: number;
    dislikes: number;
    likedBy: ObjectId[]; // Utilisateurs ayant liké
    dislikedBy: ObjectId[]; // Utilisateurs ayant disliké
    score: number;
    commentaires: Comment[];
}
