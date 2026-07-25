# Synth Survey

Un modèle de questionnaire synthwave bilingue, accessible et entièrement local.
A bilingual, accessible, and fully local synthwave survey template.

## Français

### Présentation

Synth Survey est un vrai parcours de questionnaire prêt à personnaliser, et non une simple succession de champs. Il accompagne la personne à travers six questions, conserve automatiquement son brouillon, permet une révision avant validation et produit un résumé accompagné d'une empreinte visuelle.

L'application ne possède ni serveur métier, ni compte, ni outil de suivi. Les réponses restent dans le navigateur pendant la saisie. La validation efface le brouillon et l'export JSON n'a lieu que lorsque la personne clique sur le bouton correspondant.

### Fonctionnalités

- six questions déclarées dans un fichier de configuration ;
- choix unique, choix multiples, texte libre et échelles numériques ;
- validation adaptée à chaque type de réponse ;
- réponses restaurées lors d'un retour à une question ;
- brouillon automatique avec `localStorage` ;
- écran de révision avant validation ;
- résumé final et export JSON structuré ;
- empreinte Canvas déterministe calculée localement ;
- interface française et anglaise persistante ;
- thèmes sombre et clair persistants ;
- navigation au clavier et contrôles HTML natifs ;
- mise en page responsive pour ordinateur, tablette et mobile ;
- aucun paquet, aucune police et aucune ressource distante.

### Démarrage

Prérequis : Node.js 18 ou une version plus récente.

```powershell
git clone https://github.com/SynthSpecter/survey-template.git
cd survey-template
npm start
```

Ouvrez ensuite [http://127.0.0.1:4177](http://127.0.0.1:4177). Le petit serveur local est nécessaire pour charger proprement les modules JavaScript. Il ne collecte aucune donnée.

### Vérification

```powershell
npm run check
```

La commande vérifie notamment la configuration, les règles de validation, la stabilité de l'empreinte, les traductions, les ressources locales, les commentaires bilingues et les en-têtes du serveur.

### Personnaliser le questionnaire

Le point d'entrée le plus important est `scripts/surveyConfig.js`. Chaque question possède un identifiant stable, un type et des clés de traduction. Pour changer un libellé, modifiez les valeurs française et anglaise correspondantes dans `scripts/translations.js`.

Exemple minimal de question à choix unique :

```js
{
  id: 'environment',
  type: 'SINGLE_CHOICE',
  shortKey: 'stepEnvironment',
  textKey: 'questionEnvironment',
  descriptionKey: 'questionEnvironmentDescription',
  required: true,
  options: [
    { value: 'web', labelKey: 'optionEnvironmentWeb', accent: 'cyan' },
    { value: 'desktop', labelKey: 'optionEnvironmentDesktop', accent: 'pink' }
  ]
}
```

Ajoutez ensuite chacune des nouvelles clés dans les objets `fr` et `en` de `scripts/translations.js`. Les types disponibles sont `SINGLE_CHOICE`, `CHECKBOX`, `TEXT` et `SCALE`.

Augmentez `version` dans `scripts/surveyConfig.js` lorsque la structure des réponses change. Cela empêche un ancien brouillon incompatible d'être restauré.

### Organisation des fichiers

| Fichier                    | Rôle                                                               |
| -------------------------- | ------------------------------------------------------------------ |
| `index.html`               | Structure sémantique, réglages globaux et dialogue de confirmation |
| `scripts/bootstrap.js`     | Application du thème et de la langue avant le premier affichage    |
| `scripts/surveyConfig.js`  | Contenu et règles du questionnaire                                 |
| `scripts/questionTypes.js` | Création, normalisation et validation des champs                   |
| `scripts/survey.js`        | Contrôleur de la session et navigation entre les écrans            |
| `scripts/ui.js`            | Rendu sécurisé avec l'API DOM                                      |
| `scripts/storage.js`       | Préférences et brouillon local                                     |
| `scripts/translations.js`  | Textes français et anglais                                         |
| `scripts/signalChart.js`   | Empreinte visuelle Canvas                                          |
| `styles/main.css`          | Fondations, thèmes et composants communs                           |
| `styles/survey.css`        | Parcours, questions, révision et résultat                          |
| `styles/effects.css`       | Transitions et mouvement réduit                                    |
| `server.js`                | Serveur statique local sans dépendance                             |
| `scripts/check.js`         | Vérifications automatisées                                         |

### Accessibilité et confidentialité

Les champs restent de vrais éléments `input` et `textarea`, même lorsque leur apparence est personnalisée. Les titres reçoivent le focus lors d'un changement d'étape, les erreurs sont annoncées, les boutons indisponibles sont désactivés et les animations respectent `prefers-reduced-motion`.

Le stockage local contient seulement les préférences et le brouillon courant. Aucun appel réseau applicatif n'est autorisé par la politique de sécurité du contenu. Ce projet est un modèle front-end : valider une réponse ne l'envoie pas à une base de données.

### Limites connues

- un effacement des données du navigateur supprime le brouillon ;
- l'export doit être conservé manuellement par la personne ;
- un stockage partagé ou des statistiques exigeraient un service backend et une politique de confidentialité adaptée ;
- les navigateurs doivent prendre en charge les modules ES, `dialog`, `ResizeObserver` et le sélecteur CSS `:has()`.

## English

### Overview

Synth Survey is a customizable survey journey, not merely a sequence of fields. It guides someone through six questions, automatically keeps a draft, offers a review before submission, and produces a summary with a visual fingerprint.

The application has no business server, account system, or tracker. Responses remain in the browser while the survey is in progress. Submission clears the draft, and JSON export happens only when the person selects the corresponding button.

### Features

- six questions declared in a configuration file;
- single choice, multiple choice, free text, and numeric scales;
- validation tailored to every response type;
- restored answers when returning to a question;
- automatic drafts using `localStorage`;
- a review screen before submission;
- a final summary and structured JSON export;
- a deterministic Canvas fingerprint calculated locally;
- persistent French and English interfaces;
- persistent dark and light themes;
- keyboard navigation and native HTML controls;
- responsive layouts for desktop, tablet, and mobile;
- no package, font, or remote runtime asset.

### Getting started

Requirement: Node.js 18 or newer.

```powershell
git clone https://github.com/SynthSpecter/survey-template.git
cd survey-template
npm start
```

Then open [http://127.0.0.1:4177](http://127.0.0.1:4177). The small local server is needed to load JavaScript modules correctly. It does not collect data.

### Verification

```powershell
npm run check
```

The command checks the configuration, validation rules, fingerprint stability, translations, local resources, bilingual comments, and server headers, among other safeguards.

### Customizing the survey

The most important entry point is `scripts/surveyConfig.js`. Every question has a stable identifier, a type, and translation keys. To change a label, edit the matching French and English values in `scripts/translations.js`.

Minimal single-choice question example:

```js
{
  id: 'environment',
  type: 'SINGLE_CHOICE',
  shortKey: 'stepEnvironment',
  textKey: 'questionEnvironment',
  descriptionKey: 'questionEnvironmentDescription',
  required: true,
  options: [
    { value: 'web', labelKey: 'optionEnvironmentWeb', accent: 'cyan' },
    { value: 'desktop', labelKey: 'optionEnvironmentDesktop', accent: 'pink' }
  ]
}
```

Then add every new key to both the `fr` and `en` objects in `scripts/i18n.js`. Available types are `SINGLE_CHOICE`, `CHECKBOX`, `TEXT`, and `SCALE`.

Increase `version` in `scripts/surveyConfig.js` whenever the response structure changes. This prevents an incompatible old draft from being restored.

### File map

| File                       | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `index.html`               | Semantic structure, global settings, and confirmation dialog |
| `scripts/bootstrap.js`     | Theme and language application before first paint            |
| `scripts/surveyConfig.js`  | Survey content and rules                                     |
| `scripts/questionTypes.js` | Field creation, normalization, and validation                |
| `scripts/survey.js`        | Session controller and screen navigation                     |
| `scripts/ui.js`            | Safe rendering with the DOM API                              |
| `scripts/storage.js`       | Preferences and local draft                                  |
| `scripts/translations.js`  | French and English copy                                      |
| `scripts/signalChart.js`   | Canvas visual fingerprint                                    |
| `styles/main.css`          | Foundations, themes, and shared components                   |
| `styles/survey.css`        | Journey, questions, review, and result                       |
| `styles/effects.css`       | Transitions and reduced motion                               |
| `server.js`                | Dependency-free local static server                          |
| `scripts/check.js`         | Automated checks                                             |

### Accessibility and privacy

Fields remain real `input` and `textarea` elements even when their appearance is customized. Headings receive focus after a step change, errors are announced, unavailable buttons are disabled, and animations honor `prefers-reduced-motion`.

Local storage contains only preferences and the current draft. The content security policy disallows application network calls. This project is a front-end template: submitting responses does not send them to a database.

### Known limitations

- clearing browser data removes the draft;
- the exported file must be kept manually by the person;
- shared storage or analytics would require a backend service and an appropriate privacy policy;
- browsers must support ES modules, `dialog`, `ResizeObserver`, and the CSS `:has()` selector.
