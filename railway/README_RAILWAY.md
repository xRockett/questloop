
# QuestLoop — Railway 1‑Click

## Comment obtenir un bouton "Deploy on Railway" (le plus simple possible)
1. Crée un repo GitHub et **uploade ce dossier** (tous les fichiers).
2. Active le template Railway avec ce lien (remplace USER et REPO) :
   https://railway.app/new/template?template=https://github.com/USER/REPO/tree/main/railway

   > Astuce : ouvre le lien, Railway détecte `template.json` et lance le déploiement **en un clic**.

3. Dans l'écran Railway, valide et attends la fin du build.
4. Récupère les 2 URLs créées par Railway :
   - Web: `https://...railway.app`
   - API: `https://...railway.app`
5. Dans la page **Variables** de Railway :
   - Mets `API_HOST` = URL de l’API (sans slash)
   - Mets `WEB_HOST` = URL du site (sans slash)
   - Mets `JWT_SECRET` (dans service **api**) : une chaîne forte
   - (Optionnel) SMTP réel + R2 (S3) si tu veux l’upload d’images en prod

> Le compte **Admin** est auto-créé : `AdminMaster` / `SetAReallyStrongPassword123!`

### Connexion utilisateur
- Les joueurs peuvent se connecter **avec email *ou* nom d'utilisateur** + mot de passe.
