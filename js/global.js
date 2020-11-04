window.addEventListener("DOMContentLoaded", start);



function start() {
    //    console.log("nået start");

    const globalmenuContainer = document.querySelector(".js_globalmenu");
    const globalmenuTemplate = document.querySelector(".js_globalmenu_template").content;
    const jsonUrl = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/pages";


    async function fetchData() {
        const response = await fetch(jsonUrl);
        const jsonData = await response.json();
        json = jsonData;
        //        console.log(json);
        show(jsonData);
    }

    function show(menupunkter) {
        //        console.log("show menupunkter");
        //        console.log(menupunkter.length);

        menupunkter.sort((a, b) => a.menu_order - b.menu_order);


        menupunkter.forEach(menupunkt => {

            if (menupunkt.parent == 0 && menupunkt.slug != "forside") {
                const template = globalmenuTemplate.cloneNode(true);

                template.querySelector(".js_globalmenu_menupunkt").textContent = menupunkt.title.rendered;
                template.querySelector(".js_globalmenu_menupunkt").href = `${menupunkt.slug}.html`;

                globalmenuContainer.appendChild(template);
            }
        });
    }

    fetchData();
}
