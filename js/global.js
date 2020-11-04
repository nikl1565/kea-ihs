window.addEventListener("DOMContentLoaded", start);



function start() {
    console.log("nået start");

    const globalmenuContainer = document.querySelector(".js-globalmenu");
    const globalmenuTemplate = document.querySelector(".js-globalmenu-template").content;
    const jsonUrl = "https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/pages";


    async function fetchData() {
        const response = await fetch(jsonUrl);
        const jsonData = await response.json();
        json = jsonData;
        console.log(json);
        show(jsonData);
        //        addEventlistenersToButtons();
    }

    function show(menupunkter) {
        console.log("show menupunkter")
        menupunkter.forEach(menupunkt => {

            if (menupunkt.parent == 0 && menupunkt.slug != "forside") {
                const template = globalmenuTemplate.cloneNode(true);

                template.querySelector(".js-globalmenu_menupunkt").textContent = menupunkt.title.rendered;
                template.querySelector(".js-globalmenu_menupunkt").href = `${menupunkt.slug}.html`;

                globalmenuContainer.appendChild(template);
            }
        });
    }

    fetchData();
}
