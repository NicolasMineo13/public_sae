export class Reponse {
    constructor(id, libelle, date_creation, date_derniere_modif, id_utilisateur, id_ticket, solution) {
        this.id = id;
        this.libelle = libelle;
        this.date_creation = date_creation;
        this.date_derniere_modif = date_derniere_modif;
        this.id_utilisateur = id_utilisateur;
        this.id_ticket = id_ticket;
        this.solution = solution;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get libelle() {
        return this._libelle;
    }

    set libelle(value) {
        this._libelle = value;
    }

    get date_creation() {
        return this._date_creation;
    }

    set date_creation(value) {
        this._date_creation = value;
    }

    get date_derniere_modif() {
        return this._date_derniere_modif;
    }

    set date_derniere_modif(value) {
        this._date_derniere_modif = value;
    }

    get id_utilisateur() {
        return this._id_utilisateur;
    }

    set id_utilisateur(value) {
        this._id_utilisateur = value;
    }

    get id_ticket() {
        return this._id_ticket;
    }

    set id_ticket(value) {
        this._id_ticket = value;
    }

    get solution() {
        return this._solution;
    }

    set solution(value) {
        this._solution = value;
    }
}