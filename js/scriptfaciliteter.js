        //Opretter variable der skal bruges i loopet og filtreringen
        let alle_ihs_fag;
        let alle_kategorier;

        //Når DOM contentet er loaded startes funktionen der henter JSON-dataen
        //*Opretter konstante der bruges i hentdata funktionen (bemærk linket er forskelligt for hver HTML-side)*//

        document.addEventListener("DOMContentLoaded", start);
        //henter kategorier ned
        const urlKategorier = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/categories?parent=19";
        //henter fag ned
        const urlFag = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/facilitet";

        //const popup = document.querySelector("#popup");

        function start() {
            hentKategorier();
        }

        async function hentKategorier() {
            const respons = await fetch(urlKategorier);
            alle_kategorier = await respons.json();
            console.log(alle_kategorier);
            visKategorier(alle_kategorier);
        }

        //funktion der henter JSON/Google Sheet data, starter loopet
        async function hentFag() {
            const respons = await fetch(urlFag);
            alle_ihs_fag = await respons.json();
            console.log(alle_ihs_fag);
            visFag();
        }



        function visKategorier(alle_kategorier) {

            const container = document.querySelector(".js_liste");
            const kategoriTemplate = document.querySelector(".js_kategori_template");
            //           document.querySelector(".js_kategori_template h2").dataset.id = "alle";

            alle_kategorier.sort((a, b) => a.order - b.order);

            alle_kategorier.forEach(kategori => {
                let klon = kategoriTemplate.cloneNode(true).content;

                klon.querySelector(".js_kategori_titel").textContent = kategori.name;
                klon.querySelector(".js_kategori_fagcontainer").dataset.id = kategori.id;
                console.log(klon);

                container.appendChild(klon);


            });

            hentFag();
        }

        function visFag() {
            const fagTemplate = document.querySelector(".js_fag_template");


            alle_ihs_fag.forEach(facilitet => {

                // let kategori = alle_kategorier.find(kategori => kategori.id === fag.categories[0]);
                // .element[data - id = "123456789"]

                const container = document.querySelector(`.js_kategori_fagcontainer[data-id="${facilitet.categories[0]}"]`);


                let klon = fagTemplate.cloneNode(true).content;
                klon.querySelector(".js_fag_titel").textContent = facilitet.title.rendered;
                klon.querySelector(".billede").src = facilitet.facilitet_galleri.guid;
                klon.querySelector("article").addEventListener("click", () => visDetaljer(facilitet));
                //                klon.querySelector(".js_fag_billede").addEventListener("click", function () {
                //                    fagClick(fag.id);
                //
                //                });

                container.appendChild(klon);

            });
        }


        document.querySelector("#js_close").addEventListener("click", () => popup.style.display = "none");

        function visDetaljer(facilitet) {
            console.log(facilitet);
            popup.querySelector("img").src = facilitet.facilitet_galleri.guid;
            popup.querySelector("h2").textContent = facilitet.title.rendered;
            popup.querySelector(".js_facilitet_tekst").textContent = facilitet.facilitet_beskrivelse;
            popup.style.display = "block";
        }


        //        function fagClick(id) {
        //            console.log(id);
        //            location.href = "fagsingleview.html?id=" + id;
        //            klon.querySelector(".js_fag_beskrivelse").textContent = fag.fag_om_beskrivelse;
        //        }
