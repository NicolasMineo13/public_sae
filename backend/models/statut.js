export class Statut {
    constructor(id, libelle, couleur) {
        this.id = id;
        this.libelle = libelle;
        this.couleur = couleur;
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

    get couleur() {
        return this._couleur;
    }

    set couleur(value) {
        this._couleur = value;
    }
}