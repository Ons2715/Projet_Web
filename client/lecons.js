const LeçonS = [
  {
    id: "Leçon1",
    name: "Leçon 1",
    category: "Croisement",
    step: "1.0 Introduction",
    progress: "0 / 3",
    summary: "Introduction aux croisements et priorites simples.",
    cover: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        type: "paragraph",
        text: `<h3 style="color: #007bff;">OBJECTIF DE LA SECTION</h3>
<pre>Sur la route, on croise une multitude d'usagers dans une multitude de cas.
Dans cette section, vous aller apprendre comment vous devez vous comporter face
a ces situations :

. routes avec obstacle (travaux ... )
. Chaussee retrecie
. Croisement difficile sur les routes a forte declivite.

La question qui se pose : Qui passe le premier ?

Pour y repondre, vous devez connaitre les regles precises a appliquer, souvent
en absence de signalisation. Le croisement est la position de deux vehicules
circulants en sens opposes sur deux voies differentes dans une meme chaussee.
Le croisement s'effectue a droite (On se trouve toujours a droite par rapport a l'autre).</pre>`,
      },
      { type: "image", src: "coisement1.png", alt: "Illustration de croisement" },
      {
        type: "paragraph",
        text: `<pre>Tout conducteur doit, en cas de croisement, laisser une distance laterale suffisante
et si necessaire, serrer a son extreme droite.

=> En cas d'empechement, du fait d'un obstacle quelconque, il doit reduire sa vitesse
et au besoin, s'arreter (si obstacle de son cote) pour permettre aux usagers venant
en sens inverse de passer. (Vehicule en stationnement sur la chaussee, travaux ... ).

=> Si j'ai un obstacle de mon cote, je dois laisser la priorite de passage aux vehicules
venant en sens inverse. DONC RALENTIR VOIR M'ARRETER.
Ici la voiture rouge (en infraction) garee sur le trottoir, constitue un obstacle de mon
cote. Je dois donc ralentir, voir meme m'arreter, pour laisser la priorite de passage
a la voiture venant en sens inverse.

Cas de route étroite

Passage étroit, absence de signalisation : le véhicule le plus encombrant (plus de 2m de large ou
plus de 7m de long remorque comprise) cède le passage au véhicule de dimension inférieur.

Exception : en agglomération, il faut céder le
passage aux vehicules de transport en
commun.</pre>`,
      },
      { type: "image", src: "photo2.png", alt: "Illustration de croisement" },
    {
        type: "paragraph",
        text: `<pre>
Ici, à cet endroit rétréci de la chaussée, je dois céder le passage
 à ce véhicule de transport en commun.

Croisements sur les routes de montagne et à forte déclivité
Dans une route de montagne et a forte déclivité, le véhicule 
descendant cède le passage aux véhicules montants.
Ici, sur cette route étroite et à forte déclivité,
je cède le passage à La voiture jaune montante .</pre>`},
      { type: "image", src: "photo3.png", alt: "Illustration de croisement" },

      
    ],
  },
  {
    id: "Leçon2",
    name: "Leçon 2",
    category: "Vitesse",
    step: "2.0 Introduction",
    progress: "0 / 3",
    summary: "Regles de vitesse en ville, route et autoroute.",
    cover: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
    content: [
      {
        type: "paragraph",
        text: `<h3 style="color: #007bff;">OBJECTIF DE LA SECTION</h3>
<pre>Pour rester maitre de son vehicule comme l'exige le code de la route, il est necessaire
de savoir evaluer la distance necessaire pour arreter son vehicule dans une situation
d'urgence.
Se donner les moyens de maitriser sa vitesse permet d'augmenter la securite de chacun.
Dans cette section vous aller apprendre comment calculer :
* la distance d'arret
* la distance de reaction
* la distance de securite
<h3>Qu'est ce que la distance d'arret ?</h3>

</pre>`,},
      { type: "image", src: "distance1.png", alt: "Illustration de distance d'arret" },
      {
        type: "paragraph",
        text: `<pre><h4 style="color: #007bff;">La distance d'arret</h4> est la distance que parcourt le vehicule entre le moment ou le conducteur
percoit un danger et le moment ou le vehicule s'arrete completement.
<h4 style="color: #007bff;">Le temps de réaction</h4> est la durée entre le moment où le conducteur réalise la présence de
l'obstacle et celui où les freins commencent à réagir.
Cette durée peut augmenter avec la fatigue ou la consommation d'alcool ou de certains
médicaments.
<h4 style="color: #007bff;">Calcul de la distance de réaction</h4> 
Pendant le temps de réaction, le véhicule continu à rouler avec la même vitesse et parcourt une
distance appelée distance de réaction.
Distance de réaction en m/s = ( vitesse en km/h/10) * 3
( avec temps de réaction =1s )
Exemple
A 50 km/h, je parcours environ 5 * 3 = 15 m à la seconde
A 70 km/h, je parcours environ 7 * 3 = 21 m à la seconde
Qui influence la distance de freinage ?:
C'est essentiellement la vitesse qui influence la distance de freinage.
=>La distance varie selon le carré de la vitesse.
C'est aussi, l'humidité de la route, le type de revêtement routier (lisse ou rugueux l'état du
matériel de freinage, l'état de la surface des pneus (lisses ou pas ... ).
<h4 style="color: #007bff;">Cas de réduction de vitesse</h4>
- conditions de visibilité insuffisante
- Virages et sections de route étroites ...
- Sommet de côtes (risque de fin de dépassement en face)
- Intersections (même avec la priorité)
- à l'approche des casernes et sorties d'usines
- lors du croisement ou dépassement d'un groupe de piéton
- lors du croisement ou dépassement d'animaux de trait, de charge
- à l'approche des véhicules du transport des personnes lorsque les passagers sont entrain de
monter ou de descendre
- à l'approche des stations de transport
- à l'approche des passages pour piétons.
- Au panneau de limitation de vitesse
- Entrée d'agglomération.
</pre>`,
      },
            { type: "image", src: "vitesse1.png", alt: "Illustration de distance d'arret" },

    ],
  },
  { id: "Leçon3", name: "Leçon 3", category: "Panneaux de signalisation", step: "3.0 Introduction", progress: "0 / 3", summary: "Reconnaissance des panneaux de danger et obligation.", cover: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80", content: [
    { type: "paragraph", text:`<pre> <h4 style="color: #007bff;">Forme et couleur</h4>
Ils ont une forme ronde avec un fond bleu entoure ou barre par
du rouge. Ces panneaux interdisent ou réglementent le stationnement ou
l'arrêt dans un lieu et un temps déterminé </pre>` , },
      { type: "image", src: "pan1.png", alt: "Illustration de distance d'arret" },
] },
  { id: "Leçon4", name: "Leçon 4", category: "Priorites", step: "4.0 Introduction", progress: "0 / 3", summary: "Comprendre la priorite a droite et les ceders le passage.", cover: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 4. Tu pourras y mettre les cas de priorite et les exceptions importantes." }] },
  { id: "Leçon5", name: "Leçon 5", category: "Stationnement", step: "5.0 Introduction", progress: "0 / 3", summary: "Les bases du stationnement et des interdictions.", cover: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 5. Remplace par tes notions sur l'arret, le stationnement et les interdictions." }] },
  { id: "Leçon6", name: "Leçon 6", category: "Depassement", step: "6.0 Introduction", progress: "0 / 3", summary: "Quand depasser et comment le faire en securite.", cover: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 6. Mets ici les regles du depassement, les controles et les interdictions." }] },
  { id: "Leçon7", name: "Leçon 7", category: "Autoroute", step: "7.0 Introduction", progress: "0 / 3", summary: "Conduire sur autoroute et respecter les distances.", cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 7. Ajoute ici les regles de conduite sur autoroute." }] },
  { id: "Leçon8", name: "Leçon 8", category: "Alcool", step: "8.0 Introduction", progress: "0 / 3", summary: "Limiter les risques lies a l'alcool et aux drogues.", cover: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 8. Ajoute ici les taux limites et les sanctions possibles." }] },
  { id: "Leçon9", name: "Leçon 9", category: "Mecanique", step: "9.0 Introduction", progress: "0 / 3", summary: "Les controles de base du vehicule avant conduite.", cover: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 9. Mets ici les points de verification avant de conduire." }] },
  { id: "Leçon10", name: "Leçon 10", category: "Securite", step: "10.0 Introduction", progress: "0 / 3", summary: "Ceinture, distance de securite et vigilance.", cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 10. Tu pourras y mettre les bons reflexes et les equipements obligatoires." }] },
  { id: "Leçon11", name: "Leçon 11", category: "Eco conduite", step: "11.0 Introduction", progress: "0 / 3", summary: "Adopter une conduite economique et plus souple.", cover: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 11. Ajoute ici les conseils d'eco conduite et d'anticipation." }] },
  { id: "Leçon12", name: "Leçon 12", category: "Examens", step: "12.0 Introduction", progress: "0 / 3", summary: "Preparation finale aux questions type examen.", cover: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80", content: [{ type: "paragraph", text: "Contenu de Leçon 12. Remplace par une synthese de preparation finale a l'examen." }] }
];

function renderLeçons(filter = "") {
  const query = filter.toLowerCase();
  const filtered = LeçonS.filter((Leçon) =>
    Leçon.name.toLowerCase().includes(query) || Leçon.category.toLowerCase().includes(query)
  );

  document.getElementById("Leçons-list").innerHTML = filtered.map((Leçon) => `
    <button class="Leçon-row" data-Leçon-id="${Leçon.id}" type="button" onclick="openLeçon('${Leçon.id}')">
      <div>
        <span class="Leçon-row-title">${Leçon.name}</span>
        <span class="Leçon-row-category">${Leçon.category}</span>
      </div>
      <span class="Leçon-row-progress">${Leçon.progress}</span>
    </button>
  `).join("");

  if (filtered.length) {
    openLeçon(filtered[0].id);
  }
}

function openLeçon(id) {
  const Leçon = LeçonS.find((item) => item.id === id);
  if (!Leçon) return;

  document.querySelectorAll(".Leçon-row").forEach((row) => {
    row.classList.toggle("active", row.dataset.LeçonId === id);
  });

  document.getElementById("Leçon-step").textContent = Leçon.step;
  document.getElementById("Leçon-title").textContent = Leçon.name;
  document.getElementById("Leçon-summary").textContent = Leçon.summary;
  document.getElementById("Leçon-category").textContent = Leçon.category;
  document.getElementById("Leçon-progress").textContent = Leçon.progress;
  renderLeçonContent(Leçon.content || []);
  document.getElementById("Leçon-hero").style.backgroundImage = `linear-gradient(180deg, rgba(11, 28, 48, 0.2), rgba(11, 28, 48, 0.72)), url('${Leçon.cover}')`;
}

function renderLeçonContent(blocks) {
  const container = document.getElementById("Leçon-text");
  container.innerHTML = blocks.map((block) => {
    if (block.type === "subtitle") {
      return `<h3 class="Leçon-rich-subtitle">${block.text}</h3>`;
    }
    if (block.type === "image") {
      return `<img class="Leçon-rich-image" src="${block.src}" alt="${block.alt || ""}">`;
    }
    return `<div class="Leçon-rich-paragraph">${block.text}</div>`;
  }).join("");
}

document.getElementById("Leçon-search").addEventListener("input", function () {
  renderLeçons(this.value.trim());
});

const LeçonsUser = Auth.get();
const LeçonsNameLabel = document.getElementById("Leçons-name-label");
const LeçonsFormationBadge = document.getElementById("Leçons-formation-badge");

if (LeçonsUser && (LeçonsUser.firstName || LeçonsUser.lastName) && LeçonsNameLabel) {
  LeçonsNameLabel.textContent = `${LeçonsUser.firstName || ""} ${LeçonsUser.lastName || ""}`.trim();
}
if (LeçonsUser && LeçonsUser.formation && LeçonsFormationBadge) {
  LeçonsFormationBadge.textContent = LeçonsUser.formation;
}

document.getElementById("Leçons-logout-link").addEventListener("click", function () {
  Auth.clear();
});

renderLeçons();