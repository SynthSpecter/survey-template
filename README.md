# 🌌 Synthwave Survey

**Un template de questionnaire modulaire et stylisé en HTML/CSS/JS avec un design rétro-futuriste.**  
**A modular and stylish survey template in HTML/CSS/JS with a retro-futuristic design.**

---

## 📌 **À propos / About**

### Français

**Synthwave Survey** est un template de questionnaire **modulaire et personnalisable**, conçu pour les développeurs qui veulent créer des sondages, quiz ou formulaires avec un **style synthwave** (néons, animations rétro, fond dynamique).  
Idéal pour :

- Les projets personnels ou professionnels.
- Les communautés de développeurs ou de fans de la culture rétro.
- Les utilisateurs qui veulent un design unique et immersif.

### English

**Synthwave Survey** is a **modular and customizable** survey template designed for developers who want to create polls, quizzes, or forms with a **synthwave style** (neon colors, retro animations, dynamic background).  
Perfect for:

- Personal or professional projects.
- Developer communities or retro culture fans.
- Users who want a unique and immersive design.

---

## 🛠 **Prérequis / Prerequisites**

### Français

- Un navigateur moderne (Chrome, Firefox, Edge, etc.).
- Un éditeur de code (VSCode, Sublime Text, etc.).
- Aucune dépendance externe (100% HTML/CSS/JS natif).

### English

- A modern browser (Chrome, Firefox, Edge, etc.).
- A code editor (VSCode, Sublime Text, etc.).
- No external dependencies (100% vanilla HTML/CSS/JS).

---

## 🚀 **Installation / Installation**

### Français

1. **Cloner ou télécharger** le dépôt :

   git clone https://github.com/ton-utilisateur/synthwave-survey.git

_Ou télécharge le ZIP et extrais-le._

2. **Ouvrir le projet** :

- Navigue dans le dossier `synthwave-survey/`.
- Ouvre `index.html` dans ton navigateur.

3. **Personnaliser** :

- Modifie `js/survey.js` pour ajouter/supprimer des questions.
- Adapte les styles dans `css/style.css`.

### English

1. **Clone or download** the repository:

   git clone https://github.com/your-username/synthwave-survey.git

_Or download the ZIP and extract it._

2. **Open the project**:

- Navigate to the `synthwave-survey/` folder.
- Open `index.html` in your browser.

3. **Customize**:

- Edit `js/survey.js` to add/remove questions.
- Adjust styles in `css/style.css`.

---

## ✨ **Fonctionnalités / Features**

| **Fonctionnalité**          | **Description**                                                       | **Status**          |
| --------------------------- | --------------------------------------------------------------------- | ------------------- |
| **Multiple Question Types** | QCM (radio), cases à cocher (checkbox), champ texte, échelle (1-5).   | ✅ Implémenté       |
| **Design Synthwave**        | Couleurs néon, animations rétro, fond dynamique.                      | ✅ Implémenté       |
| **Navigation**              | Boutons Précédent/Suivant, barre de progression.                      | ✅ Implémenté       |
| **Validation**              | Impossible de passer à la question suivante sans répondre.            | ✅ Implémenté       |
| **Modularité**              | Ajout/suppression de questions via `surveyConfig`.                    | ✅ Implémenté       |
| **Thèmes alternatifs**      | (À venir) Thèmes clairs/sombres.                                      | ⏳ En développement |
| **Sauvegarde locale**       | (À venir) Stockage des réponses dans `localStorage`.                  | ⏳ En développement |
| **Backend Integration**     | (À venir) Connexion à Firebase/Node.js pour sauvegarder les réponses. | ⏳ En développement |

| **Feature**                 | **Description**                                         | **Status**     |
| --------------------------- | ------------------------------------------------------- | -------------- |
| **Multiple Question Types** | MCQ (radio), checkboxes, text input, scale (1-5).       | ✅ Implemented |
| **Synthwave Design**        | Neon colors, retro animations, dynamic background.      | ✅ Implemented |
| **Navigation**              | Previous/Next buttons, progress bar.                    | ✅ Implemented |
| **Validation**              | Cannot proceed without answering.                       | ✅ Implemented |
| **Modularity**              | Add/remove questions via `surveyConfig`.                | ✅ Implemented |
| **Alternative Themes**      | (Upcoming) Light/dark themes.                           | ⏳ In Progress |
| **Local Storage**           | (Upcoming) Save answers in `localStorage`.              | ⏳ In Progress |
| **Backend Integration**     | (Upcoming) Connect to Firebase/Node.js to save answers. | ⏳ In Progress |

---

## 🎨 **Personnalisation / Customization**

### Français

#### 1. **Ajouter une question**

Dans `js/survey.js`, modifie le tableau `surveyConfig.questions` :

{
id: 5, // ID unique
type: "TEXT", // Type de question (MULTIPLE_CHOICE, CHECKBOX, TEXT, SCALE)
text: "Ta question ici",
options: ["Option 1", "Option 2"] // Pour MULTIPLE_CHOICE ou CHECKBOX
min: 1, // Pour SCALE
max: 5 // Pour SCALE
}

#### 2. **Ajouter un type de question**

Dans `js/questionTypes.js`, ajoute une nouvelle entrée à `QuestionTypes` :

RATING: {
render: (questionData) => { /_ HTML _/ },
isAnswered: (questionId) => { /_ Logique de validation _/ },
getAnswer: (questionId) => { /_ Récupérer la réponse _/ }
}

#### 3. **Modifier le design**

- **Couleurs** : Modifie les variables dans `css/style.css` (ex: `#FF2CED`, `#05D9E8`).
- **Animations** : Ajoute des `@keyframes` ou utilise [Anime.js](https://animejs.com/).

#### 4. **Traduire l'interface**

- Modifie les textes dans `index.html` et `js/survey.js`.

---

### English

#### 1. **Add a Question**

In `js/survey.js`, edit the `surveyConfig.questions` array:

{
id: 5, // Unique ID
type: "TEXT", // Question type (MULTIPLE_CHOICE, CHECKBOX, TEXT, SCALE)
text: "Your question here",
options: ["Option 1", "Option 2"] // For MULTIPLE_CHOICE or CHECKBOX
min: 1, // For SCALE
max: 5 // For SCALE
}

#### 2. **Add a Question Type**

In `js/questionTypes.js`, add a new entry to `QuestionTypes`:

RATING: {
render: (questionData) => { /_ HTML _/ },
isAnswered: (questionId) => { /_ Validation logic _/ },
getAnswer: (questionId) => { /_ Get answer _/ }
}

#### 3. **Change the Design**

- **Colors**: Edit variables in `css/style.css` (e.g., `#FF2CED`, `#05D9E8`).
- **Animations**: Add `@keyframes` or use [Anime.js](https://animejs.com/).

#### 4. **Translate the UI**

- Edit texts in `index.html` and `js/survey.js`.

---

## 🤝 **Contribuer / Contributing**

### Français

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet.
2. Crée une **branche** pour ta fonctionnalité (`git checkout -b feature/ma-fonctionnalité`).
3. **Commit** tes changements (`git commit -m "Ajout de ma fonctionnalité"`).
4. **Push** vers la branche (`git push origin feature/ma-fonctionnalité`).
5. Ouvre une **Pull Request**.

**Règles** :

- Respecte le style de code existant.
- Ajoute des commentaires pour les parties complexes.
- Teste tes modifications avant de soumettre.

### English

Contributions are welcome! Here’s how to contribute:

1. **Fork** the project.
2. Create a **branch** for your feature (`git checkout -b feature/my-feature`).
3. **Commit** your changes (`git commit -m "Add my feature"`).
4. **Push** to the branch (`git push origin feature/my-feature`).
5. Open a **Pull Request**.

**Rules**:

- Follow the existing code style.
- Add comments for complex parts.
- Test your changes before submitting.

---

## 🙌 **Remerciements / Acknowledgments**

- **Inspiration** : Culture synthwave, design rétro, et outils comme [Anime.js](https://animejs.com/).
- **Polices** : [Orbitron](https://fonts.google.com/specimen/Orbitron) (Google Fonts).
- **Contributeurs** : Merci à tous ceux qui amélioreront ce projet !

---

## 📧 **Contact / Contact**

- **Auteur** : [Kévin Thouroude-Leroux]
- **Questions** : Ouvre une _issue_ ou contacte-moi directement !
- **Mail** : kev.tl63@gmail.com

---
