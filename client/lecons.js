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
  {
  id: "Leçon4",
  name: "Leçon 4",
  category: "Priorités",
  step: "4.0 Introduction",
  progress: "0 / 3",
  summary: "Comprendre la priorité à droite et les céder le passage.",
  cover: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  content: [
    {
      type: "paragraph",
      text: `<h3 style="color: #007bff;">OBJECTIF DE LA SECTION</h3>
<pre>L'intersection est certainement la situation qui nécessite la plus grande vigilance et le
plus grand respect des règles implicites et explicites : (priorité à droite, les feux, le stop,
le céder le passage).

Définir les règles de priorités dans les différents cas d'intersections à savoir :
* Les intersections avec et sans panneaux
* En rond-point
* Avec des feux

Chacune de ces intersections est régie par des règles précises que vous devez apprendre
et appliquer. Ceci permettra d'assurer:
- Une meilleure fluidité de la circulation
- La sécurité de tous les usagers de la route

<h3>Qu'est ce qu'une intersection ?</h3>

</pre>`
    },
    {
      type: "image",
      src: "photo4.png",
      alt: "Illustration d'une intersection"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Actions à effectuer lors du franchissement d'une intersection</h4>
L'automobiliste doit :
- Ralentir
- S'assurer que la route est libre
- Observer les autres automobilistes afin de déterminer leurs intentions
- Respecter les règles de priorités de passage

<h4 style="color: #007bff;">La priorité à droite sans signalisation</h4>
Tout conducteur lors du franchissement d'une intersection sans signalisation doit céder le
passage aux véhicules venant de sa droite.

Règle : À une intersection sans signalisation, les véhicules venant de la droite ont la priorité.
Distance de vigilance : Vérifiez constamment votre droite à l'approche de l'intersection.

<h4 style="color: #007bff;">Le panneau "Cédez le passage"</h4>
Ce panneau annonce la proximité d'une intersection où vous devez céder le passage aux
véhicules venant de droite.

Règle : On doit céder le passage à gauche et à droite sans nécessairement s'arrêter si la
route est libre. La ligne de cédez le passage est discontinue.

Caractéristiques du panneau:
- Forme : Triangle inversé
- Couleur : Fond blanc avec bordure rouge
- Position : Avant l'intersection

<h4 style="color: #007bff;">Cas où vous devez réduire la vitesse</h4>
- À l'approche d'une intersection
- À la présence d'un panneau "Cédez le passage"
- À la présence d'un panneau "Stop"
- En cas de visibilité insuffisante
- Lors du croisement ou dépassement de piétons
- À l'approche des passages pour piétons
- En conditions de route mouillée ou glissante
- À l'entrée d'agglomération
- Lors du croisement de véhicules prioritaires (ambulance, pompiers, police)
</pre>`
    },
    {
      type: "image",
      src: "photo5.png",
      alt: "Illustration des règles de priorité"
    }
  ]
  },
  {
  id: "Leçon5",
  name: "Leçon 5",
  category: "Stationnement",
  step: "5.0 Introduction",
  progress: "0 / 3",
  summary: "Les bases du stationnement et des interdictions.",
  cover: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80",
  content: [
    {
      type: "paragraph",
      text: `<h3 style="color: #007bff;">OBJECTIF DE LA SECTION</h3>
<pre>Vous apprendrez à distinguer l'arrêt du stationnement.

Vous devez savoir où vous pouvez vous garer, que vous soyez :
. en agglomération ou non
. sur une route à double sens ou à sens unique

Vous apprendrez également les stationnements interdits et les panneaux
d'interdiction à reconnaître.

La question qui se pose : Où puis-je me garer en toute sécurité et légalité ?

Pour y répondre, vous devez connaître les règles précises à appliquer selon
le contexte routier. Le stationnement est l'immobilisation d'un véhicule en
dehors de la circulation active.</pre>`
    },
    {
      type: "image",
      src: "photo6.png",
      alt: "Illustration de stationnement"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Définition : arrêt et stationnement</h4>

Un véhicule est dit <strong>à l'arrêt</strong> lorsqu'il est immobilisé pendant le temps
nécessaire pour prendre ou déposer des personnes ou charger ou décharger des
marchandises, le conducteur restant au volant ou à proximité immédiate du véhicule
pouvant le déplacer.

Toute autre immobilisation sur la route avec le moteur arrêté est considérée comme
un <strong>stationnement</strong>.

L'arrêt ou le stationnement de tout véhicule sur la route ou ses dépendances ne doit
pas constituer un danger pour les usagers de la route, ni causer une gêne pour la
circulation et ne doit pas entraver l'accès aux propriétés riveraines.

Le stationnement abusif et l'arrêt dangereux ou gênants sont interdits.
Est considéré comme stationnement abusif tout stationnement, de manière continue et
au même endroit de la route et ses dépendances pour une durée dépassant 7 jours.</pre>`
    },
    {
      type: "image",
      src: "photo8.png",
      alt: "Différence entre arrêt et stationnement"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Arrêt et stationnement en agglomération</h4>

Vous devez savoir où vous pouvez vous garer en agglomération :

<strong>Stationnement possible en agglomération :</strong>
- À proximité du trottoir à moins de 30 cm
- Dans le sens de la marche
- À droite dans les rues à double sens
- À droite ou à gauche dans les rues à sens unique (sauf exceptions)

<strong>Interdictions en agglomération :</strong>
- Le stationnement abusif est interdit (plus de 7 jours au même endroit)
- L'arrêt dangereux ou gênant est interdit
- Devant les entrées de propriétés, garages, parkings
- En double file
- À proximité immédiate des intersections

=> En agglomération, respectez toujours la distance minimale de 30 cm avec le trottoir
et stationnez dans le sens de la circulation.</pre>`
    },
    {
      type: "image",
      src: "photo9.png",
      alt: "Illustration de stationnement en agglomération"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Arrêt et stationnement hors agglomération</h4>

L'arrêt et le stationnement sont possibles :
- Sur accotement ou emplacement prévu
- Sans gêner la circulation
- En respectant une distance minimale avec la chaussée

=> Un marquage jaune discontinu ou un panneau peut interdire l'arrêt ou le stationnement.
=> Consultez toujours les panneaux et marquages locaux avant de vous garer.

Cas spécifiques hors agglomération :
- Sur les routes à forte circulation, préférez les aires de repos aménagées
- Évitez de vous garer sur les portions à visibilité réduite
- Ne stationnez jamais sur les voies d'urgence</pre>`
    },
    {
      type: "image",
      src: "photo10.png",
      alt: "Illustration de stationnement hors agglomération"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Stationnement interdit - Cas courants</h4>

Le stationnement est formellement interdit :
- À proximité des travaux
- En double file
- Devant les entrées de propriétés, garages, parkings
- Devant les passages pour piétons
- Devant les entrées de casernes, hôpitaux
- Sur les places réservées aux personnes handicapées (sans autorisation)
- Sur les voies d'urgence

=> Ici, ce véhicule stationné en double file crée un danger et gêne la circulation.
Ce stationnement est illégal et dangereux.

=> Ici, ce véhicule stationné devant l'entrée d'un garage empêche l'accès à la propriété.
Ce stationnement est interdit et peut entraîner une amende.</pre>`
    },
    {
      type: "image",
      src: "photo12.png",
      alt: "Exemples de stationnement interdit"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Panneaux d'interdiction de stationnement</h4>

<strong>Panneau « Interdiction de stationner du 1er au 15 du mois »</strong>
- Forme : Rond avec symbole P barré
- Couleur : Fond bleu avec barre rouge
- Signification : Vous ne pouvez stationner que du 16 à la fin du mois

<strong>Panneau « Interdiction de stationner du 16 à la fin du mois »</strong>
- Forme : Rond avec symbole P barré
- Couleur : Fond bleu avec barre rouge
- Signification : Vous ne pouvez stationner que du 1er au 15 du mois

<strong>Panneau « Interdiction totale de stationner »</strong>
- Forme : Rond avec P barré
- Couleur : Fond blanc avec bordure rouge
- Signification : Stationnement complètement interdit

=> Consultez toujours les panneaux avant de stationner. Une amende peut vous être
infligée si vous ne respectez pas ces interdictions.</pre>`
    },
    {
      type: "image",
      src: "photo11.png",
      alt: "Panneaux d'interdiction de stationnement"
    }
  ]
},
 {
  id: "Leçon6",
  name: "Leçon 6",
  category: "Dépassement",
  step: "6.0 Introduction",
  progress: "0 / 3",
  summary: "Quand dépasser et comment le faire en sécurité.",
  cover: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  content: [
    {
      type: "paragraph",
      text: `<h3 style="color: #007bff;">OBJECTIF DE LA SECTION</h3>
<pre>Tout comme l'intersection, le dépassement est une action qui requiert toute la
vigilance du conducteur.

Vous allez apprendre dans cette section comment entreprendre un dépassement et
tenir compte d'un certain nombre de facteurs afin de l'aborder sereinement.

Tout conducteur voulant effectuer un dépassement doit s'assurer qu'il peut le faire
sans danger.

La question qui se pose : Quand puis-je dépasser en toute sécurité ?

Pour y répondre, vous devez connaître les règles précises, les distances de sécurité
et les cas d'interdiction. Le dépassement est une manœuvre délicate qui demande de
la concentration et une bonne évaluation des risques.</pre>`
    },
    {
      type: "image",
      src: "photo13.png",
      alt: "Illustration de dépassement"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Règle générale du dépassement</h4>

Le dépassement s'effectue par la gauche.

=> Vous devez toujours dépasser par la gauche sauf dans les cas particuliers et
autorisés. C'est la règle fondamentale qui garantit la sécurité de tous.

<h4 style="color: #007bff;">Exception : le dépassement par la droite</h4>

Il est autorisé lorsque le véhicule qui vous précède a annoncé ou a entamé un
changement de direction vers la gauche.

Vous pouvez aussi dépasser par la droite une voiture qui manifeste son intention
de tourner à gauche en activant son clignotant gauche.

=> Cette exception ne s'applique que dans ces cas précis. Vous devez observer
attentivement les intentions du véhicule qui vous précède.</pre>`
    },
    {
      type: "image",
      src: "photo14.png",
      alt: "Illustration du dépassement par la droite"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Chaussées à trois voies et double sens de circulation</h4>

Les dépassements s'effectuent uniquement en utilisant la voie centrale (entre les
deux sens de circulation).

La voie de gauche ne doit jamais être empruntée car elle est réservée aux véhicules
venant en sens inverse.

La voie de milieu peut être utilisée uniquement si elle est libre et surtout si elle
est nécessaire pour le dépassement.

=> Sur une route à trois voies, vous ne disposez que d'une seule voie pour dépasser.
Soyez particulièrement vigilant car vous croisez les véhicules venant en sens inverse.</pre>`
    },
    {
      type: "image",
      src: "photo15.png",
      alt: "Illustration d'une route à trois voies"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Distance latérale de sécurité</h4>

Dans tous les cas, la distance latérale doit être au minimum :

- 1 m lors du dépassement d'un piéton, d'un véhicule à traction animale, d'un animal,
d'un cycle ou d'un motocycle à deux roues

- 0,5 m lors du dépassement des autres véhicules

=> Ces distances minimales garantissent que vous laissez assez d'espace au véhicule
ou à l'usager que vous dépassez. Ne pas respecter ces distances est dangereux et
passible d'amende.</pre>`
    },
    {
      type: "image",
      src: "photo16.png",
      alt: "Illustration de la distance latérale de sécurité"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Avant de dépasser - Les vérifications essentielles</h4>

S'assurer de l'absence d'un cas d'interdiction de dépassement
S'assurer que la voie est libre sur une distance suffisante pour effectuer la
manœuvre sans danger
S'assurer que le conducteur du véhicule devant vous ne manifeste aucune intention
de dépasser
S'assurer que vous pouvez reprendre votre place sans danger

Lorsque la visibilité est bonne, qu'aucun véhicule n'est en train de vous dépasser
et que le marquage au sol le permet, le dépassement est autorisé.

=> Avant chaque dépassement, prenez le temps de vérifier tous ces points. Une bonne
évaluation de la situation évitera les risques d'accident.</pre>`
    },
    {
      type: "image",
      src: "photo17.png",
      alt: "Illustration des vérifications avant dépassement"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Pendant et après le dépassement</h4>

Maintenir une distance latérale suffisante et augmenter légèrement la vitesse.

Vérifier le rétroviseur intérieur et, lorsque le véhicule dépassé apparaît dedans,
se rabattre progressivement en sécurité (éventuellement avec le clignotant droit).

Lors d'un dépassement, il faut occuper la voie de gauche le moins longtemps possible.
La différence de vitesse doit être d'au moins 20 km/h pour que la manœuvre reste
courte.

=> Plus la manœuvre est rapide, plus elle est sûre. Augmentez légèrement la vitesse
pour raccourcir le temps passé sur la voie de gauche.

Si un autre usager vous dépasse, vous devez faciliter la manœuvre en restant à
droite, à allure régulière et sans augmenter votre vitesse.

=> Facilitez le dépassement des autres conducteurs. C'est une question de respect
mutuel et de sécurité routière.</pre>`
    },
    {
      type: "image",
      src: "photo18.png",
      alt: "Illustration pendant le dépassement"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Dépassement la nuit</h4>

Passer des feux de route aux feux de croisement dès que le véhicule en sens inverse
arrive à hauteur.

=> La nuit, réduisez l'éblouissement du véhicule qui vous croise en passant aux feux
de croisement. Cela améliore la sécurité pour tous les usagers.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Interdiction de dépasser - Cas formels</h4>

Il est interdit de dépasser :

- À l'approche des sommets de côte
- Aux intersections où la priorité est réglementée (Stop, cédez-le-passage, feu rouge)
- Dans les virages
- Sur les ponts étroits à deux voies maximum
- Aux passages à niveau avec barrières ou demi-barrières
- Lorsque la signalisation ou le marquage au sol l'interdit

=> Ces interdictions existent pour votre sécurité et celle des autres. Le non-respect
peut entraîner un accident grave et des poursuites judiciaires.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Panneau d'interdiction de dépassement - Exemple 1</h4>

À partir de ce panneau, le dépassement est interdit à tous les véhicules à moteur
sauf les deux-roues sans side-car.

En agglomération, si l'interdiction est placée à l'entrée, elle prend fin à la sortie
de l'agglomération.

=> Respectez toujours les panneaux d'interdiction. Ils délimitent les zones à risque
où le dépassement serait dangereux.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Signalisation horizontale - Exemple 2</h4>

Une ligne continue interdit tout dépassement ainsi que tout chevauchement.

=> Le marquage au sol est tout aussi important que les panneaux. Une ligne continue
blanche signifie : « Pas de dépassement ». Respectez cette règle strictement.

Ici, le dépassement est interdit en raison de la ligne continue. Vous devez rester
à votre place et attendre une zone de dépassement autorisé (marquage pointillé).</pre>`
    },
  ]
},
 {
  id: "Leçon7",
  name: "Leçon 7",
  category: "Autoroute",
  step: "7.0 Introduction",
  progress: "0 / 3",
  summary: "Conduire sur autoroute et respecter les distances.",
  cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  content: [
    {
      type: "paragraph",
      text: `<h3 style="color: #007bff;">OBJECTIF DE LA SECTION</h3>
<pre>Sur autoroute, la circulation est plus sûre que sur la route, car on ne rencontre
pas d'intersection et on ne croise pas d'autres usagers. De plus, les virages sont
moins prononcés et les obstacles latéraux moins nombreux.

Cependant, les vitesses sont plus élevées et il est nécessaire de maîtriser de
nouvelles techniques de conduite.

Vous allez apprendre dans cette section :
. les règles de circulation spécifiques à l'autoroute
. les bonnes pratiques pour entrer et sortir de l'autoroute
. comment maintenir une distance de sécurité appropriée
. comment adapter votre vitesse aux conditions

La question qui se pose : Comment conduire en toute sécurité sur autoroute ?

Pour y répondre, vous devez connaître les règles précises, les usagers non autorisés,
et les techniques de gestion de la vitesse et des distances.</pre>`
    },
    {
      type: "image",
      src: "photo19.png",
      alt: "Illustration d'une autoroute"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Entrée et sortie de l'autoroute</h4>

<strong>Entrée sur autoroute</strong>
L'entrée sur autoroute s'effectue par la bretelle d'accès qui est prolongée par une
voie d'accélération.

=> Utilisez la voie d'accélération pour augmenter progressivement votre vitesse et
vous adapter au flux de circulation de l'autoroute.

<strong>Sortie de l'autoroute</strong>
Une sortie est la division de l'autoroute en deux branches dont l'une est la prolongation
de l'autoroute et l'autre un raccordement au réseau routier.

<strong>Bretelle de sortie</strong>
La bretelle permet aux véhicules de quitter l'autoroute en toute sécurité et de rejoindre
une autre route.

=> Signalez votre intention de quitter l'autoroute suffisamment tôt avec vos clignotants.
Réduisez progressivement votre vitesse sur la bretelle de sortie.</pre>`
    },
    {
      type: "image",
      src: "photo20.png",
      alt: "Illustration d'une entrée et sortie d'autoroute"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Usagers dont l'accès à l'autoroute est interdit</h4>

Les usagers qui se déplacent à une vitesse trop réduite ne sont pas autorisés sur
l'autoroute :

. Les piétons
. Les vélos
. Les cyclomoteurs (mobylettes et scooters)
. Les tracteurs agricoles et matériel de travaux publics
. Les animaux et cavaliers
. Les véhicules à traction non mécanique
. Les véhicules à propulsion mécanique non immatriculés
. Les ensembles de véhicules ne pouvant circuler qu'avec une autorisation spéciale
. Les véhicules automobiles ou ensembles de véhicules ne pouvant pas atteindre une
vitesse minimale de 60 km/h

=> L'autoroute n'est réservée qu'aux véhicules motorisés pouvant maintenir une vitesse
minimale. Respectez cette règle pour la sécurité de tous.</pre>`
    },
    {
      type: "image",
      src: "photo22.png",
      alt: "Illustration des usagers non autorisés sur autoroute"
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Les règles de circulation sur autoroute</h4>

<strong>Il est interdit d'effectuer les opérations suivantes :</strong>

. Circuler sur les bandes d'arrêt d'urgence
. L'usage du terre-plein central séparant les deux chaussées (arrêt ou stationnement)
. La marche arrière
. Le demi-tour
. L'arrêt ou le stationnement sur la chaussée et les accotements sauf nécessité absolue

=> Ces interdictions existent pour garantir la fluidité et la sécurité de la circulation.

<strong>En cas de panne sur l'autoroute :</strong>
Le conducteur doit signaler le véhicule par un triangle de danger placé derrière le
véhicule à une distance minimale de 100 mètres.

=> En cas de panne, quittez l'autoroute et cherchez une aire de repos. Si c'est impossible,
mettez en place le triangle de danger et restez en sécurité en dehors du flux de circulation.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Avant de changer de file</h4>

Avant chaque changement de file, vous devez :

. Vérifier dans les rétroviseurs que la voie est libre
. Signaler votre manœuvre avec les feux clignotants
. Observer la file de gauche
. Vous rabattre après le dépassement

=> Un changement de file soudain sans vérification peut causer un accident grave.
Prenez toujours le temps de vérifier et de signaler votre intention.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Dépassement sur autoroute</h4>

Le dépassement d'un autre véhicule s'effectue obligatoirement par la gauche.

Après dépassement, le conducteur doit se rabattre sur la voie de droite.

=> Le dépassement par la droite est formellement interdit sur autoroute. Dépasser
uniquement par la gauche et regagnez votre voie dès que possible.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Vitesse et distance de sécurité</h4>

Adaptez en permanence votre vitesse au trafic, à la circulation et à la météo.

Respectez une distance de sécurité suffisante avec le véhicule qui vous précède.

=> La distance de sécurité est votre "coussin de protection". Plus vous allez vite,
plus vous devez laisser de distance. En cas de freinage brusque, cette distance
vous permet d'éviter une collision.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Vitesses limites en Tunisie</h4>

. 110 km/h par temps sec et bonne visibilité
. 90 km/h par temps de pluie
. La vitesse minimale ne doit pas être inférieure à 60 km/h

=> Respectez ces limites. Elles sont établies en fonction des conditions de sécurité
et de traction des véhicules.

<h4 style="color: #007bff;">Vitesses limites en France</h4>

. 130 km/h par temps sec et bonne visibilité
. 110 km/h par temps de pluie
. 100 km/h si le véhicule tracte une remorque

=> Si vous conduisez à l'étranger, respectez les limitations de vitesse du pays
où vous vous trouvez.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Distance de sécurité - Le marquage au sol</h4>

Le marquage au sol appelé "un trait – deux traits – sécurité" indique la distance
à maintenir avec le véhicule qui vous précède afin d'éviter toute collision en cas
de freinage brusque.

=> Utilisez ce marquage comme repère visuel. Lorsque le véhicule qui vous précède
passe le trait blanc suivant, vous devriez passer le trait blanc précédent.
Cela garantit une distance de sécurité adéquate.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Adoptez une bonne position de conduite</h4>

Installez-vous confortablement dans votre siège afin de réduire la fatigue musculaire
et garder une bonne maîtrise du véhicule.

=> Une bonne position améliore votre confort et votre concentration pendant les
longs trajets sur autoroute.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Utilisez vos rétroviseurs régulièrement</h4>

Il est aussi important de regarder derrière que devant afin de bien situer le flux
de circulation et effectuer vos manœuvres en toute sécurité.

=> Consultez vos rétroviseurs toutes les 5 secondes environ. Une bonne vision de
l'arrière vous permet de détecter les véhicules qui vous approchent rapidement.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Rafraîchissez l'habitacle</h4>

La chaleur favorise la somnolence. En cas de forte température, utilisez la
climatisation ou ouvrez légèrement la fenêtre.

=> Sur autoroute, la somnolence est un danger réel. Maintenez une température
agréable et arrêtez-vous si vous sentez la fatigue vous envahir.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Arrêtez-vous régulièrement</h4>

Profitez des aires de repos pour vous détendre et vous restaurer.

Il est conseillé de faire une pause toutes les deux heures.

=> Les pauses régulières combattent la fatigue et maintiennent votre vigilance.
Les aires de repos sont prévues pour cela, utilisez-les !</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Au volant, on ne fait que conduire</h4>

Téléphoner, manger ou manipuler des objets réduit l'attention du conducteur et
augmente le risque d'accident.

=> Sur autoroute, concentrez-vous uniquement sur la conduite. Les distractions
peuvent avoir des conséquences graves à haute vitesse.</pre>`
    },
    {
      type: "paragraph",
      text: `<pre><h4 style="color: #007bff;">Prévenez en cas d'accident</h4>

Si vous êtes témoin d'un accident, prévenez les secours en utilisant les bornes
d'appel situées le long de l'autoroute afin de localiser rapidement l'accident.

=> Les bornes d'appel d'urgence permettent une localisation précise de l'accident.
Utilisez-les pour alerter rapidement les services de secours.</pre>`
    },
  ]
},
 
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