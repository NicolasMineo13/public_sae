export class Role {
    constructor(id, libelle, by_default) {
        this.id = id;
        this.libelle = libelle;
        this.by_default = by_default;
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

    get by_default() {
        return this._by_default;
    }

    set by_default(value) {
        this._by_default = value;
    }
}