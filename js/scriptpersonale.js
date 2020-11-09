        //Opretter variable der skal bruges i loopet og filtreringen
        let alle_ihs_personer;
        let alle_kategorier;

        //Når DOM contentet er loaded startes funktionen der henter JSON-dataen
        //*Opretter konstante der bruges i hentdata funktionen (bemærk linket er forskelligt for hver HTML-side)*//

        document.addEventListener("DOMContentLoaded", start);
        //henter kategorier ned
        const urlKategorier = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/categories?parent=10";
        //henter fag ned
        const urlPersonale = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/person?per_page=100";

        //const popup = document.querySelector("#popup");

        function start() {
            hentKategorier();
        }

        async function hentKategorier() {
            const respons = await fetch(urlKategorier);
            alle_kategorier = await respons.json();
            console.log(alle_kategorier);
            visKategorier();
        }

        //funktion der henter JSON/Google Sheet data, starter loopet
        async function hentPersoner() {
            const respons = await fetch(urlPersonale);
            alle_ihs_personer = await respons.json();
            console.log(alle_ihs_personer);
            visPersoner();
        }



        function visKategorier() {

            const container = document.querySelector(".js_liste");
            const kategoriTemplate = document.querySelector(".js_kategori_template");
            //           document.querySelector(".js_kategori_template h2").dataset.id = "alle";

            alle_kategorier.forEach(kategori => {
                let klon = kategoriTemplate.cloneNode(true).content;

                klon.querySelector(".js_kategori_titel").textContent = kategori.name;
                klon.querySelector(".js_kategori_personalecontainer").dataset.id = kategori.id;
                console.log(klon);

                container.appendChild(klon);


            });

            hentPersoner();
        }

        function visPersoner() {
            const personerTemplate = document.querySelector(".js_personale_template");


            alle_ihs_personer.forEach(person => {

                const container = document.querySelector(`.js_kategori_personalecontainer[data-id="${person.categories[0]}"]`);

                let klon = personerTemplate.cloneNode(true).content;
                klon.querySelector(".js_personale_billede").src = person.portrt.guid;
                klon.querySelector(".js_personale_navn").textContent = person.navn;
                klon.querySelector(".js_personale_titel").textContent = person.titel_job;
                //sendes viddere til popupfunktionen ved klik
                klon.querySelector("article").addEventListener("click", () => visDetaljer(person));


                container.appendChild(klon);

            });
        }

        //luk knappen
        document.querySelector("#close").addEventListener("click", () => popup.style.display = "none");

        //popup funktionen

        function visDetaljer(person) {
            console.log(person);
            popup.querySelector(".js_personale_billede").src = person.portrt.guid;
            popup.querySelector(".js_personale_navn").textContent = person.navn;
            popup.querySelector(".js_personale_titel").textContent = person.titel_job;
            popup.querySelector(".js_personale_tekst").textContent = person.lang_beskrivelse;
            //popup.querySelector(".js_facilitet_tekst").textContent = person.facilitet_beskrivelse;
            popup.style.display = "block";
        }
