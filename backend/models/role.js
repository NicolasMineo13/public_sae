export class Role {
    constructor(id, libelle) {
        this.id = id;
        this.libelle = libelle;
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
}