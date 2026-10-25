# Objectif B2 — Français par immersion pour la médecine

Site de préparation au **DELF B2** pour un élève anglophone du Québec (niveau A2 au départ) qui vise
l’admission à Marianopolis College puis le programme Med-P de McGill. Parcours de 27 semaines
(26 octobre 2026 → 1er mai 2027), fondé sur l’immersion : médecine, service client, bénévolat
hospitalier et code de la route.

Site publié : <https://ilanguage.github.io/objectif-b2/>

## Fonctionnalités

- **Tableau de bord** : semaine en cours, compte à rebours des examens, progression par module.
- **6 modules, 31 leçons** : grammaire (Module 0), médecine (1), crêperie (2), bénévolat au CUSM (3),
  SAAQ (4), avec quiz auto-corrigés (QCM, textes à trous, appariement), productions écrites et orales.
- **3 examens blancs DELF B2** complets (CO, CE, PE, PO), chronométrés, compréhensions corrigées
  automatiquement et ramenées sur 25, productions notées avec les grilles DELF.
- **Trois modes** : Élève, Professeur (grilles, notes pédagogiques, suivi, export/import de la
  progression) et TA Gemini (prompt prêt à copier pour chaque leçon, enrichi des questions manquées
  quand un quiz est sous 70 %).
- **Documents audio** lus par la synthèse vocale du navigateur (voix fr-CA si disponible).
- **Guides** : étudiant (applications Android, immersion), professeur, TA Gemini, oral B2 ; grilles
  DELF ; banques de vocabulaire ; syllabus semaine par semaine.
- **Accessibilité** : structure sémantique (titres, régions), navigation au clavier, appariement par
  listes déroulantes (pas de glisser-déposer), annonces de chronomètre limitées, police ≥ 16 px.

## Développement

Prérequis : Node 20+.

```bash
npm install
npm run dev       # http://localhost:5173/objectif-b2/
npm run lint      # ESLint (+ jsx-a11y) et TypeScript strict
npm run test      # Vitest
npm run build     # build de production dans dist/
```

## Déploiement

- `.github/workflows/ci.yml` : lint, tests et build sur chaque PR et sur `main`.
- `.github/workflows/deploy.yml` : build et déploiement sur GitHub Pages à chaque push sur `main`.
  Dans les réglages du dépôt, *Settings → Pages → Source* doit être **GitHub Actions**.

Le site utilise un `HashRouter` (`/#/lecon/1.2`) : GitHub Pages ne gère pas la réécriture d’URL des
applications monopages, et les liens profonds fonctionnent ainsi sans fichier `_redirects`.

## Monitoring (New Relic)

Coller le snippet du New Relic Browser Agent (SPA loader v1.324.0, compte 4464141, agent 1120304090)
**tel quel** à l’endroit indiqué dans le `<head>` de `index.html`. Il contient la clé de licence, qui
n’est pas versionnée ici. `src/lib/newrelic.ts` ajoute des événements métier (quiz terminé, épreuve
d’examen soumise, prompt copié) et ne fait rien si l’agent est absent.

## Structure

```
src/
├── components/   Dashboard, ModuleCard, LessonView, ExamView, ModeToggle, ProgressBar, Timer,
│                 AudioPlayer, ProgressOverview…
├── quiz/         QuizEngine, MultipleChoice, FillInBlank, Matching, WritingPrompt,
│                 SpeakingPrompt, GrilleForm, ScoreDisplay
├── modules/      m0-fondations … m5-delf-blanc : le contenu des leçons et des examens
├── ta-prompts/   general-system.md + un prompt Gemini par leçon ([module]-[leçon].md)
├── guides/       Guides étudiant, professeur, TA et oral
├── pages/        Syllabus, vocabulaire, grilles
├── data/         syllabus.ts, vocabulary.ts, grilles-delf.ts
└── lib/          progress.ts (localStorage), scoring.ts, exam.ts, newrelic.ts
```

## Modifier le contenu

- **Une leçon** : ajouter un objet `Lesson` dans `src/modules/<module>/index.ts` (voir `src/types.ts`)
  et son prompt `src/ta-prompts/<module>-<id>.md`. Le syllabus et les banques de vocabulaire se
  mettent à jour seuls.
- **Le calendrier** : `START_DATE`, `MILESTONES` et `PHASES` dans `src/data/syllabus.ts`.
- `src/data/content.test.ts` vérifie la cohérence du contenu (identifiants uniques, bonnes réponses
  valides, nombre de trous, prompt TA pour chaque leçon, grilles sur 25…).

Les textes d’écoute et de lecture sont des documents d’entraînement rédigés pour ce cours ; chaque
module renvoie vers les sources authentiques (Radio-Canada, SAAQ, CUSM, McGill). Les grilles DELF
reprennent celles de France Éducation international : vérifier la version la plus récente avant un
examen officiel.

## Progression et vie privée

La progression (quiz, brouillons, notes) est enregistrée uniquement dans le `localStorage` du
navigateur. En mode Professeur, la page *Suivi* permet de l’exporter en JSON et de l’importer sur un
autre appareil.

## Licence

Voir [LICENSE](LICENSE).
