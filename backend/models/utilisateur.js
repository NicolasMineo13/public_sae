export class Utilisateur {
    constructor(id, nom, prenom, email, login, password, role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.login = login;
        this.password = password;
        this.role = role;
    }

    get id() {
        return this._id;
    }

    get nom() {
        return this._nom;
    }

    get prenom() {
        return this._prenom;
    }

    get email() {
        return this._email;
    }

    get login() {
        return this._login;
    }

    get password() {
        return this._password;
    }

    get role() {
        return this._role;
    }

    set id(id) {
        this._id = id;
    }

    set nom(nom) {
        this._nom = nom;
    }

    set prenom(prenom) {
        this._prenom = prenom;
    }

    set email(email) {
        this._email = email;
    }

    set login(login) {
        this._login = login;
    }

    set password(password) {
        this._password = password;
    }

    set role(role) {
        this._role = role;
    }
}