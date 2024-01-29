export class Ticket {
    constructor(id, titre, description, date_creation, id_utilisateur_demandeur, id_utilisateur_technicien, id_statut, date_derniere_modif, date_cloture) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.date_creation = date_creation;
        this.id_utilisateur_demandeur = id_utilisateur_demandeur;
        this.id_utilisateur_technicien = id_utilisateur_technicien;
        this.id_statut = id_statut;
        this.date_derniere_modif = date_derniere_modif;
        this.date_cloture = date_cloture;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get titre() {
        return this._titre;
    }

    set titre(value) {
        this._titre = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get date_creation() {
        return this._date_creation;
    }

    set date_creation(value) {
        this._date_creation = value;
    }

    get id_utilisateur_demandeur() {
        return this._id_utilisateur_demandeur;
    }

    set id_utilisateur_demandeur(value) {
        this._id_utilisateur_demandeur = value;
    }

    get id_utilisateur_technicien() {
        return this._id_utilisateur_technicien;
    }

    set id_utilisateur_technicien(value) {
        this._id_utilisateur_technicien = value;
    }

    get id_statut() {
        return this._id_statut;
    }

    set id_statut(value) {
        this._id_statut = value;
    }

    get date_derniere_modif() {
        return this._date_derniere_modif;
    }

    set date_derniere_modif(value) {
        this._date_derniere_modif = value;
    }

    get date_cloture() {
        return this._date_cloture;
    }

    set date_cloture(value) {
        this._date_cloture = value;
    }
}