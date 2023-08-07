DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS games;

CREATE TABLE users (
    index INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id UUID UNIQUE DEFAULT gen_random_uuid() NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    flags INTEGER DEFAULT 0 NOT NULL,
    xp INTEGER DEFAULT 0 NOT NULL,
    level INTEGER DEFAULT 1 NOT NULL,
    gold INTEGER DEFAULT 0 NOT NULL,
    gems INTEGER DEFAULT 0 NOT NULL,
    referrer UUID,
    online_at TIMESTAMP DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE friendships (
    index INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    sender UUID REFERENCES users(id) NOT NULL,
    receiver UUID REFERENCES users(id) NOT NULL,
    status INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE index ON friendships (least(sender, receiver), greatest(receiver, sender));

CREATE TABLE games (
    index INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id UUID UNIQUE NOT NULL,
    player_count_by_team INTEGER[] NOT NULL
);

CREATE TABLE words (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO users (id, email, username) VALUES (
    '00000000-0000-4000-8000-000000000000',
    'contact@nomdecode.fun',
    'l'
);

INSERT INTO users (id, email, username) VALUES (
    '84c4bc56-7060-445c-a0f4-34559922c917',
    'l@l.ll',
    'lo'
);

INSERT INTO friendships (sender, receiver, status) VALUES (
    '84c4bc56-7060-445c-a0f4-34559922c917',
    '00000000-0000-4000-8000-000000000000',
    1
);

INSERT INTO words (name) VALUES
    ('AFRIQUE'),
    ('AIGUILLE'),
    ('AILE'),
    ('AIR'),
    ('ALIEN'),
    ('ALLEMAGNE'),
    ('ALPES'),
    ('AMOUR'),
    ('AMPOULE'),
    ('AMÉRIQUE'),
    ('ANGE'),
    ('ANGLETERRE'),
    ('ANNEAU'),
    ('APPAREIL'),
    ('ARAIGNÉE'),
    ('ARC'),
    ('ARGENT'),
    ('ASILE'),
    ('ASTÉRIX'),
    ('ATLANTIQUE'),
    ('ATOUT'),
    ('AUSTRALIE'),
    ('AVION'),
    ('AVOCAT'),
    ('BAGUETTE'),
    ('BAIE'),
    ('BALANCE'),
    ('BALEINE'),
    ('BALLE'),
    ('BALLON'),
    ('BANANE'),
    ('BANC'),
    ('BANDE'),
    ('BANQUE'),
    ('BAR'),
    ('BARBE'),
    ('BASE'),
    ('BATEAU'),
    ('BERLIN'),
    ('BIÈRE'),
    ('BLÉ'),
    ('BOMBE'),
    ('BON'),
    ('BOTTE'),
    ('BOUCHE'),
    ('BOUCHON'),
    ('BOUGIE'),
    ('BOULET'),
    ('BOURSE'),
    ('BOUTEILLE'),
    ('BOUTON'),
    ('BOÎTE'),
    ('BRANCHE'),
    ('BRETELLE'),
    ('BRIQUE'),
    ('BUREAU'),
    ('BUT'),
    ('BÂTON'),
    ('BÊTE'),
    ('BÛCHE'),
    ('BŒUF'),
    ('CABINET'),
    ('CADRE'),
    ('CAFARD'),
    ('CAFÉ'),
    ('CAMEMBERT'),
    ('CAMPAGNE'),
    ('CANADA'),
    ('CANARD'),
    ('CANNE'),
    ('CANON'),
    ('CARREAU'),
    ('CARRIÈRE'),
    ('CARTE'),
    ('CARTON'),
    ('CARTOUCHE'),
    ('CASINO'),
    ('CEINTURE'),
    ('CELLULE'),
    ('CENTRE'),
    ('CERCLE'),
    ('CHAMP'),
    ('CHAMPAGNE'),
    ('CHANCE'),
    ('CHAPEAU'),
    ('CHARGE'),
    ('CHARME'),
    ('CHASSE'),
    ('CHAT'),
    ('CHAUSSON'),
    ('CHAÎNE'),
    ('CHEF'),
    ('CHEMISE'),
    ('CHEVAL'),
    ('CHEVALIER'),
    ('CHIEN'),
    ('CHINE'),
    ('CHOCOLAT'),
    ('CHOU'),
    ('CHÂTEAU'),
    ('CINÉMA'),
    ('CIRQUE'),
    ('CITROUILLE'),
    ('CLASSE'),
    ('CLUB'),
    ('CLÉ'),
    ('COCHON'),
    ('CODE'),
    ('COL'),
    ('COLLE'),
    ('COMMERCE'),
    ('COQ'),
    ('CORDE'),
    ('CORNE'),
    ('COTON'),
    ('COUPE'),
    ('COURANT'),
    ('COURONNE'),
    ('COURSE'),
    ('COURT'),
    ('COUTEAU'),
    ('COUVERTURE'),
    ('CRITIQUE'),
    ('CROCHET'),
    ('CUISINE'),
    ('CYCLE'),
    ('CŒUR'),
    ('DANSE'),
    ('DINOSAURE'),
    ('DOCTEUR'),
    ('DON'),
    ('DRAGON'),
    ('DROIT'),
    ('DROITE'),
    ('EAU'),
    ('ENCEINTE'),
    ('ENSEMBLE'),
    ('ENTRÉE'),
    ('ESPACE'),
    ('ESPAGNE'),
    ('ESPION'),
    ('ESPRIT'),
    ('ESSENCE'),
    ('EUROPE'),
    ('FACTEUR'),
    ('FANTÔME'),
    ('FARCE'),
    ('FER'),
    ('FERME'),
    ('FEU'),
    ('FEUILLE'),
    ('FIGURE'),
    ('FILET'),
    ('FIN'),
    ('FLÛTE'),
    ('FORMULE'),
    ('FORT'),
    ('FORÊT'),
    ('FOU'),
    ('FOYER'),
    ('FRAISE'),
    ('FRANÇAIS'),
    ('FRONT'),
    ('FUITE'),
    ('GARDE'),
    ('GAUCHE'),
    ('GEL'),
    ('GLACE'),
    ('GORGE'),
    ('GRAIN'),
    ('GRENADE'),
    ('GRUE'),
    ('GRÈCE'),
    ('GUERRE'),
    ('GUIDE'),
    ('GÉANT'),
    ('GÉNIE'),
    ('HERBE'),
    ('HIMALAYA'),
    ('HISTOIRE'),
    ('HIVER'),
    ('HOLLYWOOD'),
    ('HÉROS'),
    ('HÔPITAL'),
    ('HÔTEL'),
    ('INDIEN'),
    ('IRIS'),
    ('JET'),
    ('JEU'),
    ('JOUR'),
    ('JOURNAL'),
    ('JUMELLES'),
    ('JUNGLE'),
    ('KANGOUROU'),
    ('KIWI'),
    ('LAIT'),
    ('LANGUE'),
    ('LASER'),
    ('LENTILLE'),
    ('LETTRE'),
    ('LICORNE'),
    ('LIEN'),
    ('LIGNE'),
    ('LION'),
    ('LIQUIDE'),
    ('LIT'),
    ('LIVRE'),
    ('LONDRES'),
    ('LOUCHE'),
    ('LUMIÈRE'),
    ('LUNE'),
    ('LUNETTES'),
    ('LUXE'),
    ('MACHINE'),
    ('MAGIE'),
    ('MAIN'),
    ('MAJEUR'),
    ('MALADIE'),
    ('MANCHE'),
    ('MANÈGE'),
    ('MARCHE'),
    ('MARIN'),
    ('MARQUE'),
    ('MARRON'),
    ('MARS'),
    ('MAÎTRESSE'),
    ('MEMBRE'),
    ('MENU'),
    ('MEUBLE'),
    ('MICROSCOPE'),
    ('MIEL'),
    ('MILLIONAIRE'),
    ('MINE'),
    ('MINEUR'),
    ('MODE'),
    ('MOLIÈRE'),
    ('MORT'),
    ('MOUCHE'),
    ('MOULE'),
    ('MOUSSE'),
    ('MOUSTACHE'),
    ('MÉMOIRE'),
    ('NAIN'),
    ('NAPOLÉON'),
    ('NEIGE'),
    ('NEW-YORK'),
    ('NINJA'),
    ('NOIR'),
    ('NOTE'),
    ('NOËL'),
    ('NUIT'),
    ('NUMÉRO'),
    ('NŒUD'),
    ('OISEAU'),
    ('OPÉRA'),
    ('OPÉRATION'),
    ('OR'),
    ('ORANGE'),
    ('ORDRE'),
    ('PAGE'),
    ('PAILLE'),
    ('PALAIS'),
    ('PALME'),
    ('PAPIER'),
    ('PARACHUTE'),
    ('PARIS'),
    ('PARTIE'),
    ('PASSE'),
    ('PATRON'),
    ('PENDULE'),
    ('PENSÉE'),
    ('PERLE'),
    ('PESTE'),
    ('PHARE'),
    ('PHYSIQUE'),
    ('PIANO'),
    ('PIED'),
    ('PIGEON'),
    ('PILE'),
    ('PILOTE'),
    ('PINGOUIN'),
    ('PIRATE'),
    ('PIÈCE'),
    ('PLACE'),
    ('PLAGE'),
    ('PLAN'),
    ('PLANCHE'),
    ('PLANTE'),
    ('PLAT'),
    ('PLATEAU'),
    ('PLUME'),
    ('POINT'),
    ('POIRE'),
    ('POISON'),
    ('POISSON'),
    ('POLICE'),
    ('POMME'),
    ('POMPE'),
    ('PORTABLE'),
    ('POSTE'),
    ('POUCE'),
    ('POÊLE'),
    ('PRINCESSE'),
    ('PRISE'),
    ('PRÊT'),
    ('PYRAMIDE'),
    ('PÉTROLE'),
    ('PÊCHE'),
    ('PÔLE'),
    ('QUARTIER'),
    ('QUEUE'),
    ('RADIO'),
    ('RAIE'),
    ('RAME'),
    ('RAT'),
    ('RAYON'),
    ('RECETTE'),
    ('REINE'),
    ('RELIGIEUSE'),
    ('REMISE'),
    ('REQUIN'),
    ('RESTAURANT'),
    ('ROBE'),
    ('ROBOT'),
    ('ROI'),
    ('ROME'),
    ('RONDE'),
    ('ROSE'),
    ('ROUGE'),
    ('ROULEAU'),
    ('ROULETTE'),
    ('RUSSIE'),
    ('RÈGLE'),
    ('RÉSISTANCE'),
    ('RÉVOLUTION'),
    ('SARDINE'),
    ('SATELLITE'),
    ('SCHTROUMPF'),
    ('SCIENCE'),
    ('SCÈNE'),
    ('SENS'),
    ('SEPT'),
    ('SERPENT'),
    ('SIRÈNE'),
    ('SIÈGE'),
    ('SOL'),
    ('SOLDAT'),
    ('SOLEIL'),
    ('SOLUTION'),
    ('SOMME'),
    ('SORCIÈRE'),
    ('SORTIE'),
    ('SOURIS'),
    ('TABLE'),
    ('TABLEAU'),
    ('TALON'),
    ('TAMBOUR'),
    ('TEMPLE'),
    ('TEMPS'),
    ('TENNIS'),
    ('TERRE'),
    ('TIMBRE'),
    ('TITRE'),
    ('TOILE'),
    ('TOKYO'),
    ('TOUR'),
    ('TRAIT'),
    ('TROU'),
    ('TRÉSOR'),
    ('TUBE'),
    ('TUILE'),
    ('TÊTE'),
    ('UNIFORME'),
    ('VAGUE'),
    ('VAISSEAU'),
    ('VAMPIRE'),
    ('VASE'),
    ('VENT'),
    ('VERRE'),
    ('VERT'),
    ('VIE'),
    ('VIN'),
    ('VISAGE'),
    ('VISION'),
    ('VOILE'),
    ('VOITURE'),
    ('VOL'),
    ('VOLEUR'),
    ('VOLUME'),
    ('ZÉRO'),
    ('ÉCHELLE'),
    ('ÉCLAIR'),
    ('ÉCOLE'),
    ('ÉGALITÉ'),
    ('ÉGYPTE'),
    ('ÉPONGE'),
    ('ÉTOILE'),
    ('ÉTUDE'),
    ('ŒIL'),
    ('ŒUF');