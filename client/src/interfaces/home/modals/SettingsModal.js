import Modal from '../../../structures/Modal.js';

export default class SettingsModal extends Modal {
    constructor(app) {
        super({
            width: 550,
            height: 300,
        });
        this.app = app;
        this.manager = app.manager;
    }

    open() {
        super.open(event);

        this.element.id = 'logout-modal';

        const changeUsernameCTA = document.createElement('div');
        changeUsernameCTA.onclick = () => {
            this.close();
            delete localStorage.token;
            delete this.manager.api.token;
            this.app.goAuth();
        };
        changeUsernameCTA.id = 'change-username-cta';

        const changeUsernameText = document.createElement('span');
        changeUsernameText.textContent = this.manager.api.isGuest ? 'Se connecter' : 'Se déconnecter';

        changeUsernameCTA.appendChild(changeUsernameText);

        const tos = document.createElement('span');
        tos.textContent = 'Mentions légales';
        tos.onclick = () => {
            tos.style.textAlign = 'center';
            tos.textContent = `
            Hébergeur :
            Contabo GmbH
            Aschauer Straße 32a
            81549 Munich
            Germany

            Tel: +49 89 3564717 70
            E-mail: info@contabo.com

            Développeur :
            contact@nomdecode.fun
            `;
        };

        const gdpr = document.createElement('span');
        gdpr.textContent = 'RGPD';
        gdpr.onclick = () => {
            gdpr.style.textAlign = 'center';
            gdpr.textContent = `
            Nous enregistrons votre adresse e-mail pour vous identifier uniquement.
            Vous pouvez nous contacter pour consulter ou supprimer ces données.`;
        };

        const cgv = document.createElement('span');
        cgv.textContent = 'CGV';
        cgv.onclick = () => {
            cgv.style.textAlign = 'center';
            cgv.textContent = `
            Tout paiement est annulable et remboursable dans les 14 jours suivant la transaction sans justification.
            Le produit vous est livré sous maximum une semaine.
            `;
        };

        this.element.append(changeUsernameCTA, tos, gdpr, cgv);
    }
}
