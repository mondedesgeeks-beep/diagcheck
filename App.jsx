import { useState, useMemo, useCallback, memo } from "react";

const CURRENT_YEAR = 2026;
const BLUE = "#1B3A8C";
const GREEN = "#6AB023";
const BLUE_LIGHT = "#EEF2FB";
const GREEN_LIGHT = "#F0F8E8";
const MON_EMAIL = "contact.ain@ac-environnement.com";

const AGENCES = {
  "AIN0000": { nom: "", email: "" },
  "AG8437": { nom: "", email: "" }, "AH4828": { nom: "", email: "" },
  "AJ3597": { nom: "", email: "" }, "AR9687": { nom: "", email: "" },
  "AU9426": { nom: "", email: "" }, "AU9828": { nom: "", email: "" },
  "BA9954": { nom: "", email: "" }, "BC2948": { nom: "", email: "" },
  "BC7242": { nom: "", email: "" }, "BG6977": { nom: "", email: "" },
  "BN2332": { nom: "", email: "" }, "BN8566": { nom: "", email: "" },
  "BW3893": { nom: "", email: "" }, "BW6578": { nom: "", email: "" },
  "BX9555": { nom: "", email: "" }, "CC4638": { nom: "", email: "" },
  "CE6353": { nom: "", email: "" }, "CF6386": { nom: "", email: "" },
  "CF6734": { nom: "", email: "" }, "CJ5669": { nom: "", email: "" },
  "CV9427": { nom: "", email: "" }, "EG6944": { nom: "", email: "" },
  "EM5438": { nom: "", email: "" }, "EQ2593": { nom: "", email: "" },
  "ER3543": { nom: "", email: "" }, "ER4335": { nom: "", email: "" },
  "ER7994": { nom: "", email: "" }, "EZ9482": { nom: "", email: "" },
  "FC8695": { nom: "", email: "" }, "FF5428": { nom: "", email: "" },
  "FZ2738": { nom: "", email: "" }, "GB5382": { nom: "", email: "" },
  "GB9487": { nom: "", email: "" }, "GC2853": { nom: "", email: "" },
  "GG4996": { nom: "", email: "" }, "GP4634": { nom: "", email: "" },
  "GT7294": { nom: "", email: "" }, "GV6898": { nom: "", email: "" },
  "GZ3663": { nom: "", email: "" }, "HJ9774": { nom: "", email: "" },
  "HT4982": { nom: "", email: "" }, "JB4398": { nom: "", email: "" },
  "JD5243": { nom: "", email: "" }, "JY2442": { nom: "", email: "" },
  "KA4479": { nom: "", email: "" }, "KM9334": { nom: "", email: "" },
  "KS9557": { nom: "", email: "" }, "KU8438": { nom: "", email: "" },
  "KY4962": { nom: "", email: "" }, "ME5297": { nom: "", email: "" },
  "MM7476": { nom: "", email: "" }, "MQ5538": { nom: "", email: "" },
  "MZ3662": { nom: "", email: "" }, "NA7272": { nom: "", email: "" },
  "NB5587": { nom: "", email: "" }, "NG7927": { nom: "", email: "" },
  "NM6982": { nom: "", email: "" }, "NP3494": { nom: "", email: "" },
  "NZ7885": { nom: "", email: "" }, "PA8627": { nom: "", email: "" },
  "PP2387": { nom: "", email: "" }, "PV6885": { nom: "", email: "" },
  "QS7633": { nom: "", email: "" }, "QT2238": { nom: "", email: "" },
  "QZ3486": { nom: "", email: "" }, "RB2784": { nom: "", email: "" },
  "RB9387": { nom: "", email: "" }, "RE4867": { nom: "", email: "" },
  "RH3529": { nom: "", email: "" }, "RM2986": { nom: "", email: "" },
  "RN4444": { nom: "", email: "" }, "RR9543": { nom: "", email: "" },
  "RV2692": { nom: "", email: "" }, "SA7243": { nom: "", email: "" },
  "SB4724": { nom: "", email: "" }, "SR9584": { nom: "", email: "" },
  "TK9293": { nom: "", email: "" }, "TV5885": { nom: "", email: "" },
  "UC4547": { nom: "", email: "" }, "US2765": { nom: "", email: "" },
  "VF4529": { nom: "", email: "" }, "VU9532": { nom: "", email: "" },
  "VV6792": { nom: "", email: "" }, "VY7865": { nom: "", email: "" },
  "WM3697": { nom: "", email: "" }, "WQ2878": { nom: "", email: "" },
  "WV4257": { nom: "", email: "" }, "WW7822": { nom: "", email: "" },
  "WX7955": { nom: "", email: "" }, "XJ3222": { nom: "", email: "" },
  "XP9362": { nom: "", email: "" }, "XV4368": { nom: "", email: "" },
  "XV6554": { nom: "", email: "" }, "XY4938": { nom: "", email: "" },
  "YK6988": { nom: "", email: "" }, "YT6946": { nom: "", email: "" },
  "YV7398": { nom: "", email: "" }, "ZK6969": { nom: "", email: "" },
  "ZT3688": { nom: "", email: "" }, "ZV3424": { nom: "", email: "" },
};

function isExpired(dateStr, months) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const expiry = new Date(d);
  expiry.setMonth(expiry.getMonth() + months);
  const now = new Date();
  const diffDays = Math.round((expiry - now) / (1000 * 3600 * 24));
  return { expired: diffDays < 0, days: Math.abs(diffDays) };
}

function anneeVal(a) {
  const map = { avant1948: 1920, de1948a1996: 1975, de1997a2009: 2003, apres2010: 2015 };
  return map[a] || parseInt(a) || 0;
}

function getElecAge(a) {
  if (a.elec_ancienne === "non") return "neuf";
  if (a.elec_ancienne === "sais_pas") return "sais_pas";
  if (a.elec_ancienne === "oui") {
    if (a.elec_renove === "non") return "vieux";
    if (a.elec_renove === "oui") return a.elec_consuel === "oui" ? "renove_consuel" : "renove_sans";
  }
  return "sais_pas";
}

const ANNEE_LABEL = { avant1948: "Avant 1948", de1948a1996: "1948 à 1996", de1997a2009: "1997 à 2009", apres2010: "Après 2010" };
const TYPE_LABEL = { maison: "Maison", copro: "Appartement", immeuble: "Immeuble", local: "Local commercial", lots_immeuble: "Vente de lots" };
const TRANS_LABEL = { vente: "Vente", location: "Location" };

function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validateTel(t) { return /^[\d\s.+()-]{8,}$/.test(t); }

/* ================================================================
   MOTEUR DIAGNOSTICS — PARTICULIER
   ================================================================ */
function computeDiagsParticulier(a) {
  const diags = [];
  const type = a.type;
  const isCollectif = type === "copro" || type === "immeuble";
  const isMonopro = type === "immeuble";
  const isMixte = isMonopro && a.locaux_pro === true;
  const isCopro = type === "copro";
  const isLocal = type === "local";
  const isMaison = type === "maison";
  const isVente = a.transaction === "vente";
  const isLocation = a.transaction === "location";
  const annee = anneeVal(a.annee);
  const elecAge = a.elec_age || getElecAge(a);
  const nbLots = parseInt(a.nb_lots) || 0;
  const nbLocaux = parseInt(a.nb_locaux) || 0;
  const gazDiag = a.annee_gaz === "gaz_moyen" || a.annee_gaz === "gaz_vieux";
  function lotScope(prefix) { return nbLots > 0 ? prefix + " (" + nbLots + " lots)" : prefix; }

  if (isLocal) {
    diags.push({ id: "DPE_PRO", label: "DPE", full: "DPE — Local professionnel", icon: "⚡", color: GREEN, scope: "Local", duree_mois: 120, duree_label: "10 ans — date du diag (règle habitation ne s'applique pas)", alerte: "Pas de caducité juillet 2021 pour les locaux pro — validité = date du diag + 10 ans", desc: "La réforme juillet 2021 concerne UNIQUEMENT les biens à usage d'habitation. Un DPE local pro de 2017 est valable jusqu'en 2027." });
    diags.push({ id: "ERP", label: "ERP", full: "État des Risques et Pollutions", icon: "🌊", color: BLUE, scope: "Local", duree_mois: 6, duree_label: "6 mois", alerte: "À fournir dès la 1ère visite", desc: "Obligatoire vente ET location. 6 mois." });
    if (annee < 1997) diags.push({ id: "DTA", label: "Amiante — DTA", full: "Dossier Technique Amiante", icon: "🧱", color: "#ef4444", scope: "Local", duree_mois: null, duree_label: "Dossier vivant", duree_detail: [{ cas: "Avant avril 2013 non mis à jour", val: "CADUC" }, { cas: "Présence liste A", val: "3 ans" }, { cas: "Présence liste B", val: "Illimité" }, { cas: "Absence", val: "Illimité" }], desc: "PC avant juillet 1997 = obligatoire." });
    diags.push({ id: "TERMITES", label: "Termites", full: "État relatif à la présence de termites", icon: "🐛", color: "#84cc16", scope: "Local", duree_mois: a.zone_termites === true ? 6 : null, duree_label: "6 mois si zone", obligatoire: a.zone_termites === true, incertain: a.zone_termites === "sais_pas", desc: a.zone_termites === true ? "Zone à risque — 6 mois." : "Vérifiez en mairie." });
    if (isVente) diags.push({ id: "CARREZ", label: "Loi Carrez", full: "Mesurage Loi Carrez", icon: "📐", color: BLUE, scope: "Local", duree_mois: null, duree_label: "Illimité sauf travaux", alerte: "Engagement 1 an", desc: "Vente uniquement." });
    if (isLocation) diags.push({ id: "BOUTIN", label: "Loi Boutin", full: "Mesurage surface", icon: "📏", color: BLUE, scope: "Local", duree_mois: null, duree_label: "Illimité sauf travaux", desc: "Location uniquement." });
    return diags;
  }

  if (isMonopro) {
    diags.push({ id: "DPE_COLLECTIF", label: "DPE Collectif", full: "Diagnostic de Performance Énergétique collectif", icon: "⚡", color: GREEN, scope: isMixte ? lotScope("Partie habitation") : "Parties communes", duree_mois: 120, duree_label: "10 ans", caducite: "Avant le 1er juillet 2021 = caduc", desc: "Obligatoire pour tout immeuble en monopropriété depuis jan. 2024." });
  } else {
    diags.push({ id: "DPE", label: "DPE", full: "Diagnostic de Performance Énergétique", icon: "⚡", color: GREEN, scope: "Logement", duree_mois: 120, duree_label: "10 ans", caducite: "Avant le 1er juillet 2021 = caduc", desc: "Obligatoire pour toute vente ou location. Méthode 3CL-DPE depuis juillet 2021. Avant cette date = caduc." });
  }

  if (isVente && (isMaison || isMonopro)) {
    diags.push({ id: "AUDIT", label: "Audit Énergétique", full: "Audit Énergétique Réglementaire", icon: "📋", color: "#f59e0b", scope: isMaison ? "Logement" : lotScope("Partie habitation"), duree_mois: 60, duree_label: "5 ans", alerte: "À remettre dès la 1ère visite — pas au compromis !", conditionnel: "Obligatoire si DPE classe E, F ou G", desc: "F/G depuis 2023, E depuis jan. 2025. Maison individuelle et immeuble monopropriété uniquement." });
  }

  if (isMixte) {
    diags.push({ id: "DPE_PRO", label: "DPE Local pro", full: "DPE — Local(aux) professionnel(s)", icon: "⚡", color: "#06b6d4", scope: nbLocaux + " local" + (nbLocaux > 1 ? "aux" : "") + " pro", duree_mois: 120, duree_label: "10 ans — date du diag (pas de règle juillet 2021)", alerte: "Réforme juillet 2021 = habitation uniquement. DPE local pro de 2017 valable jusqu'en 2027.", desc: "DPE séparé par local pro. 10 ans glissants à compter de la date du diag." });
  }

  if (annee < 1997) {
    if (isVente) {
      diags.push({ id: "AMIANTE_CAV", label: "Amiante — CAV", full: "Constat Amiante Vente (listes A + B)", icon: "🧱", color: "#ef4444", scope: isCollectif ? lotScope("Parties privatives") : "Logement", duree_mois: null, duree_label: "Voir résultat", duree_detail: [{ cas: "Réalisé avant le 1er avril 2013", val: "CADUC" }, { cas: "Présence liste A — Flocages, calorifugeages, faux plafonds", val: "3 ans" }, { cas: "Présence liste B — Fibres-ciment, dalles, shingles, bardages…", val: "Illimité" }, { cas: "Absence d'amiante", val: "Illimité" }], granges: a.granges, desc: "PC avant juillet 1997 = obligatoire. Listes A + B." });
      if (isCollectif) diags.push({ id: "DTA", label: "Amiante — DTA", full: "Dossier Technique Amiante parties communes", icon: "🧱", color: "#dc2626", scope: isMixte ? "Parties communes (hab. + locaux pro)" : "Parties communes", duree_mois: null, duree_label: "Dossier vivant", duree_detail: [{ cas: "Avant le 1er avril 2013 non mis à jour", val: "CADUC" }, { cas: "Présence liste A", val: "3 ans" }, { cas: "Présence liste B", val: "Illimité" }, { cas: "Absence", val: "Illimité" }], desc: "Parties communes de l'immeuble entier." });
      if (isMixte) diags.push({ id: "DTA_PRO", label: "Amiante — DTA Local pro", full: "Dossier Technique Amiante locaux professionnels", icon: "🧱", color: "#b91c1c", scope: nbLocaux + " local" + (nbLocaux > 1 ? "aux" : "") + " pro", duree_mois: null, duree_label: "Dossier vivant", duree_detail: [{ cas: "Avant le 1er avril 2013", val: "CADUC" }, { cas: "Présence liste A", val: "3 ans" }, { cas: "Présence liste B", val: "Illimité" }, { cas: "Absence", val: "Illimité" }], desc: "DTA spécifique pour les locaux pro — distinct du DTA parties communes." });
    }
    if (isLocation && isCollectif) diags.push({ id: "DAPP", label: "Amiante — DAPP", full: "Dossier Amiante Parties Privatives (liste A)", icon: "🧱", color: "#f87171", scope: lotScope("Logements"), duree_mois: null, duree_label: "Voir résultat", alerte: "UNIQUEMENT logement en immeuble collectif (copro ou monopropriété) — jamais maison individuelle ni local pro", duree_detail: [{ cas: "Avant le 1er avril 2013", val: "CADUC" }, { cas: "Présence liste A", val: "3 ans" }, { cas: "Absence liste A", val: "Illimité" }], desc: "Liste A uniquement. Obligatoire pour tout logement situé dans un immeuble collectif, qu'il soit en copropriété ou en monopropriété. Maison individuelle en location → pas de DAPP." });
  }

  if (annee < 1949) {
    diags.push({ id: "CREP_PRIVE", label: "CREP — Partie privative", full: "Constat de Risque d'Exposition au Plomb", icon: "🔩", color: "#8b5cf6", scope: isCollectif ? lotScope("Chaque logement") : "Logement", duree_mois: null, duree_label: "Voir résultat", duree_detail: isVente ? [{ cas: "Avant 27/04/2006 — ERAP, technologie obsolète", val: "CADUC" }, { cas: "Positif (vente)", val: "1 an" }, { cas: "Négatif (vente)", val: "Illimité" }] : [{ cas: "Avant 27/04/2006 — ERAP, technologie obsolète", val: "CADUC" }, { cas: "Positif (location)", val: "6 ans" }, { cas: "Négatif (location)", val: "Illimité" }], desc: "Construit avant 1949 = obligatoire. Parties habitables où un enfant de -6 ans peut être laissé seul. Pas de CREP pour les locaux pro." });
    if (isMonopro && isVente) diags.push({ id: "CREP_COMMUN", label: "CREP — Parties communes", full: "Constat Plomb parties communes", icon: "🔩", color: "#7c3aed", scope: "Parties communes", duree_mois: null, duree_label: "Illimité — quelle que soit la conclusion", duree_detail: [{ cas: "Toujours — positif ou négatif", val: "Illimité" }], desc: "CREP parties communes = toujours illimité, positif ou négatif." });
  }

  if (elecAge === "vieux" || elecAge === "renove_sans" || elecAge === "sais_pas") {
    diags.push({ id: "ELEC", label: "Électricité", full: "État de l'installation intérieure d'électricité", icon: "💡", color: "#eab308", scope: isCollectif ? lotScope("Chaque logement") : "Logement", duree_mois: 36, duree_label: "3 ans — anomalies ou non", alerte: elecAge === "sais_pas" ? "Situation inconnue → diagnostic préventif recommandé" : "Dispense possible avec attestation Consuel", desc: "Installation >15 ans non rénovée = obligatoire. Habitation uniquement. Norme NF C16-600." });
  }

  if (a.gaz === true && gazDiag) {
    diags.push({ id: "GAZ", label: "Gaz", full: "État de l'installation intérieure de gaz", icon: "🔥", color: "#f97316", scope: isCollectif ? lotScope("Chaque logement avec gaz") : "Logement", duree_mois: 36, duree_label: "3 ans — anomalies ou non", alerte: "Obligatoire même si le gaz est coupé — canalisation fixe = diagnostic obligatoire", desc: "Canalisation fixe uniquement — pas bonbonne. Habitation uniquement. Le technicien a le droit de couper l'installation." });
  }

  diags.push({ id: "TERMITES", label: "Termites", full: "État relatif à la présence de termites", icon: "🐛", color: "#84cc16", scope: "Bien complet", duree_mois: a.zone_termites === true ? 6 : null, duree_label: a.zone_termites === true ? "6 mois" : "6 mois si zone", obligatoire: a.zone_termites === true, incertain: a.zone_termites === "sais_pas", desc: a.zone_termites === true ? "Zone à risque — diag obligatoire. 6 mois." : a.zone_termites === "sais_pas" ? "Vérifiez en mairie — zones définies par arrêté préfectoral." : "Pas en zone à risque." });

  diags.push({ id: "ERP", label: "ERP", full: "État des Risques et Pollutions", icon: "🌊", color: BLUE, scope: "Bien complet", duree_mois: 6, duree_label: "6 mois", alerte: "À fournir dès la 1ère visite depuis jan. 2023", desc: "Obligatoire partout, toujours. 6 mois — souvent expiré à la signature." });

  if (isCopro && isVente) diags.push({ id: "CARREZ", label: "Loi Carrez", full: "Mesurage Loi Carrez", icon: "📐", color: BLUE, scope: "Lot privatif", duree_mois: null, duree_label: "Illimité sauf travaux", alerte: "Engagement 1 an — écart >5% = réduction du prix", desc: "Copropriété en vente uniquement." });
  if (isLocation && !a.meuble && type !== "local") diags.push({ id: "BOUTIN", label: "Loi Boutin", full: "Mesurage surface habitable", icon: "📏", color: BLUE, scope: "Logement", duree_mois: null, duree_label: "Illimité sauf travaux", desc: "Location vide uniquement — pas le meublé. La loi Boutin protège le locataire qui s'installe durablement. En meublé, la surface doit figurer au bail mais sans certification obligatoire." });

  return diags;
}

/* ================================================================
   MOTEUR DIAGNOSTICS — VENTE LOTS IMMEUBLE MONO
   ================================================================ */
function computeDiagsLotsImmeuble(a) {
  const obligatoires = [];
  const optionsNotaire = [];
  const annee = anneeVal(a.annee);
  const elecAge = a.elec_age || getElecAge(a);
  const gazDiag = a.annee_gaz === "gaz_moyen" || a.annee_gaz === "gaz_vieux";
  const nbLots = parseInt(a.nb_lots_vendus) || 1;
  const s = nbLots > 1 ? "s" : "";
  const usage = a.usage_immeuble || "habitation";
  const isTertiaire = usage === "tertiaire";
  const isMixte = usage === "mixte";

  // DTG — obligatoire si mise en copro d'un immeuble >10 ans
  // SAUF immeuble 100% tertiaire (pas d'habitation = pas de DTG)
  if (CURRENT_YEAR - annee >= 10 && !isTertiaire) {
    obligatoires.push({ id: "DTG", label: "DTG", full: "Diagnostic Technique Global", icon: "📊", color: "#475569", scope: "Immeuble entier", duree_mois: null, duree_label: "Pas de durée légale — ~10 ans", alerte: "Obligatoire car mise en copropriété d'un immeuble de plus de 10 ans", desc: "Le DTG est réalisé par le diagnostiqueur, après l'EDD du géomètre. Il évalue l'état technique global du bâtiment et recense les travaux à prévoir." });
  }
  if (CURRENT_YEAR - annee >= 10 && isTertiaire) {
    obligatoires.push({ id: "DTG_EXEMPT", label: "DTG — Exempté", full: "Diagnostic Technique Global", icon: "📊", color: "#94a3b8", scope: "Immeuble entier", duree_mois: null, duree_label: "Non requis", desc: "L'immeuble est à usage exclusivement tertiaire (bureaux, commerces) — le DTG n'est pas obligatoire. L'exemption s'applique car il ne comporte aucun lot à usage d'habitation.", alerte: "Immeuble 100% tertiaire = exemption de DTG" });
  }

  // DPE — tertiaire = DPE local pro par lot, habitation = DPE individuel par lot
  if (isTertiaire) {
    obligatoires.push({ id: "DPE_PRO", label: "DPE Local pro", full: "DPE — par lot vendu (usage professionnel)", icon: "⚡", color: "#06b6d4", scope: nbLots + " lot" + s + " vendu" + s, duree_mois: 120, duree_label: "10 ans — date du diag (pas de règle juillet 2021)", alerte: "Immeuble tertiaire : DPE local pro, pas DPE habitation. Validité = date du diag + 10 ans.", desc: "Un DPE par lot vendu. La réforme juillet 2021 (caducité) ne s'applique pas aux locaux professionnels." });
  } else if (isMixte) {
    obligatoires.push({ id: "DPE", label: "DPE individuel (lots habitation)", full: "DPE — lots habitation vendus", icon: "⚡", color: GREEN, scope: "Lots habitation vendus", duree_mois: 120, duree_label: "10 ans", caducite: "Avant le 1er juillet 2021 = caduc", desc: "Un DPE individuel par lot habitation mis en vente." });
    obligatoires.push({ id: "DPE_PRO", label: "DPE Local pro (lots tertiaires)", full: "DPE — lots professionnels vendus", icon: "⚡", color: "#06b6d4", scope: "Lots professionnels vendus", duree_mois: 120, duree_label: "10 ans — date du diag", alerte: "Les lots pro suivent la règle local professionnel : validité = date du diag + 10 ans, pas de caducité juillet 2021.", desc: "DPE séparé pour chaque lot à usage professionnel." });
  } else {
    obligatoires.push({ id: "DPE", label: "DPE individuel", full: "DPE — par lot vendu", icon: "⚡", color: GREEN, scope: nbLots + " lot" + s + " vendu" + s, duree_mois: 120, duree_label: "10 ans", caducite: "Avant le 1er juillet 2021 = caduc", desc: "Un DPE individuel par lot mis en vente — pas de DPE collectif à ce stade." });
  }

  // AMIANTE — s'applique quel que soit l'usage
  if (annee < 1997) {
    obligatoires.push({ id: "AMIANTE_CAV", label: "Amiante — CAV", full: "Constat Amiante Vente (listes A + B)", icon: "🧱", color: "#ef4444", scope: nbLots + " lot" + s + " vendu" + s, duree_mois: null, duree_label: "Voir résultat", duree_detail: [{ cas: "Avant le 1er avril 2013", val: "CADUC" }, { cas: "Présence liste A", val: "3 ans" }, { cas: "Présence liste B", val: "Illimité" }, { cas: "Absence", val: "Illimité" }], desc: "PC avant juillet 1997 = obligatoire. Un CAV par lot vendu." });
  }

  // CREP — habitation uniquement, pas les locaux pro
  if (annee < 1949 && !isTertiaire) {
    obligatoires.push({ id: "CREP_PRIVE", label: "CREP — Lot privatif", full: "Constat de Risque d'Exposition au Plomb", icon: "🔩", color: "#8b5cf6", scope: isMixte ? "Lots habitation vendus" : nbLots + " lot" + s + " vendu" + s, duree_mois: null, duree_label: "Voir résultat", duree_detail: [{ cas: "Avant 27/04/2006 — ERAP, obsolète", val: "CADUC" }, { cas: "Positif (vente)", val: "1 an" }, { cas: "Négatif (vente)", val: "Illimité" }], desc: "Un CREP par lot habitation vendu. Pas de CREP pour les locaux professionnels." });
  }

  // ÉLECTRICITÉ — habitation uniquement
  if (!isTertiaire && (elecAge === "vieux" || elecAge === "renove_sans" || elecAge === "sais_pas")) {
    obligatoires.push({ id: "ELEC", label: "Électricité", full: "État de l'installation intérieure d'électricité", icon: "💡", color: "#eab308", scope: isMixte ? "Lots habitation" : nbLots + " lot" + s, duree_mois: 36, duree_label: "3 ans", desc: "Installation >15 ans non rénovée = obligatoire par lot habitation." });
  }

  // GAZ — habitation uniquement
  if (!isTertiaire && a.gaz === true && gazDiag) {
    obligatoires.push({ id: "GAZ", label: "Gaz", full: "État de l'installation intérieure de gaz", icon: "🔥", color: "#f97316", scope: "Lots habitation avec installation fixe", duree_mois: 36, duree_label: "3 ans", alerte: "Obligatoire même si le gaz est coupé", desc: "Canalisation fixe uniquement. Par lot habitation concerné." });
  }

  // TERMITES — s'applique quel que soit l'usage
  obligatoires.push({ id: "TERMITES", label: "Termites", full: "État relatif à la présence de termites", icon: "🐛", color: "#84cc16", scope: "Immeuble", duree_mois: a.zone_termites === true ? 6 : null, duree_label: "6 mois si zone", obligatoire: a.zone_termites === true, incertain: a.zone_termites === "sais_pas", desc: a.zone_termites === true ? "Zone à risque — 6 mois." : "Vérifiez en mairie." });

  // ERP — s'applique quel que soit l'usage
  obligatoires.push({ id: "ERP", label: "ERP", full: "État des Risques et Pollutions", icon: "🌊", color: BLUE, scope: "Bien complet", duree_mois: 6, duree_label: "6 mois", alerte: "À fournir dès la 1ère visite", desc: "Obligatoire toujours. 6 mois." });

  // OPTIONS NOTAIRE
  if (annee < 1997) optionsNotaire.push({ id: "DTA_OPT", label: "Amiante — DTA parties communes", full: "Dossier Technique Amiante — parties communes", icon: "🧱", color: "#dc2626", scope: "Parties communes", duree_mois: null, duree_label: "Dossier vivant", duree_detail: [{ cas: "Avant le 1er avril 2013", val: "CADUC" }, { cas: "Présence liste A", val: "3 ans" }, { cas: "Présence liste B", val: "Illimité" }, { cas: "Absence", val: "Illimité" }], desc: "Souvent exigé par le notaire lors d'une mise en copropriété." });
  if (annee < 1949 && !isTertiaire) optionsNotaire.push({ id: "CREP_COMMUN_OPT", label: "CREP — Parties communes", full: "Constat Plomb parties communes", icon: "🔩", color: "#7c3aed", scope: "Parties communes", duree_mois: null, duree_label: "Illimité — quelle que soit la conclusion", duree_detail: [{ cas: "Toujours", val: "Illimité" }], desc: "Parfois demandé par le notaire. CREP parties communes = toujours illimité." });
  if (!isTertiaire) optionsNotaire.push({ id: "DPE_CO_OPT", label: "DPE Collectif", full: "Diagnostic de Performance Énergétique collectif", icon: "⚡", color: "#06b6d4", scope: "Immeuble entier", duree_mois: 120, duree_label: "10 ans", caducite: "Avant le 1er juillet 2021 = caduc", desc: "Pas obligatoire à ce stade mais certains notaires l'exigent." });

  return { obligatoires, optionsNotaire };
}

/* ================================================================
   MOTEUR DIAGNOSTICS — SYNDIC
   ================================================================ */
function computeDiagsSyndic(a) {
  const diags = [];
  const annee = anneeVal(a.annee);
  const age = CURRENT_YEAR - annee;
  const nbLots = parseInt(a.nb_lots) || 0;

  if (annee < 2013) {
    var cal = nbLots > 200 ? "Obligatoire depuis jan. 2024" : nbLots > 50 ? "Obligatoire depuis jan. 2025" : "Obligatoire depuis jan. 2026";
    diags.push({ id: "DPE_CO", label: "DPE Collectif", full: "DPE collectif — parties habitation", icon: "⚡", color: GREEN, scope: "Parties communes", duree_mois: 120, duree_label: "10 ans", alerte: cal, caducite: "Avant le 1er juillet 2021 = caduc", desc: "Base de tout — le PPT doit s'appuyer dessus. Avant juillet 2021 = caduc.", manquant: !a.dpe_co_fait });
  } else {
    // Bâtiments 2013+ : DPE collectif obligatoire aussi, DPE neuf fourni à la construction
    diags.push({ id: "DPE_CO", label: "DPE Collectif", full: "DPE collectif — parties habitation", icon: "⚡", color: GREEN, scope: "Parties communes", duree_mois: 120, duree_label: "10 ans", desc: "Bâtiment récent — un DPE a normalement été fourni à la livraison. Vérifiez sa validité (10 ans).", manquant: !a.dpe_co_fait });
  }
  if (a.dpe_co_fait && ["E", "F", "G"].includes(a.dpe_etiquette)) {
    diags.push({ id: "AUDIT_CO", label: "Audit Énergétique", full: "Audit énergétique — immeuble collectif", icon: "📋", color: "#f59e0b", scope: "Immeuble", duree_mois: 60, duree_label: "5 ans", alerte: "DPE classé " + (a.dpe_etiquette === "F" ? "F ou G" : a.dpe_etiquette) + " → audit obligatoire en vente", conditionnel: "Vente uniquement", desc: "Obligatoire pour immeubles classés E, F ou G en vente." });
  }
  if (age >= 15) {
    diags.push({ id: "PPT", label: "PPT / PPPT", full: "Plan Pluriannuel de Travaux", icon: "🏗️", color: "#64748b", scope: "Copropriété", duree_mois: 120, duree_label: "10 ans", alerte: "Certains notaires bloquent les ventes des lots sans ce document !", desc: "Obligatoire toutes copros >15 ans. S'appuie sur le DPE collectif.", manquant: !a.ppt_fait });
  }
  if (annee < 1997) {
    var dtaManquant = !a.dta_fait || a.dta_fait === "non";
    var dtaCaduc = a.dta_fait === "vieux";
    diags.push({ id: "DTA", label: "Amiante — DTA", full: "Dossier Technique Amiante parties communes", icon: "🧱", color: "#ef4444", scope: "Parties communes", duree_mois: null, duree_label: "Dossier vivant — pas de durée fixe", duree_detail: [{ cas: "Réalisé avant janvier 2013 non mis à jour", val: "CADUC" }, { cas: "Non mis à jour avant février 2021", val: "CADUC" }, { cas: "Mis à jour après février 2021", val: "Valable — à actualiser après travaux" }, { cas: "Présence liste A → évaluation périodique", val: "Tous les 3 ans" }], alerte: dtaCaduc ? "⚠️ DTA caduc — tous les DTA antérieurs à janvier 2013 devaient être mis à jour avant le 1er février 2021" : dtaManquant ? "❌ Aucun DTA — obligation légale depuis 2002 pour tout immeuble PC < 1997" : undefined, desc: "Le DTA est un dossier vivant — à tenir à jour après chaque travaux. Depuis 2025, mise à jour tous les 3 ans obligatoire même sans travaux.", manquant: dtaManquant || dtaCaduc });
  }
  if (annee < 1949) {
    diags.push({ id: "CREP_COMMUN", label: "CREP — Parties communes", full: "Constat Plomb parties communes", icon: "🔩", color: "#8b5cf6", scope: "Parties communes", duree_mois: null, duree_label: "Illimité — quelle que soit la conclusion", duree_detail: [{ cas: "Toujours — positif ou négatif", val: "Illimité" }], desc: "CREP parties communes = toujours illimité.", manquant: !a.crep_co_fait });
  }
  return diags;
}

/* ================================================================
   ILLUSTRATIONS SVG
   ================================================================ */
const SvgAncien = memo(function SvgAncien() {
  return (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"95px",display:"block"}}>
      <rect width="200" height="110" fill="#F5F0E8"/><rect width="200" height="55" fill="#D4E8F5"/>
      <ellipse cx="150" cy="18" rx="18" ry="8" fill="white" opacity="0.8"/>
      <rect y="85" width="200" height="25" fill="#8B7355"/><rect y="82" width="200" height="6" fill="#C4B5A0"/>
      <rect x="30" y="30" width="140" height="58" fill="#E8DDD0"/>
      <polygon points="25,32 100,8 175,32" fill="#6B5B45"/><polygon points="30,32 100,12 170,32" fill="#7D6B55"/>
      <rect x="70" y="14" width="14" height="12" fill="#A8C4D8" stroke="#6B5B45" strokeWidth="1"/>
      <polygon points="68,14 77,8 86,14" fill="#6B5B45"/>
      <rect x="116" y="14" width="14" height="12" fill="#A8C4D8" stroke="#6B5B45" strokeWidth="1"/>
      <polygon points="114,14 123,8 132,14" fill="#6B5B45"/>
      <rect x="45" y="42" width="20" height="24" rx="10" fill="#A8C4D8" stroke="#8B7355" strokeWidth="1.5"/>
      <rect x="90" y="42" width="20" height="24" rx="10" fill="#A8C4D8" stroke="#8B7355" strokeWidth="1.5"/>
      <rect x="135" y="42" width="20" height="24" rx="10" fill="#A8C4D8" stroke="#8B7355" strokeWidth="1.5"/>
      <rect x="88" y="65" width="24" height="23" rx="12" fill="#6B5B45"/>
      <rect x="30" y="66" width="140" height="3" fill="#C4B5A0"/>
    </svg>
  );
});

const SvgPavillon = memo(function SvgPavillon() {
  return (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"95px",display:"block"}}>
      <rect width="200" height="110" fill="#E8F4E8"/><rect width="200" height="55" fill="#C8DFF0"/>
      <rect y="80" width="200" height="30" fill="#7DB87D"/>
      <rect x="25" y="45" width="120" height="40" fill="#E8E0D8"/>
      <polygon points="15,47 85,18 155,47" fill="#C0522A"/>
      <rect x="110" y="20" width="12" height="18" fill="#8B6B55"/>
      <rect x="145" y="55" width="40" height="30" fill="#D8D0C8"/>
      <rect x="148" y="58" width="34" height="24" rx="2" fill="#B8B0A8" stroke="#A8A09A" strokeWidth="1"/>
      <rect x="35" y="52" width="22" height="18" rx="1" fill="#A8C8E0" stroke="#888" strokeWidth="1"/>
      <line x1="46" y1="52" x2="46" y2="70" stroke="#888" strokeWidth="0.8"/>
      <line x1="35" y1="61" x2="57" y2="61" stroke="#888" strokeWidth="0.8"/>
      <rect x="75" y="52" width="22" height="18" rx="1" fill="#A8C8E0" stroke="#888" strokeWidth="1"/>
      <line x1="86" y1="52" x2="86" y2="70" stroke="#888" strokeWidth="0.8"/>
      <rect x="110" y="60" width="18" height="25" rx="1" fill="#7A6050"/>
    </svg>
  );
});

const SvgModerne = memo(function SvgModerne() {
  return (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"95px",display:"block"}}>
      <rect width="200" height="110" fill="#F0F4F8"/><rect width="200" height="50" fill="#B8D4E8"/>
      <rect y="82" width="200" height="28" fill="#9AB87A"/>
      <rect x="20" y="40" width="160" height="44" fill="#F8F8F8"/>
      <rect x="14" y="36" width="172" height="8" fill="#3A5A7A"/>
      <rect x="30" y="48" width="55" height="34" rx="1" fill="#A8CCE8" stroke="#2A4A6A" strokeWidth="1.5"/>
      <line x1="57" y1="48" x2="57" y2="82" stroke="#2A4A6A" strokeWidth="1"/>
      <rect x="95" y="55" width="35" height="27" rx="1" fill="#88AABB" stroke="#2A4A6A" strokeWidth="1.5"/>
      <rect x="140" y="48" width="28" height="15" rx="1" fill="#A8CCE8" stroke="#2A4A6A" strokeWidth="1.5"/>
      <rect x="50" y="30" width="30" height="8" rx="1" fill="#2A4A8A" opacity="0.7"/>
    </svg>
  );
});

const SvgRecent = memo(function SvgRecent() {
  return (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"95px",display:"block"}}>
      <rect width="200" height="110" fill="#EEF4FA"/><rect width="200" height="45" fill="#C0D8EC"/>
      <rect y="85" width="200" height="25" fill="#A0C080"/>
      <rect x="15" y="38" width="170" height="50" fill="#FAFAFA" stroke="#E0E8F0" strokeWidth="1"/>
      <rect x="8" y="33" width="184" height="8" fill="#2A4A6A"/>
      <rect x="15" y="38" width="8" height="50" fill="#D4E8C0"/><rect x="177" y="38" width="8" height="50" fill="#D4E8C0"/>
      <rect x="28" y="44" width="70" height="38" rx="1" fill="#B8D8F0" stroke="#2A4A6A" strokeWidth="1.5"/>
      <line x1="63" y1="44" x2="63" y2="82" stroke="#2A4A6A" strokeWidth="1"/>
      <rect x="108" y="44" width="25" height="16" rx="1" fill="#B8D8F0" stroke="#2A4A6A" strokeWidth="1.5"/>
      <rect x="108" y="65" width="25" height="23" rx="1" fill="#3A6A9A"/>
      <rect x="30" y="28" width="50" height="7" rx="1" fill="#1A3A6A" opacity="0.8"/>
      <rect x="85" y="28" width="50" height="7" rx="1" fill="#1A3A6A" opacity="0.8"/>
      <rect x="15" y="83" width="170" height="5" fill="#C4A878"/>
    </svg>
  );
});

const SvgHaussmann = memo(function SvgHaussmann() {
  return (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"95px",display:"block"}}>
      <rect width="200" height="110" fill="#F2EDE8"/><rect width="200" height="40" fill="#C8D8E8"/>
      <rect y="88" width="200" height="22" fill="#B0A898"/>
      <rect x="15" y="15" width="170" height="76" fill="#EDE5D8"/>
      <rect x="10" y="10" width="180" height="10" fill="#7A8A8A"/>
      <polygon points="10,20 100,5 190,20" fill="#6A7A7A"/>
      <rect x="12" y="44" width="176" height="3" fill="#C8B89A"/><rect x="12" y="64" width="176" height="3" fill="#C8B89A"/>
      <rect x="28" y="24" width="18" height="22" rx="9" fill="#A8C8E0" stroke="#8B7355" strokeWidth="1"/>
      <rect x="72" y="24" width="18" height="22" rx="9" fill="#A8C8E0" stroke="#8B7355" strokeWidth="1"/>
      <rect x="116" y="24" width="18" height="22" rx="9" fill="#A8C8E0" stroke="#8B7355" strokeWidth="1"/>
      <rect x="148" y="24" width="18" height="22" rx="9" fill="#A8C8E0" stroke="#8B7355" strokeWidth="1"/>
      <rect x="80" y="68" width="40" height="22" rx="20" fill="#6B5B45"/>
      <rect x="22" y="72" width="50" height="18" rx="1" fill="#A0B8C8"/>
      <rect x="128" y="72" width="50" height="18" rx="1" fill="#A0B8C8"/>
    </svg>
  );
});

const SvgBarre = memo(function SvgBarre() {
  var rows1 = []; var rows2 = [];
  [16,24,32,40,48,56,64,72].forEach(function(y,i) {
    [28,42,56,68,78].forEach(function(x,j) {
      rows1.push(<rect key={"a"+i+"-"+j} x={x} y={y} width="9" height="5" rx="0.5" fill="#7A9AB8"/>);
    });
  });
  [35,44,53,62,71,80].forEach(function(y,i) {
    [108,122,136,150,164].forEach(function(x,j) {
      rows2.push(<rect key={"b"+i+"-"+j} x={x} y={y+1.5} width="10" height="5" rx="0.5" fill="#8AAABB"/>);
    });
  });
  return (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"95px",display:"block"}}>
      <rect width="200" height="110" fill="#E8EEF4"/><rect width="200" height="35" fill="#B8CCD8"/>
      <rect y="88" width="200" height="22" fill="#8A9A7A"/>
      <rect x="20" y="12" width="75" height="80" fill="#D0CCC8"/>
      {rows1}
      <rect x="100" y="35" width="85" height="57" fill="#C8C4C0"/>
      {rows2}
      <rect x="126" y="78" width="18" height="14" rx="1" fill="#6A7A8A"/>
    </svg>
  );
});

const SvgModerneCo = memo(function SvgModerneCo() {
  var rows1 = []; var rows2 = [];
  [14,24,34,44,54,64,74,82].forEach(function(y,i) {
    [32,46,60,74,82].forEach(function(x,j) {
      rows1.push(<rect key={"c"+i+"-"+j} x={x} y={y} width="10" height="7" rx="0.5" fill="#7AAAC8" opacity="0.9"/>);
    });
  });
  [32,46,60,74].forEach(function(y,i) {
    [104,130,156].forEach(function(x,j) {
      rows2.push(<rect key={"d"+i+"-"+j} x={x} y={y} width="20" height="12" rx="0.5" fill="#A8C8E0" opacity="0.85"/>);
    });
  });
  return (
    <svg viewBox="0 0 200 110" style={{width:"100%",height:"95px",display:"block"}}>
      <rect width="200" height="110" fill="#ECF2F8"/><rect width="200" height="38" fill="#B0CCE0"/>
      <rect y="88" width="200" height="22" fill="#90A878"/>
      <rect x="25" y="10" width="65" height="82" fill="#E8EEF4" stroke="#B0C0D0" strokeWidth="1"/>
      {rows1}
      <rect x="22" y="8" width="71" height="5" fill="#3A5A7A"/>
      <rect x="98" y="28" width="80" height="64" fill="#F0F4F8" stroke="#C0D0E0" strokeWidth="1"/>
      {rows2}
      <rect x="95" y="25" width="86" height="6" fill="#3A5A7A"/>
      <rect x="115" y="80" width="14" height="12" rx="1" fill="#4A6A8A"/>
    </svg>
  );
});

var SVG_MAP = { ancien: SvgAncien, pavillon: SvgPavillon, moderne: SvgModerne, recent: SvgRecent, haussmann: SvgHaussmann, barre: SvgBarre, moderne_co: SvgModerneCo };

var BuildingIllustration = memo(function BuildingIllustration(props) {
  var Comp = SVG_MAP[props.svgKey];
  return (
    <div style={{ width: "100%", background: props.selected ? "#E8F4FF" : "#F0F4F8", borderRadius: "10px 10px 0 0", overflow: "hidden", transition: "background 0.2s" }}>
      {Comp ? <Comp /> : <div style={{ height: 95, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🏠</div>}
    </div>
  );
});

/* ================================================================
   ÉTAPES PARTICULIER
   ================================================================ */
var STEPS_PARTICULIER = [
  { id: "transaction", field: "transaction", question: "Le propriétaire souhaite…", subtitle: "Sélectionnez la transaction concernée 👇",
    options: [{ value: "vente", label: "Vendre", icon: "🏷️", sub: "Mise en vente du bien" }, { value: "location", label: "Louer", icon: "🔑", sub: "Recherche de locataire" }],
    showIf: function(a) { return a.type !== "lots_immeuble"; } },
  { id: "type", field: "type", question: "Quel type de bien ?", subtitle: "Les obligations varient selon la nature du bien 🏠",
    options: [
      { value: "maison", label: "Maison", icon: "🏠", sub: "Individuelle" },
      { value: "copro", label: "Appartement / Copro", icon: "🏢", sub: "En copropriété" },
      { value: "immeuble", label: "Immeuble entier", icon: "🏗️", sub: "Seul propriétaire", venteOnly: true },
      { value: "lots_immeuble", label: "Vente de lots d'un immeuble", icon: "🏗️", sub: "Mise en copropriété", venteOnly: true },
      { value: "local", label: "Local commercial", icon: "🏪", sub: "Usage professionnel" },
    ] },
  { id: "nb_lots", field: "nb_lots", question: "Combien de logements dans l'immeuble ?", subtitle: "Le nombre de lots détermine les diagnostics par logement 📦", type: "number", placeholder: "Ex: 6",
    showIf: function(a) { return a.type === "immeuble"; } },
  { id: "nb_lots_vendus", field: "nb_lots_vendus", question: "Combien de lots sont mis en vente ?", subtitle: "Un seul, plusieurs, ou la totalité ? 🏗️", type: "number", placeholder: "Ex: 3",
    showIf: function(a) { return a.type === "lots_immeuble"; } },
  { id: "usage_immeuble", field: "usage_immeuble", question: "Quel est l'usage de l'immeuble ?", subtitle: "Cela change les obligations — notamment le DTG et le type de DPE 🏢",
    options: [
      { value: "habitation", label: "Habitation", icon: "🏠", sub: "Logements" },
      { value: "mixte", label: "Mixte", icon: "🏪", sub: "Habitation + bureaux/commerces" },
      { value: "tertiaire", label: "100% tertiaire / bureaux", icon: "🏢", sub: "Aucun logement" },
    ],
    showIf: function(a) { return a.type === "lots_immeuble"; } },
  { id: "locaux_pro", field: "locaux_pro", question: "L'immeuble comporte-t-il des locaux professionnels ?", subtitle: "Rez-de-chaussée commercial, cabinet médical… 🏪",
    options: [{ value: true, label: "Oui", icon: "🏪", sub: "Immeuble mixte" }, { value: false, label: "Non", icon: "🏠", sub: "Habitation uniquement" }],
    showIf: function(a) { return a.type === "immeuble"; } },
  { id: "nb_locaux", field: "nb_locaux", question: "Combien de locaux professionnels ?", subtitle: "Pour établir les DPE professionnels séparément 📋", type: "number", placeholder: "Ex: 1",
    showIf: function(a) { return a.type === "immeuble" && a.locaux_pro === true; } },
  { id: "annee", field: "annee", question: "À quelle époque correspond votre bien ?", subtitle: "Sélectionnez l'image qui s'en rapproche le plus 👇", type: "image_choice",
    options: [
      { value: "avant1948", label: "Avant 1948", sub: "Pierres, moulures, parquet ancien", emoji: "🏠", svgKey: "ancien" },
      { value: "de1948a1996", label: "1948 → 1996", sub: "Pavillon, crépis, tuiles romaines", emoji: "🏡", svgKey: "pavillon" },
      { value: "de1997a2009", label: "1997 → 2009", sub: "Moderne, double vitrage, isolé", emoji: "🏘️", svgKey: "moderne" },
      { value: "apres2010", label: "2010 à aujourd'hui", sub: "BBC, RT2012, très isolé", emoji: "🏠", svgKey: "recent" },
    ] },
  { id: "meuble", field: "meuble", question: "Le bien est-il loué meublé ou vide ?", subtitle: "Cela influe sur le mesurage obligatoire 📏",
    options: [{ value: false, label: "Vide", icon: "🪑", sub: "Le locataire apporte ses meubles" }, { value: true, label: "Meublé", icon: "🛏️", sub: "Logement équipé" }],
    showIf: function(a) { return a.transaction === "location" && a.type !== "local"; } },
  { id: "granges", field: "granges", question: "Le bien comporte-t-il des annexes ?", subtitle: "Cave, garage, ou plus grand — cela influe sur le temps d'intervention amiante",
    options: [
      { value: "petites", label: "Petites annexes", icon: "🚗", sub: "Cave, garage, cellier…" },
      { value: "grandes", label: "Grandes annexes", icon: "🐴", sub: "Granges, écuries, hangars…" },
      { value: "non", label: "Aucune annexe", icon: "🏠", sub: "Habitation uniquement" },
    ],
    showIf: function(a) { return (a.annee === "avant1948" || a.annee === "de1948a1996") && a.type !== "local"; } },
  { id: "elec_ancienne", field: "elec_ancienne", question: "L'installation électrique a-t-elle plus de 15 ans ?", subtitle: "Il s'agit de l'installation d'origine — pas d'une rénovation récente ⚡",
    options: [{ value: "non", label: "Non, moins de 15 ans", icon: "✅", sub: "Récente" }, { value: "oui", label: "Oui, plus de 15 ans", icon: "⚠️", sub: "On vérifie…" }, { value: "sais_pas", label: "Ne sait pas", icon: "🤷", sub: "On part sur le diagnostic" }],
    showIf: function(a) { return a.type !== "local" && !(a.type === "lots_immeuble" && a.usage_immeuble === "tertiaire"); } },
  { id: "elec_renove", field: "elec_renove", question: "L'installation a-t-elle été rénovée par un électricien habilité ?", subtitle: "Par un professionnel certifié — pas un bricolage du dimanche 😅",
    options: [{ value: "non", label: "Non, jamais rénovée", icon: "❌", sub: "Diagnostic obligatoire" }, { value: "oui", label: "Oui, rénovée", icon: "🔧", sub: "On vérifie le Consuel…" }],
    showIf: function(a) { return a.elec_ancienne === "oui" && a.type !== "local" && !(a.type === "lots_immeuble" && a.usage_immeuble === "tertiaire"); } },
  { id: "elec_consuel", field: "elec_consuel", question: "Avez-vous le Consuel ? Le papier jaune ?", subtitle: "L'attestation de conformité délivrée après les travaux électriques 📄",
    options: [{ value: "oui", label: "Oui, je l'ai", icon: "📄", sub: "Dispense de diagnostic ✅" }, { value: "non", label: "Non", icon: "❌", sub: "Diagnostic quand même" }],
    showIf: function(a) { return a.elec_ancienne === "oui" && a.elec_renove === "oui" && a.type !== "local" && !(a.type === "lots_immeuble" && a.usage_immeuble === "tertiaire"); } },
  { id: "gaz", field: "gaz", question: "Le bien dispose-t-il d'une installation gaz ?", subtitle: "Canalisation fixe uniquement — pas une bouteille de camping ⛺",
    options: [{ value: true, label: "Oui, installation gaz", icon: "🔥", sub: "Cuisinière, chaudière…" }, { value: false, label: "Non", icon: "❌", sub: "Tout électrique" }],
    showIf: function(a) { return a.type !== "local" && !(a.type === "lots_immeuble" && a.usage_immeuble === "tertiaire"); } },
  { id: "annee_gaz", field: "annee_gaz", question: "L'installation gaz date de quand ?", subtitle: "Même si le gaz est coupé — une canalisation fixe rend le diagnostic obligatoire 🤷", type: "quick_choice",
    options: [{ value: "gaz_recent", label: "Moins de 15 ans", icon: "✅", sub: "Pas de diagnostic gaz" }, { value: "gaz_moyen", label: "15 à 30 ans", icon: "⚠️", sub: "Diagnostic obligatoire" }, { value: "gaz_vieux", label: "Plus de 30 ans / inconnu", icon: "😬", sub: "Diagnostic obligatoire" }],
    showIf: function(a) { return a.gaz === true && a.type !== "local" && !(a.type === "lots_immeuble" && a.usage_immeuble === "tertiaire"); } },
  { id: "zone_termites", field: "zone_termites", question: "Le bien est-il en zone à risque termites ?", subtitle: "En cas de doute, on vous explique comment vérifier 🐛",
    options: [{ value: true, label: "Oui", icon: "🐛", sub: "Arrêté préfectoral" }, { value: false, label: "Non", icon: "✅", sub: "Pas de risque" }, { value: "sais_pas", label: "À vérifier", icon: "🤷", sub: "On vous aide à vérifier" }] },
];

var STEPS_SYNDIC = [
  { id: "annee", field: "annee", question: "La copropriété date de quelle époque ?", subtitle: "Cela détermine l'ensemble de vos obligations 📅", type: "image_choice",
    options: [
      { value: "avant1948", label: "Avant 1949", sub: "Haussmannien, pierre de taille", emoji: "🏛️", svgKey: "haussmann" },
      { value: "de1948a1996", label: "1949 → 1996", sub: "Béton, barres, résidences", emoji: "🏢", svgKey: "barre" },
      { value: "de1997a2009", label: "1997 → 2009", sub: "Moderne, BBC, récent", emoji: "🏙️", svgKey: "moderne_co" },
      { value: "apres2010", label: "2010 à aujourd'hui", sub: "RT2012, très isolé", emoji: "🏗️", svgKey: "recent" },
    ] },
  { id: "nb_lots", field: "nb_lots", question: "Combien de lots dans la copropriété ?", subtitle: "Principaux, secondaires et parkings compris 🏘️", type: "number", placeholder: "Ex: 48" },
  { id: "dpe_co_fait", field: "dpe_co_fait", question: "Disposez-vous d'un DPE collectif valide ?", subtitle: "Réalisé après le 1er juillet 2021 — sinon il n'est plus valable ⚡",
    options: [{ value: true, label: "Oui", icon: "✅", sub: "Après juillet 2021 ?" }, { value: false, label: "Non", icon: "❌", sub: "Obligatoire !" }] },
  { id: "dpe_etiquette", field: "dpe_etiquette", question: "Quelle est l'étiquette du DPE collectif ?", subtitle: "Détermine l'obligation d'audit en cas de vente 📊", type: "quick_choice",
    options: [{ value: "A", label: "A ou B", icon: "🟢", sub: "Excellent" }, { value: "C", label: "C ou D", icon: "🟡", sub: "Correct" }, { value: "E", label: "E", icon: "🟠", sub: "Audit si vente" }, { value: "F", label: "F ou G", icon: "🔴", sub: "Audit si vente" }],
    showIf: function(a) { return a.dpe_co_fait === true; } },
  { id: "ppt_fait", field: "ppt_fait", question: "La copropriété dispose-t-elle d'un PPT / PPPT ?", subtitle: "Plan Pluriannuel de Travaux — obligatoire au-delà de 15 ans 🏗️",
    options: [{ value: true, label: "Oui", icon: "✅", sub: "En règle" }, { value: false, label: "Non", icon: "❌", sub: "À réaliser !" }],
    showIf: function(a) { return a.annee && anneeVal(a.annee) < CURRENT_YEAR - 15; } },
  { id: "dta_fait", field: "dta_fait", question: "Le dossier amiante des parties communes (DTA) — où en êtes-vous ?", subtitle: "PC avant 1997 — ce dossier doit exister et être à jour 🧱",
    options: [
      { value: "ok", label: "On l'a, il est récent", icon: "✅", sub: "Réalisé ou mis à jour après février 2021" },
      { value: "vieux", label: "On l'a, mais il est ancien", icon: "⚠️", sub: "Avant janvier 2013 ou jamais mis à jour" },
      { value: "non", label: "On ne l'a pas", icon: "❌", sub: "Jamais réalisé" },
    ],
    showIf: function(a) { return a.annee && anneeVal(a.annee) < 1997; } },
  { id: "crep_co_fait", field: "crep_co_fait", question: "Disposez-vous d'un CREP parties communes ?", subtitle: "Constat Plomb — PC avant 1949 🔩",
    options: [{ value: true, label: "Oui", icon: "✅", sub: "Illimité si CREP" }, { value: false, label: "Non", icon: "❌", sub: "À réaliser !" }],
    showIf: function(a) { return a.annee && anneeVal(a.annee) < 1949; } },
];

/* ================================================================
   COMPOSANTS UI
   ================================================================ */
var ValidityChecker = memo(function ValidityChecker(props) {
  const [date, setDate] = useState("");
  if (!props.duree_mois) return null;
  var result = date ? isExpired(date, props.duree_mois) : null;
  return (
    <div style={{ marginTop: 12, background: BLUE_LIGHT, borderRadius: 10, padding: "11px 14px" }}>
      <div style={{ fontSize: 11, color: BLUE, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>🗓 Vous possédez un ancien diagnostic ? Est-il encore valable ?</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={function(e) { setDate(e.target.value); }}
          style={{ background: "white", border: "1.5px solid " + BLUE + "30", borderRadius: 8, padding: "7px 11px", color: "#1e293b", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
        {result && (
          <div style={{ fontSize: 13, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: result.expired ? "#FEE2E2" : "#DCFCE7", color: result.expired ? "#dc2626" : "#16a34a" }}>
            {result.expired ? "💀 Expiré depuis " + result.days + " jour" + (result.days > 1 ? "s" : "") + " — à refaire" : "✅ Valide encore " + result.days + " jour" + (result.days > 1 ? "s" : "")}
          </div>
        )}
      </div>
    </div>
  );
});

var DpeValidityChecker = memo(function DpeValidityChecker(props) {
  var isLocalPro = props.isLocalPro;
  const [date, setDate] = useState("");
  var result = null;

  if (date) {
    var d = new Date(date);
    var cutoff = new Date("2021-07-01");
    var now = new Date();

    if (isLocalPro) {
      // LOCAL PRO : validité classique 10 ans à compter de la date du diag
      var expiry = new Date(d);
      expiry.setFullYear(expiry.getFullYear() + 10);
      var diffDays = Math.round((expiry - now) / (1000 * 3600 * 24));
      result = { expired: diffDays < 0, days: Math.abs(diffDays), reason: diffDays < 0 ? "Expiré — plus de 10 ans" : "Valide encore " + Math.abs(diffDays) + " jour" + (Math.abs(diffDays) > 1 ? "s" : "") };
    } else {
      // LOGEMENT : tout DPE réalisé avant le 01/07/2021 est caduc
      if (d < cutoff) {
        result = { expired: true, days: 0, reason: "CADUC — réalisé avant le 1er juillet 2021" };
      } else {
        // Après juillet 2021 : validité 10 ans classique
        var expiry2 = new Date(d);
        expiry2.setFullYear(expiry2.getFullYear() + 10);
        var diffDays2 = Math.round((expiry2 - now) / (1000 * 3600 * 24));
        result = { expired: diffDays2 < 0, days: Math.abs(diffDays2), reason: diffDays2 < 0 ? "Expiré — plus de 10 ans" : "Valide encore " + Math.abs(diffDays2) + " jour" + (Math.abs(diffDays2) > 1 ? "s" : "") };
      }
    }
  }

  return (
    <div style={{ marginTop: 12, background: BLUE_LIGHT, borderRadius: 10, padding: "11px 14px" }}>
      <div style={{ fontSize: 11, color: BLUE, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>🗓 Vous possédez un ancien DPE ? Est-il encore valable ?</div>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>
        {isLocalPro ? "Local pro : validité = date du diag + 10 ans (pas de règle juillet 2021)" : "Logement : tout DPE réalisé avant le 01/07/2021 n'est plus valable, quelle que soit sa date d'expiration initiale"}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <input type="date" value={date} onChange={function(e) { setDate(e.target.value); }}
          style={{ background: "white", border: "1.5px solid " + BLUE + "30", borderRadius: 8, padding: "7px 11px", color: "#1e293b", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
        {result && (
          <div style={{ fontSize: 13, fontWeight: 800, padding: "5px 12px", borderRadius: 8, background: result.expired ? "#FEE2E2" : "#DCFCE7", color: result.expired ? "#dc2626" : "#16a34a" }}>
            {result.expired ? "💀 " + result.reason : "✅ " + result.reason}
          </div>
        )}
      </div>
    </div>
  );
});

var TermitesCard = memo(function TermitesCard(props) {
  const [open, setOpen] = useState(false);
  var diag = props.diag;
  var bc = diag.incertain ? "#f59e0b" : diag.obligatoire ? GREEN : "#E2EAF8";
  return (
    <div style={{ background: "white", border: "1.5px solid " + bc, borderLeft: "4px solid " + bc, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(27,58,140,0.06)", animation: "slideIn 0.35s ease forwards", animationDelay: (props.index * 0.07) + "s", opacity: 0 }}>
      <div onClick={function() { setOpen(function(o) { return !o; }); }} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ fontSize: 20, width: 40, height: 40, background: BLUE_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🐛</div>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800, fontSize: 14, color: diag.incertain ? "#f59e0b" : diag.obligatoire ? GREEN : "#94a3b8" }}>
            {"Termites " + (diag.incertain ? "— À vérifier ⚠️" : diag.obligatoire ? "— Obligatoire" : "— Non requis")}
          </span>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>État relatif à la présence de termites — 6 mois si zone</div>
        </div>
        <div style={{ fontSize: 11, color: "#cbd5e1" }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: "1px solid #EEF2FB" }}>
          <div style={{ paddingTop: 12 }}>
            {diag.incertain ? (
              <div style={{ background: "#FEF9C3", border: "1px solid #FCD34D", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800, fontSize: 14, color: "#92400e", marginBottom: 8 }}>Vous n'êtes pas sûr — voici comment vérifier</div>
                <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.7, marginBottom: 12 }}>Les zones termites sont définies par <strong>arrêté préfectoral</strong> commune par commune. Même un département partiellement concerné peut avoir des communes exemptées.</p>
                <a href="https://www.service-public.fr/particuliers/vosdroits/F2060" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1px solid #FCD34D", borderRadius: 8, padding: "10px 14px", color: "#92400e", textDecoration: "none", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🔗 Vérifier sur Service-Public.fr</a>
                <div style={{ fontSize: 12, color: "#78350f" }}>📞 Ou appelez votre mairie — gratuit, 2 minutes</div>
                <p style={{ fontSize: 12, color: "#92400e", marginTop: 10, fontWeight: 700 }}>⚠️ En cas de doute → faites le diagnostic. Il coûte bien moins cher qu'un litige.</p>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{diag.desc}</p>
            )}
            {diag.obligatoire && <ValidityChecker duree_mois={6} />}
          </div>
        </div>
      )}
    </div>
  );
});

var DiagCard = memo(function DiagCard(props) {
  const [open, setOpen] = useState(false);
  var diag = props.diag;
  if (diag.id === "TERMITES") return <TermitesCard diag={diag} index={props.index} />;
  var isMissing = props.syndic && diag.manquant === true;
  var isOk = props.syndic && diag.manquant === false;
  return (
    <div style={{ background: "white", border: "1.5px solid " + (isMissing ? "#fca5a5" : isOk ? GREEN + "50" : "#E2EAF8"), borderLeft: "4px solid " + (diag.color || BLUE), borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(27,58,140,0.06)", animation: "slideIn 0.35s ease forwards", animationDelay: (props.index * 0.07) + "s", opacity: 0 }}>
      <div onClick={function() { setOpen(function(o) { return !o; }); }} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ fontSize: 20, width: 40, height: 40, background: BLUE_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{diag.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800, fontSize: 14, color: diag.color || BLUE }}>{diag.label}</span>
            {diag.scope && <span style={{ fontSize: 10, color: "#94a3b8", background: BLUE_LIGHT, borderRadius: 4, padding: "2px 7px" }}>{diag.scope}</span>}
            {isMissing && <span style={{ fontSize: 10, color: "white", background: "#ef4444", borderRadius: 4, padding: "2px 8px", fontWeight: 800 }}>MANQUANT</span>}
            {isOk && <span style={{ fontSize: 10, color: "white", background: GREEN, borderRadius: 4, padding: "2px 8px", fontWeight: 800 }}>✓ OK</span>}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{diag.full}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>⏱ {diag.duree_label}</div>
          <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>{open ? "▲" : "▼"}</div>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: "1px solid #EEF2FB" }}>
          <div style={{ paddingTop: 12 }}>
            {diag.alerte && <div style={{ background: "#FEF9C3", border: "1px solid #FCD34D", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400e", marginBottom: 10, fontWeight: 600 }}>⚠️ {diag.alerte}</div>}
            {diag.conditionnel && <div style={{ background: BLUE_LIGHT, border: "1px solid " + BLUE + "30", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: BLUE, marginBottom: 10, fontWeight: 600 }}>ℹ️ {diag.conditionnel}</div>}
            {diag.granges === "petites" && <div style={{ background: "#FEF9C3", border: "1px solid #FCD34D", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400e", marginBottom: 10, fontWeight: 600 }}>🚗 Petites annexes (cave, garage, cellier) — prévoir du temps supplémentaire pour le repérage amiante</div>}
            {diag.granges === "grandes" && <div style={{ background: "#FEF9C3", border: "1px solid #FCD34D", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400e", marginBottom: 10, fontWeight: 600 }}>🐴 Grandes annexes (granges, écuries, hangars) — temps d'intervention significativement plus long !</div>}
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, marginBottom: 10 }}>{diag.desc}</p>
            {diag.caducite && !diag.duree_detail && <div style={{ fontSize: 12, color: "#dc2626", background: "#FEE2E2", borderRadius: 8, padding: "6px 10px", marginBottom: 10, fontWeight: 600 }}>⛔ {diag.caducite}</div>}
            {diag.duree_detail && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: BLUE, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Durées de validité</div>
                {diag.duree_detail.map(function(d, i) {
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < diag.duree_detail.length - 1 ? "1px solid #EEF2FB" : "none", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "#64748b", flex: 1 }}>{d.cas}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: d.val === "CADUC" ? "#dc2626" : d.val === "Illimité" ? "#16a34a" : BLUE, whiteSpace: "nowrap" }}>{d.val}</span>
                    </div>
                  );
                })}
                {(diag.id === "AMIANTE_CAV" || diag.id === "DTA" || diag.id === "DTA_PRO" || diag.id === "DTA_OPT" || diag.id === "DAPP") && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>* Sous réserve d'évolution réglementaire</div>
                )}
              </div>
            )}
            {(diag.id === "DPE" || diag.id === "DPE_COLLECTIF" || diag.id === "DPE_PRO" || diag.id === "DPE_CO" || diag.id === "DPE_CO_OPT") ? (
              <DpeValidityChecker isLocalPro={diag.id === "DPE_PRO"} />
            ) : (
              <ValidityChecker duree_mois={diag.duree_mois} />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/* ================================================================
   FORMULAIRE DEVIS
   ================================================================ */
function DevisForm(props) {
  var diags = props.diags;
  var answers = props.answers;
  var mode = props.mode;
  var agence = props.agence;
  var onClose = props.onClose;
  const [form, setForm] = useState({ nom: "", prenom: "", tel: "", email: "", adresse_proprio: "", cp_proprio: "", ville_proprio: "", adresse_bien: "", cp_bien: "", ville_bien: "", surface: "", type_appart: "", annee_exacte: "", apporteur_nom: "", apporteur_email: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [rgpd, setRgpd] = useState(false);
  var type = answers.type;

  var handleChange = useCallback(function(e) {
    var n = e.target.name;
    var v = e.target.value;
    setForm(function(p) { var next = {}; for (var k in p) next[k] = p[k]; next[n] = v; return next; });
    setErrors(function(p) { var next = {}; for (var k in p) next[k] = p[k]; delete next[n]; return next; });
  }, []);

  function validate() {
    var e = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.tel.trim()) e.tel = "Requis";
    else if (!validateTel(form.tel)) e.tel = "Format invalide";
    if (!form.email.trim()) e.email = "Requis";
    else if (!validateEmail(form.email)) e.email = "Email invalide";
    if (!form.adresse_bien.trim()) e.adresse_bien = "Requis";
    return e;
  }

  function handleSend() {
    var e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSending(true);
    setSendError(false);

    var diagsList = diags.filter(function(d) { return d.id !== "TERMITES" || d.obligatoire; }).map(function(d) { return d.label; }).join(", ");

    // ══════════════════════════════════════════════════════
    // EMAILJS — Configuration requise (gratuit, 200 emails/mois)
    //
    // 1. Crée un compte sur https://www.emailjs.com
    // 2. Ajoute un "Email Service" (Gmail, Outlook, etc.)
    // 3. Crée 2 "Email Templates" :
    //
    //    TEMPLATE 1 — Demande de devis (vers contact.ain)
    //    Variables : {{to_email}}, {{client_prenom}}, {{client_nom}},
    //    {{client_tel}}, {{client_email}}, {{adresse_proprio}},
    //    {{cp_proprio}}, {{ville_proprio}}, {{adresse_bien}},
    //    {{cp_bien}}, {{ville_bien}}, {{surface}}, {{type_appart}},
    //    {{diagnostics}}, {{agence}}, {{apporteur_nom}},
    //    {{apporteur_email}}, {{annee_exacte}}, {{mode}}
    //
    //    TEMPLATE 2 — Confirmation agent (vers l'apporteur)
    //    Variables : {{to_email}}, {{apporteur_nom}},
    //    {{client_prenom}}, {{client_nom}}, {{diagnostics}},
    //    {{adresse_bien}}, {{cp_bien}}, {{ville_bien}}
    //    Exemple de contenu :
    //      "Bonjour {{apporteur_nom}},
    //       Nous avons bien reçu votre demande de devis pour
    //       {{client_prenom}} {{client_nom}} — {{adresse_bien}}
    //       {{cp_bien}} {{ville_bien}}.
    //       Diagnostics : {{diagnostics}}
    //       Nous revenons vers le propriétaire sous 24h.
    //       DiagCheck"
    //
    // 4. Remplace les 4 valeurs ci-dessous par les tiennes :
    // ══════════════════════════════════════════════════════
    var EMAILJS_SERVICE_ID = "service_XXXXXXX";              // <-- ton Service ID
    var EMAILJS_TEMPLATE_ID = "template_XXXXXXX";            // <-- Template devis (vers contact.ain)
    var EMAILJS_CONFIRM_TEMPLATE_ID = "template_XXXXXXX";   // <-- Template confirmation (vers l'agent)
    var EMAILJS_PUBLIC_KEY = "XXXXXXXXXXXXXXX";              // <-- ta Public Key

    var templateParams = {
      to_email: MON_EMAIL,
      client_prenom: form.prenom,
      client_nom: form.nom,
      client_tel: form.tel,
      client_email: form.email,
      adresse_proprio: form.adresse_proprio || "",
      cp_proprio: form.cp_proprio || "",
      ville_proprio: form.ville_proprio || "",
      adresse_bien: form.adresse_bien,
      cp_bien: form.cp_bien,
      ville_bien: form.ville_bien,
      surface: form.surface || "",
      type_appart: form.type_appart || "",
      diagnostics: diagsList,
      agence: agence ? agence.nom : "Direct (sans code agence)",
      apporteur_nom: form.apporteur_nom || "Non renseigne",
      apporteur_email: form.apporteur_email || "",
      annee_exacte: form.annee_exacte || "Non connue",
      mode: mode || "particulier",
    };

    // Params pour la confirmation agent
    var confirmParams = form.apporteur_email ? {
      to_email: form.apporteur_email,
      apporteur_nom: form.apporteur_nom,
      client_prenom: form.prenom,
      client_nom: form.nom,
      diagnostics: diagsList,
      adresse_bien: form.adresse_bien,
      cp_bien: form.cp_bien,
      ville_bien: form.ville_bien,
    } : null;

    // Charge EmailJS dynamiquement si pas encore charge
    if (window.emailjs) {
      sendViaEmailJS(templateParams, confirmParams, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_CONFIRM_TEMPLATE_ID, EMAILJS_PUBLIC_KEY);
    } else {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      script.onload = function() {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
        sendViaEmailJS(templateParams, confirmParams, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_CONFIRM_TEMPLATE_ID, EMAILJS_PUBLIC_KEY);
      };
      script.onerror = function() {
        setSending(false);
        setSendError(true);
      };
      document.head.appendChild(script);
    }
  }

  function sendViaEmailJS(params, confirmParams, serviceId, templateId, confirmTemplateId, publicKey) {
    // Envoi 1 : demande de devis vers contact.ain
    window.emailjs.send(serviceId, templateId, params, publicKey)
      .then(function() {
        // Envoi 2 : confirmation vers l'agent (si email renseigné)
        if (confirmParams) {
          window.emailjs.send(serviceId, confirmTemplateId, confirmParams, publicKey).catch(function() {});
        }
        setSending(false);
        setSent(true);
      })
      .catch(function(err) {
        console.error("EmailJS erreur:", err);
        setSending(false);
        setSendError(true);
      });
  }

  function makeInputProps(name) {
    return {
      style: { width: "100%", background: "#F8FAFF", border: "1.5px solid " + (errors[name] ? "#ef4444" : BLUE + "20"), borderRadius: 10, padding: "11px 14px", color: "#1e293b", fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: errors[name] ? 2 : 10, transition: "border-color 0.2s" },
      name: name, value: form[name], onChange: handleChange,
    };
  }

  function fieldError(name) {
    return errors[name] ? <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 8, fontWeight: 600 }}>{errors[name]}</div> : null;
  }

  function sec(t) {
    return <div style={{ fontSize: 11, color: BLUE, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 18, height: 2, background: GREEN, display: "inline-block" }} />{t}</div>;
  }

  var diagsToShow = diags.filter(function(d) { return d.id !== "TERMITES" || d.obligatoire; });

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 20px" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
      <h3 style={{ fontFamily: "'Raleway', sans-serif", fontSize: 22, fontWeight: 800, color: BLUE, marginBottom: 8 }}>Demande envoyée !</h3>
      <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.7 }}>Le devis sera établi et transmis au propriétaire sous 24h.</p>
      {agence && <div style={{ marginTop: 12, background: BLUE_LIGHT, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: BLUE, fontWeight: 600 }}>📨 Dossier transmis via {agence.nom}</div>}
      {form.apporteur_nom && <div style={{ marginTop: 8, background: GREEN_LIGHT, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#4d7a1a", fontWeight: 600 }}>🤝 {form.apporteur_nom} — identifié comme apporteur d'affaire</div>}
      {form.apporteur_email && <div style={{ marginTop: 8, background: BLUE_LIGHT, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: BLUE, fontWeight: 600 }}>📧 Un email de confirmation a été envoyé à {form.apporteur_email}</div>}
      <button onClick={onClose} style={{ marginTop: 20, background: "linear-gradient(135deg, " + BLUE + ", " + GREEN + ")", border: "none", borderRadius: 12, padding: "12px 26px", color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Fermer ✓</button>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 18, fontWeight: 800, color: BLUE, marginBottom: 4 }}>Coordonnées du propriétaire 👇</div>
        <p style={{ fontSize: 13, color: "#64748b" }}>Renseignez les informations du propriétaire — les diagnostics identifiés sont déjà pré-remplis.</p>
        {agence && <div style={{ marginTop: 8, background: GREEN_LIGHT, border: "1px solid " + GREEN + "40", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#4d7a1a", fontWeight: 600 }}>🏢 Via {agence.nom}</div>}
      </div>
      <div style={{ background: BLUE_LIGHT, borderRadius: 12, padding: "12px 14px", marginBottom: 4 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>📋 Diagnostics identifiés</div>
        {diagsToShow.filter(function(d) { return d.id !== "DPE_PRO" && d.id !== "DTA_PRO"; }).map(function(d) {
          return (
            <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
              <span style={{ color: GREEN, fontSize: 13, fontWeight: 800 }}>✓</span>
              <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{d.label}</span>
              {d.scope && <span style={{ fontSize: 10, color: "#94a3b8" }}>— {d.scope}</span>}
            </div>
          );
        })}
        {diagsToShow.filter(function(d) { return d.id === "DPE_PRO" || d.id === "DTA_PRO"; }).length > 0 && (
          <>
            <div style={{ fontSize: 11, color: "#06b6d4", fontWeight: 800, textTransform: "uppercase", margin: "8px 0 4px" }}>— Locaux professionnels</div>
            {diagsToShow.filter(function(d) { return d.id === "DPE_PRO" || d.id === "DTA_PRO"; }).map(function(d) {
              return (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                  <span style={{ color: "#06b6d4", fontSize: 13, fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{d.label}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
      {sec("Coordonnées du propriétaire")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div><input {...makeInputProps("prenom")} placeholder="Prénom" />{fieldError("prenom")}</div>
        <div><input {...makeInputProps("nom")} placeholder="Nom" />{fieldError("nom")}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div><input {...makeInputProps("tel")} placeholder="Téléphone" type="tel" />{fieldError("tel")}</div>
        <div><input {...makeInputProps("email")} placeholder="Email" type="email" />{fieldError("email")}</div>
      </div>
      {sec("Adresse du bien à diagnostiquer")}
      <input {...makeInputProps("adresse_bien")} placeholder="Adresse du bien — ex: 12 rue des Acacias" />{fieldError("adresse_bien")}
      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10 }}>
        <input {...makeInputProps("cp_bien")} placeholder="Code postal" />
        <input {...makeInputProps("ville_bien")} placeholder="Ville" />
      </div>
      {sec("Adresse du propriétaire — facturation")}
      <button onClick={function() { if (!form.adresse_bien.trim()) return; setForm(function(p) { var n = {}; for (var k in p) n[k] = p[k]; n.adresse_proprio = p.adresse_bien; n.cp_proprio = p.cp_bien; n.ville_proprio = p.ville_bien; return n; }); }} disabled={!form.adresse_bien.trim()} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: !form.adresse_bien.trim() ? "#f1f5f9" : form.adresse_proprio === form.adresse_bien && form.adresse_bien ? GREEN_LIGHT : "#F8FAFF", border: "1.5px solid " + (!form.adresse_bien.trim() ? "#e2e8f0" : form.adresse_proprio === form.adresse_bien && form.adresse_bien ? GREEN + "60" : BLUE + "20"), borderRadius: 10, padding: "10px 14px", cursor: !form.adresse_bien.trim() ? "default" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: !form.adresse_bien.trim() ? "#cbd5e1" : form.adresse_proprio === form.adresse_bien && form.adresse_bien ? GREEN : "#64748b", transition: "all 0.2s", marginBottom: 10, opacity: !form.adresse_bien.trim() ? 0.5 : 1 }}>
        <span style={{ fontSize: 16 }}>{form.adresse_proprio === form.adresse_bien && form.adresse_bien ? "✅" : "📋"}</span>
        {form.adresse_proprio === form.adresse_bien && form.adresse_bien ? "Adresse identique au bien — c'est rempli !" : "Identique à l'adresse du bien"}
      </button>
      <input {...makeInputProps("adresse_proprio")} placeholder="Adresse postale du propriétaire" />
      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10 }}>
        <input {...makeInputProps("cp_proprio")} placeholder="Code postal" />
        <input {...makeInputProps("ville_proprio")} placeholder="Ville" />
      </div>
      {type === "maison" && (
        <>{sec("Surface")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
          {["< 50 m²","50-100 m²","100-150 m²","150-200 m²","+ 200 m²"].map(function(s) {
            return <button key={s} onClick={function() { setForm(function(p) { var n = {}; for (var k in p) n[k] = p[k]; n.surface = s; return n; }); }} style={{ background: form.surface === s ? BLUE : "#F8FAFF", border: "1.5px solid " + (form.surface === s ? BLUE : BLUE + "20"), borderRadius: 8, padding: "9px 6px", color: form.surface === s ? "white" : "#334155", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>;
          })}
        </div></>
      )}
      {type === "copro" && (
        <>{sec("Type d'appartement")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
          {["Studio/T1","T2","T3","T4","T5","T6+"].map(function(t) {
            return <button key={t} onClick={function() { setForm(function(p) { var n = {}; for (var k in p) n[k] = p[k]; n.type_appart = t; return n; }); }} style={{ background: form.type_appart === t ? BLUE : "#F8FAFF", border: "1.5px solid " + (form.type_appart === t ? BLUE : BLUE + "20"), borderRadius: 8, padding: "9px 6px", color: form.type_appart === t ? "white" : "#334155", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{t}</button>;
          })}
        </div></>
      )}
      {(type === "immeuble" || mode === "syndic") && (
        <div style={{ background: BLUE_LIGHT, borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: BLUE, fontWeight: 600 }}>🏗️ {answers.nb_lots} lots — pris en compte pour le devis</span>
        </div>
      )}
      {type === "local" && (
        <>{sec("Surface du local")}<input {...makeInputProps("surface")} placeholder="Surface en m² — ex: 120" /></>
      )}
      {sec("Date de construction")}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input {...makeInputProps("annee_exacte")} placeholder="Année exacte si connue — ex: 1972" type="number" style={{ width: "100%", background: "#F8FAFF", border: "1.5px solid " + (errors.annee_exacte ? "#ef4444" : BLUE + "20"), borderRadius: 10, padding: "11px 14px", color: "#1e293b", fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 0 }} />
      </div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 10, lineHeight: 1.5 }}>Facultatif mais utile — la date exacte nous aide à affiner le devis et les obligations réglementaires.</div>
      <div style={{ marginTop: 18, background: "linear-gradient(135deg, " + BLUE_LIGHT + ", " + GREEN_LIGHT + ")", border: "1.5px solid " + GREEN + "30", borderRadius: 14, padding: "16px 16px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>🤝</span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 14, fontWeight: 800, color: BLUE }}>Vos coordonnées — apporteur d'affaire</span>
        </div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>Renseignez vos coordonnées pour être identifié sur ce dossier.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input {...makeInputProps("apporteur_nom")} placeholder="Votre nom" />
          <input {...makeInputProps("apporteur_email")} placeholder="Votre email" type="email" />
        </div>
      </div>
      {sendError && <div style={{ background: "#FEE2E2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginTop: 10, marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 700, marginBottom: 4 }}>L'envoi a échoué</div>
        <div style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.5 }}>Vérifiez votre connexion internet et réessayez. Si le problème persiste, contactez-nous directement à contact.ain@ac-environnement.com</div>
      </div>}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 14, marginBottom: 6, cursor: "pointer" }}>
        <input type="checkbox" checked={rgpd} onChange={function() { setRgpd(function(v) { return !v; }); }} style={{ marginTop: 3, width: 18, height: 18, accentColor: GREEN, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>Le propriétaire accepte que ses données soient utilisées pour l'établissement d'un devis. Elles ne seront ni cédées ni utilisées à d'autres fins.</span>
      </label>
      <button onClick={handleSend} disabled={sending || !rgpd}
        style={{ width: "100%", background: "linear-gradient(135deg, " + BLUE + ", " + GREEN + ")", border: "none", borderRadius: 12, padding: "14px", color: "white", fontSize: 15, fontWeight: 800, cursor: (sending || !rgpd) ? "default" : "pointer", fontFamily: "inherit", marginTop: 8, opacity: (sending || !rgpd) ? 0.3 : 1, transition: "opacity 0.2s" }}>
        {sending ? "Envoi en cours…" : "Envoyer ma demande de devis 🚀"}
      </button>
    </div>
  );
}

/* ================================================================
   CSS
   ================================================================ */
var css = `
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#F4F7FF;font-family:'Nunito',sans-serif;color:#1e293b}
.app{min-height:100vh;background:linear-gradient(160deg,#F4F7FF 0%,#EEF5E8 100%)}
.header{padding:16px 28px;background:white;border-bottom:2px solid #6AB02330;display:flex;align-items:center;gap:14px;box-shadow:0 2px 12px rgba(27,58,140,0.08)}
.logo-name{font-family:'Raleway',sans-serif;font-size:18px;font-weight:800;color:#1B3A8C;letter-spacing:-0.5px}
.main{max-width:680px;margin:0 auto;padding:36px 18px}
.hero{text-align:center;margin-bottom:32px}
.hero h1{font-family:'Raleway',sans-serif;font-size:32px;font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:12px;color:#1B3A8C}
.hero h1 em{font-style:normal;color:#6AB023}
.hero p{color:#64748b;font-size:14px;max-width:420px;margin:0 auto;line-height:1.7}
.mode-btns{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.mode-btn{background:white;border:2px solid #E2EAF8;border-radius:18px;padding:22px 16px;cursor:pointer;text-align:center;transition:all 0.2s ease;box-shadow:0 2px 8px rgba(27,58,140,0.06)}
.mode-btn:hover{border-color:#6AB023;transform:translateY(-3px);box-shadow:0 8px 24px rgba(106,176,35,0.15)}
.mode-icon{font-size:36px;margin-bottom:10px}
.mode-label{font-family:'Raleway',sans-serif;font-size:16px;font-weight:800;color:#1B3A8C;margin-bottom:4px}
.mode-sub{font-size:12px;color:#94a3b8}
.progress{height:5px;background:#E2EAF8;border-radius:5px;margin-bottom:28px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,#1B3A8C,#6AB023);border-radius:5px;transition:width 0.4s cubic-bezier(.4,0,.2,1)}
.card{background:white;border:1.5px solid #E2EAF8;border-radius:20px;padding:26px;margin-bottom:18px;box-shadow:0 2px 12px rgba(27,58,140,0.06);animation:fadeIn 0.25s ease}
.step-num{font-size:11px;color:#6AB023;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.step-q{font-family:'Raleway',sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.3px;margin-bottom:5px;color:#1B3A8C}
.step-sub{color:#64748b;font-size:13px;margin-bottom:20px}
.opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
.opt{background:#F8FAFF;border:2px solid #E2EAF8;border-radius:14px;padding:14px 10px;cursor:pointer;transition:all 0.2s ease;text-align:center;color:#475569;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700}
.opt:hover{background:#F0F8E8;border-color:#6AB023;transform:translateY(-2px)}
.opt.sel{background:#F0F8E8;border-color:#6AB023;color:#6AB023}
.opt-icon{font-size:22px;margin-bottom:6px}
.opt-sub{font-size:11px;color:#94a3b8;font-weight:500;margin-top:4px}
.opt.sel .opt-sub{color:#4d7a1a}
.img-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.img-opt{background:white;border:2px solid #E2EAF8;border-radius:14px;overflow:hidden;cursor:pointer;transition:all 0.2s ease;box-shadow:0 2px 8px rgba(27,58,140,0.06)}
.img-opt:hover{border-color:#6AB023;transform:translateY(-3px)}
.img-opt.sel{border-color:#6AB023}
.img-opt-body{padding:9px;text-align:center}
.img-opt-emoji{font-size:16px;margin-bottom:3px}
.img-opt-label{font-family:'Raleway',sans-serif;font-size:12px;font-weight:800;color:#1B3A8C}
.img-opt.sel .img-opt-label{color:#6AB023}
.img-opt-sub{font-size:10px;color:#94a3b8;margin-top:2px}
.num-input{width:100%;background:#F8FAFF;border:2px solid #E2EAF8;border-radius:12px;padding:14px 16px;color:#1B3A8C;font-size:22px;font-family:'Raleway',sans-serif;font-weight:800;outline:none;transition:border-color 0.2s}
.num-input:focus{border-color:#6AB023}
.num-input::placeholder{color:#cbd5e1}
.nav{display:flex;gap:10px;margin-top:20px}
.btn-next{flex:1;background:linear-gradient(135deg,#1B3A8C,#6AB023);border:none;border-radius:12px;padding:14px 20px;color:white;font-size:15px;font-weight:800;cursor:pointer;transition:opacity 0.2s,transform 0.15s;font-family:'Nunito',sans-serif;box-shadow:0 4px 14px #1B3A8C30}
.btn-next:hover{opacity:0.9;transform:translateY(-1px)}
.btn-next:disabled{opacity:0.2;cursor:default;transform:none;box-shadow:none}
.btn-back{background:white;border:1.5px solid #E2EAF8;border-radius:12px;padding:14px 16px;color:#64748b;font-size:14px;cursor:pointer;transition:all 0.2s;font-family:'Nunito',sans-serif;font-weight:700}
.btn-back:hover{border-color:#1B3A8C;color:#1B3A8C}
.results-header{text-align:center;margin-bottom:24px}
.results-header h2{font-family:'Raleway',sans-serif;font-size:26px;font-weight:800;letter-spacing:-1px;color:#1B3A8C;margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-bottom:8px}
.chip{background:white;border:1.5px solid #E2EAF8;border-radius:20px;padding:3px 11px;font-size:12px;color:#475569;font-weight:600}
.chip strong{color:#1B3A8C}
.chip.pro{border-color:#06b6d430;color:#0e7490;background:#ecfeff}
.diags-list{display:flex;flex-direction:column;gap:9px}
.consuel-banner{background:#DCFCE7;border:1.5px solid #6AB023;border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;font-size:13px;color:#16a34a;font-weight:700}
.mixte-banner{background:#ecfeff;border:1.5px solid #06b6d4;border-radius:12px;padding:12px 16px;margin-bottom:12px;font-size:13px;color:#0e7490;font-weight:700}
.syndic-score{background:white;border:1.5px solid #E2EAF8;border-radius:16px;padding:18px 20px;margin-bottom:20px;box-shadow:0 2px 12px rgba(27,58,140,0.06)}
.cta{margin-top:28px;background:linear-gradient(135deg,#EEF2FB,#F0F8E8);border:1.5px solid #6AB02340;border-radius:18px;padding:22px;text-align:center}
.cta h3{font-family:'Raleway',sans-serif;font-size:17px;font-weight:800;color:#1B3A8C;margin-bottom:5px}
.cta p{color:#64748b;font-size:13px;margin-bottom:14px}
.cta-btn{background:linear-gradient(135deg,#1B3A8C,#6AB023);border:none;border-radius:12px;padding:13px 28px;color:white;font-size:14px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:0 4px 14px #1B3A8C30;transition:opacity 0.2s}
.cta-btn:hover{opacity:0.88}
.modal-overlay{position:fixed;inset:0;background:#1B3A8C60;display:flex;align-items:flex-end;justify-content:center;z-index:100;animation:fadeIn 0.2s ease}
.modal{background:white;border-radius:20px 20px 0 0;padding:24px 22px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 -8px 40px #1B3A8C20;position:relative}
.modal-handle{width:40px;height:4px;background:#E2EAF8;border-radius:4px;margin:0 auto 18px}
.reset{display:block;margin:18px auto 0;background:transparent;border:1.5px solid #E2EAF8;border-radius:12px;padding:10px 22px;color:#94a3b8;cursor:pointer;font-size:13px;font-family:'Nunito',sans-serif;font-weight:700;transition:all 0.2s}
.reset:hover{border-color:#1B3A8C;color:#1B3A8C}
@keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
`;

/* ================================================================
   APP PRINCIPALE
   ================================================================ */
export default function DiagCheck() {
  const [agence, setAgence] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showDevis, setShowDevis] = useState(false);

  var STEPS = mode === "syndic" ? STEPS_SYNDIC : STEPS_PARTICULIER;
  var visibleSteps = useMemo(function() { return STEPS.filter(function(s) { return !s.showIf || s.showIf(answers); }); }, [STEPS, answers]);
  var currentStep = visibleSteps[step];
  var progress = step < 0 ? 0 : Math.round(((step + 1) / visibleSteps.length) * 100);

  var handleCode = useCallback(function() {
    var code = codeInput.trim().toUpperCase();
    if (AGENCES[code] !== undefined) {
      setAgence(AGENCES[code].nom ? AGENCES[code] : { nom: "Agence partenaire", email: AGENCES[code].email });
      setCodeValidated(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  }, [codeInput]);

  var handleOption = useCallback(function(field, value) {
    setAnswers(function(p) {
      var n = {};
      for (var k in p) n[k] = p[k];
      n[field] = value;
      // Cascade reset : supprimer les réponses des étapes suivantes
      var STEPS = mode === "syndic" ? STEPS_SYNDIC : STEPS_PARTICULIER;
      var found = false;
      for (var i = 0; i < STEPS.length; i++) {
        if (STEPS[i].field === field) { found = true; continue; }
        if (found) { delete n[STEPS[i].field]; }
      }
      return n;
    });
  }, [mode]);

  var handleNext = useCallback(function() {
    if (currentStep && currentStep.type === "number") {
      var val = parseInt(inputVal);
      if (!val) return;
      setAnswers(function(p) { var n = {}; for (var k in p) n[k] = p[k]; n[currentStep.field] = val; return n; });
      setInputVal("");
    }
    if (step < visibleSteps.length - 1) setStep(function(s) { return s + 1; });
    else { setAnswers(function(p) { var n = {}; for (var k in p) n[k] = p[k]; n.elec_age = getElecAge(p); return n; }); setShowResults(true); window.scrollTo(0, 0); }
  }, [currentStep, inputVal, step, visibleSteps.length]);

  var handleBack = useCallback(function() {
    if (step === 0) { setStep(-1); setAnswers({}); }
    else setStep(function(s) { return s - 1; });
  }, [step]);

  var reset = useCallback(function() {
    setMode(null); setStep(-1); setAnswers({}); setShowResults(false); setInputVal(""); setShowDevis(false); window.scrollTo(0, 0);
  }, []);

  var isImageChoice = currentStep && currentStep.type === "image_choice";
  var isNumberInput = currentStep && currentStep.type === "number";
  var canNext = isNumberInput ? inputVal.length >= 1 : (currentStep ? answers[currentStep.field] !== undefined : false);

  var finalAnswers = useMemo(function() { var n = {}; for (var k in answers) n[k] = answers[k]; n.elec_age = getElecAge(answers); return n; }, [answers]);

  var isLotsImmeuble = answers.type === "lots_immeuble";
  var lotsResult = useMemo(function() { return (showResults && isLotsImmeuble) ? computeDiagsLotsImmeuble(finalAnswers) : null; }, [showResults, isLotsImmeuble, finalAnswers]);

  var diags = useMemo(function() {
    if (!showResults) return [];
    if (isLotsImmeuble) return lotsResult ? lotsResult.obligatoires : [];
    if (mode === "syndic") return computeDiagsSyndic(finalAnswers);
    return computeDiagsParticulier(finalAnswers);
  }, [showResults, isLotsImmeuble, lotsResult, mode, finalAnswers]);

  var hasConsuel = answers.elec_consuel === "oui";
  var isMixte = answers.type === "immeuble" && answers.locaux_pro === true;
  var manquants = useMemo(function() { return diags.filter(function(d) { return d.manquant === true; }).length; }, [diags]);
  var okCount = useMemo(function() { return diags.filter(function(d) { return d.manquant === false; }).length; }, [diags]);

  var showCodeScreen = !codeValidated;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <svg width="38" height="38" viewBox="0 0 64 64" style={{flexShrink:0}}>
            <circle cx="32" cy="32" r="30" fill="#1B3A8C"/>
            <text x="32" y="34" fontFamily="'Raleway', sans-serif" fontWeight="900" fontSize="26" fill="white" textAnchor="middle" dominantBaseline="middle">DC</text>
          </svg>
          <div className="logo-name">Diag<span style={{color:GREEN}}>Check</span></div>
          {agence && <div style={{ marginLeft: "auto", background: GREEN_LIGHT, border: "1px solid " + GREEN + "40", borderRadius: 20, padding: "3px 12px", fontSize: 11, color: GREEN, fontWeight: 800 }}>🏢 {agence.nom}</div>}
        </header>

        <main className="main">

          {showCodeScreen && (
            <>
              <div className="hero">
                <h1>L'outil de vos<br /><em>diagnostics immobiliers.</em></h1>
                <p>Identifiez les diagnostics obligatoires avec le propriétaire en 2 minutes.</p>
              </div>
              <div className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: GREEN, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>🏢 Accès agent</div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20, lineHeight: 1.65 }}>
                  Saisissez votre code agence pour accéder à l'outil.
                </p>
                <input className="num-input" type="text" placeholder="Votre code agence" value={codeInput}
                  onChange={function(e) { setCodeInput(e.target.value.toUpperCase()); setCodeError(false); }}
                  onKeyDown={function(e) { if (e.key === "Enter") handleCode(); }}
                  style={{ textAlign: "center", fontSize: 18, letterSpacing: 3, marginBottom: 10 }} />
                {codeError && <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 10, fontWeight: 600 }}>Code non reconnu — vérifiez auprès de votre contact DiagCheck</div>}
                <button className="btn-next" onClick={handleCode}>Accéder →</button>
              </div>
            </>
          )}

          {!showCodeScreen && !mode && (
            <>
              <div className="hero">
                <h1>L'outil de vos<br /><em>diagnostics immobiliers.</em></h1>
                <p>Accompagnez le propriétaire — identifiez ensemble les diagnostics obligatoires en 2 minutes.</p>
              </div>
              <div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5, textAlign: "center", marginBottom: 14 }}>Quel est le profil du propriétaire ?</div>
                <div className="mode-btns">
                  <div className="mode-btn" onClick={function() { setMode("particulier"); setStep(0); }}>
                    <div className="mode-icon">🙋</div>
                    <div className="mode-label">Particulier</div>
                    <div className="mode-sub">Il vend ou loue son bien</div>
                  </div>
                  <div className="mode-btn" onClick={function() { setMode("syndic"); setStep(0); }}>
                    <div className="mode-icon">🏢</div>
                    <div className="mode-label">Syndic / Gestionnaire</div>
                    <div className="mode-sub">Il met sa copropriété en conformité</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {!showCodeScreen && mode && step >= 0 && !showResults && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: mode === "syndic" ? BLUE : GREEN, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, background: mode === "syndic" ? BLUE_LIGHT : GREEN_LIGHT, padding: "3px 10px", borderRadius: 20 }}>
                  {mode === "syndic" ? "🏢 Mode Syndic" : "🙋 Mode Particulier"}
                </span>
              </div>
              <div className="progress"><div className="progress-fill" style={{ width: progress + "%" }} /></div>
              <div className="card">
                <div className="step-num">Étape {step + 1} sur {visibleSteps.length}</div>
                <div className="step-q">{currentStep ? currentStep.question : ""}</div>
                {currentStep && currentStep.subtitle && <div className="step-sub">{currentStep.subtitle}</div>}

                {isImageChoice && currentStep && (
                  <div className="img-opts">
                    {currentStep.options.map(function(opt) {
                      return (
                        <div key={opt.value} className={"img-opt" + (answers[currentStep.field] === opt.value ? " sel" : "")} onClick={function() { handleOption(currentStep.field, opt.value); }}>
                          <BuildingIllustration svgKey={opt.svgKey} selected={answers[currentStep.field] === opt.value} />
                          <div className="img-opt-body">
                            <div className="img-opt-emoji">{opt.emoji}</div>
                            <div className="img-opt-label">{opt.label}</div>
                            <div className="img-opt-sub">{opt.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isImageChoice && !isNumberInput && currentStep && currentStep.options && (
                  <div className="opts">
                    {currentStep.options
                      .filter(function(opt) { return !opt.venteOnly || answers.transaction === "vente"; })
                      .map(function(opt) {
                      return (
                        <button key={String(opt.value)} className={"opt" + (answers[currentStep.field] === opt.value ? " sel" : "")} onClick={function() { handleOption(currentStep.field, opt.value); }}>
                          <div className="opt-icon">{opt.icon}</div>
                          {opt.label}
                          {opt.sub && <div className="opt-sub">{opt.sub}</div>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {isNumberInput && currentStep && (
                  <input className="num-input" type="number" placeholder={currentStep.placeholder} value={inputVal} onChange={function(e) { setInputVal(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter" && canNext) handleNext(); }} autoFocus />
                )}

                <div className="nav">
                  <button className="btn-back" onClick={handleBack}>← Retour</button>
                  <button className="btn-next" onClick={handleNext} disabled={!canNext}>
                    {step === visibleSteps.length - 1 ? "Voir mes diagnostics ✓" : "Suivant →"}
                  </button>
                </div>
              </div>
            </>
          )}

          {!showCodeScreen && showResults && (
            <>
              <div className="results-header">
                {mode === "syndic" ? (
                  <>
                    <h2>Conformité de votre copropriété 🏢</h2>
                    <div className="syndic-score">
                      <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                        <div><div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 28, fontWeight: 800, color: "#ef4444" }}>{manquants}</div><div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Manquants ⚠️</div></div>
                        <div style={{ width: 1, background: "#E2EAF8" }} />
                        <div><div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 28, fontWeight: 800, color: GREEN }}>{okCount}</div><div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>En règle ✅</div></div>
                        <div style={{ width: 1, background: "#E2EAF8" }} />
                        <div><div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 28, fontWeight: 800, color: BLUE }}>{diags.length}</div><div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Total</div></div>
                      </div>
                    </div>
                  </>
                ) : isLotsImmeuble ? (
                  <>
                    <h2>Vente de lots — mise en copropriété 🏗️</h2>
                    <div className="chips">
                      <div className="chip"><strong>{answers.nb_lots_vendus} lot{answers.nb_lots_vendus > 1 ? "s" : ""} en vente</strong></div>
                      {answers.usage_immeuble === "tertiaire" && <div className="chip pro">🏢 <strong>100% tertiaire</strong></div>}
                      {answers.usage_immeuble === "mixte" && <div className="chip pro">🏪 <strong>Mixte (hab. + pro)</strong></div>}
                      {answers.annee && <div className="chip">Construit <strong>{ANNEE_LABEL[answers.annee]}</strong></div>}
                    </div>
                  </>
                ) : (
                  <>
                    <h2>{diags.filter(function(d) { return d.id !== "TERMITES" || d.obligatoire; }).length} diagnostic{diags.filter(function(d) { return d.id !== "TERMITES" || d.obligatoire; }).length > 1 ? "s" : ""} à réaliser 📋</h2>
                    <div className="chips">
                      {answers.transaction && <div className="chip"><strong>{TRANS_LABEL[answers.transaction]}</strong></div>}
                      {answers.type && <div className="chip"><strong>{TYPE_LABEL[answers.type]}</strong></div>}
                      {answers.nb_lots && <div className="chip"><strong>{answers.nb_lots} logements</strong></div>}
                      {isMixte && <div className="chip pro">🏪 <strong>{answers.nb_locaux} local{answers.nb_locaux > 1 ? "aux" : ""} pro</strong></div>}
                      {answers.annee && <div className="chip">Construit <strong>{ANNEE_LABEL[answers.annee]}</strong></div>}
                    </div>
                  </>
                )}
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>Cliquez sur chaque diagnostic pour voir les détails et vérifier la validité avec le propriétaire 👇</p>
              </div>

              {hasConsuel && <div className="consuel-banner"><span style={{ fontSize: 20 }}>📄</span><span>Vous avez le Consuel → <strong>pas besoin de diagnostic électricité !</strong> Conservez-le précieusement.</span></div>}

              {isMixte && <div className="mixte-banner">🏗️ Immeuble mixte détecté — <strong>DPE collectif habitation</strong> et <strong>DPE(s) local(aux) pro séparés</strong> · Règles différentes !</div>}

              {answers.meuble === true && answers.transaction === "location" && <div style={{ background: BLUE_LIGHT, border: "1.5px solid " + BLUE + "30", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: BLUE, fontWeight: 700 }}>🛏️ Location meublée : pas de mesurage Boutin obligatoire, mais <strong>la surface habitable doit figurer au bail</strong>.</div>}

              {answers.transaction === "location" && answers.type === "maison" && anneeVal(answers.annee) < 1997 && <div style={{ background: BLUE_LIGHT, border: "1.5px solid " + BLUE + "30", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: BLUE, fontWeight: 700 }}>🏠 Maison individuelle en location : <strong>pas de diagnostic amiante obligatoire</strong> (ni CAV, ni DAPP). Le DAPP ne concerne que les logements en immeuble collectif (copropriété ou monopropriété).</div>}

              {isLotsImmeuble && (
                <div style={{ background: "#FEF9C3", border: "1.5px solid #FCD34D", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800, fontSize: 14, color: "#92400e", marginBottom: 8 }}>📐 D'abord, le géomètre — avant tout le reste !</div>
                  <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.7 }}>Avant de commander les diagnostics, votre géomètre doit réaliser l'<strong>État Descriptif de Division (EDD)</strong> — c'est lui qui crée officiellement les lots et donne naissance à la copropriété. Il réalise également la <strong>Loi Carrez</strong> (fortement conseillée) sur chaque lot en même temps.</p>
                  <div style={{ fontSize: 12, color: "#92400e", marginTop: 8, fontWeight: 700 }}>⚠️ Le DTG (ci-dessous) n'est réalisé qu'après l'EDD — dans cet ordre.</div>
                </div>
              )}

              <div className="diags-list">
                {diags.map(function(d, i) { return <DiagCard key={d.id} diag={d} index={i} syndic={mode === "syndic"} />; })}
              </div>

              {isLotsImmeuble && lotsResult && lotsResult.optionsNotaire && lotsResult.optionsNotaire.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ flex: 1, height: 1, background: "#E2EAF8" }} />
                    <div style={{ fontSize: 11, color: BLUE, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, whiteSpace: "nowrap" }}>⚖️ Ce que votre notaire peut demander en plus</div>
                    <div style={{ flex: 1, height: 1, background: "#E2EAF8" }} />
                  </div>
                  <div style={{ background: BLUE_LIGHT, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>Ces diagnostics ne sont pas systématiquement obligatoires à ce stade, mais <strong>certains notaires les exigent</strong> lors d'une mise en copropriété. Mieux vaut les anticiper.</p>
                  </div>
                  <div className="diags-list">
                    {lotsResult.optionsNotaire.map(function(d, i) { return <DiagCard key={d.id} diag={d} index={i} syndic={false} />; })}
                  </div>
                </div>
              )}

              <div className="cta">
                <h3>{mode === "syndic" ? "On met la copropriété en conformité ? 🏢" : isLotsImmeuble ? "On prépare le dossier ? 🏗️" : "Demander un devis pour le propriétaire 🤝"}</h3>
                <p>Renseignez les coordonnées du propriétaire — on s'occupe du reste.</p>
                <button className="cta-btn" onClick={function() { setShowDevis(true); }}>📋 Demander un devis gratuit</button>
              </div>

              <button className="reset" onClick={reset}>↩ Recommencer depuis le début</button>
              <div style={{ textAlign: "center", marginTop: 24, paddingTop: 16, borderTop: "1px solid #E2EAF8" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>DiagCheck — Diagnostics immobiliers</div>
              </div>
            </>
          )}
        </main>

        {showDevis && (
          <div className="modal-overlay" onClick={function(e) { if (e.target === e.currentTarget) setShowDevis(false); }}>
            <div className="modal">
              <div className="modal-handle" />
              <button onClick={function() { setShowDevis(false); }} style={{ position: "absolute", top: 16, right: 16, background: "#F8FAFF", border: "1.5px solid #E2EAF8", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#94a3b8", fontFamily: "inherit", transition: "all 0.2s" }}>✕</button>
              <DevisForm diags={diags} answers={finalAnswers} mode={mode} agence={agence} onClose={function() { setShowDevis(false); }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
