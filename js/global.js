window.addEventListener("DOMContentLoaded", start);

        let meta;

        let pageUrl = window.location.pathname;
        console.log(pageUrl);
        let htmlName = pageUrl.substring(pageUrl.lastIndexOf('/') + 1).replace('.html', '');
        console.log(htmlName);
        const pageName = htmlName;

        //henter url med SEO
        const urlMeta = `https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/pages?slug=${pageName}`;

function start() {
    //    console.log("nået start");

    const globalmenuContainer = document.querySelector(".js_globalmenu");
    const globalmenuTemplate = document.querySelector(".js_globalmenu_template").content;
    const jsonUrl = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/pages";

    document.querySelector(".js_header_burger_icon").addEventListener("click", toggleHeaderBurgerIcon);

    async function fetchData() {
        const response = await fetch(jsonUrl);
        const jsonData = await response.json();
        json = jsonData;
        //        console.log(json);
        show(jsonData);
    }


        async function hentMeta () {
            const respons = await fetch(urlMeta);
            meta = await respons.json();

            console.log(meta);
            getMeta();
        }

    function show(menupunkter) {
        //        console.log("show menupunkter");
        //        console.log(menupunkter.length);

        menupunkter.sort((a, b) => a.menu_order - b.menu_order);

        console.log(menupunkter);

        menupunkter.forEach(menupunkt => {

            if (menupunkt.parent == 0 && menupunkt.slug != "forside" && menupunkt.slug != "det-praktiske" && menupunkt.slug != 'fagkatalog') {
                const template = globalmenuTemplate.cloneNode(true);

                template.querySelector(".js_globalmenu_menupunkt").textContent = menupunkt.title.rendered;
                template.querySelector(".js_globalmenu_menupunkt").href = `${menupunkt.slug}.html`;

                globalmenuContainer.appendChild(template);
            }
        });
    }

    function toggleHeaderBurgerIcon() {
        console.log("toggle menu");

        document.querySelector(".js_globalmenu").classList.toggle("css_globalmenu_hidden");

        let isHidden = document.querySelector(".js_globalmenu").classList.contains("css_globalmenu_hidden");

        if (isHidden == true) {
            document.querySelector(".js_header_burger_icon").textContent = "☰";
        } else {
            document.querySelector(".js_header_burger_icon").textContent = "×";
        }

    }

    hentMeta();
    fetchData();
}

function getMeta () {
            document.querySelector(".js_meta_title").textContent =  meta[0].seo_titel;
            document.querySelector(".js_meta_description").content =  meta[0].seo_beskrivelse;
            document.querySelector(".js_meta_tags").content =  meta[0].seo_tag;
}
