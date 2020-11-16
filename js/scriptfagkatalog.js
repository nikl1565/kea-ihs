        //Opretter variable der skal bruges i loopet og filtreringen
        let alle_ihs_fag;
        let alle_kategorier;

        //Når DOM contentet er loaded startes funktionen der henter JSON-dataen
        //*Opretter konstante der bruges i hentdata funktionen (bemærk linket er forskelligt for hver HTML-side)*//

        document.addEventListener("DOMContentLoaded", start);
        //henter kategorier ned
        const urlKategorier = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/categories?parent=9";
        //henter fag ned
        const urlFag = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/fag?per_page=100";


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
        async function hentFag() {
            const respons = await fetch(urlFag);
            alle_ihs_fag = await respons.json();
            console.log(alle_ihs_fag);
            visFag();
        }


        //Funktionen fanger elementer fra DOM'en og indsætter data fra JSON'en
        function visKategorier() {

            const container = document.querySelector(".js_liste");
            const kategoriTemplate = document.querySelector(".js_kategori_template");
            //           document.querySelector(".js_kategori_template h2").dataset.id = "alle";
            //Som udgangspunkt er filtreringen sat til 'alle' og derfor vises alle elementer
            //Alt efter hvor man klikker sig hen i filtreringen er det kun de relevante elementer der vises

            alle_kategorier.sort((a, b) => a.order - b.order);

            alle_kategorier.forEach(kategori => {
                let klon = kategoriTemplate.cloneNode(true).content;

                klon.querySelector(".js_kategori_titel").textContent = kategori.name;
                klon.querySelector(".js_kategori_titel").id = kategori.slug;
                klon.querySelector(".js_kategori_fagcontainer").dataset.id = kategori.id;
                console.log(klon);

                container.appendChild(klon);


            });

            hentFag();
        }

        function visFag() {
            const fagTemplate = document.querySelector(".js_fag_template");

            //Som udgangspunkt er filtreringen sat til 'alle' og derfor vises alle elementer
            //Alt efter hvor man klikker sig hen i filtreringen er det kun de relevante elementer der vises
            alle_ihs_fag.forEach(fag => {

                // let kategori = alle_kategorier.find(kategori => kategori.id === fag.categories[0]);
                // .element[data - id = "123456789"]

                const container = document.querySelector(`.js_kategori_fagcontainer[data-id="${fag.categories[0]}"]`);


                let klon = fagTemplate.cloneNode(true).content;
                klon.querySelector(".js_fag_titel").textContent = fag.title.rendered;
                klon.querySelector(".js_fag_titel").addEventListener("click", function () {
                    fagClick(fag.id);
                });

                klon.querySelector(".billede").src = fag.splash_thumbnail.guid;
                klon.querySelector(".js_fag_billede").addEventListener("click", function () {
                    fagClick(fag.id);
                });

                container.appendChild(klon);

            });

            if (window.location.hash) {
                let hash = window.location.hash.replace('#', '');
                console.log(hash);
                var top = document.getElementById(hash).offsetTop;
                window.scrollTo(0, top);
            }
        }


        function fagClick(id) {
            console.log(id);
            location.href = "fag.html?id=" + id;
            klon.querySelector(".js_fag_beskrivelse").textContent = fag.fag_om_beskrivelse;
        }
