 let baseUrl = 'https://sljfineart.com/kea/sem-2/ihs-09-cms/wordpress/wp-json/wp/v2/';
        let urlRouteFag = 'fag';
        let urlRouteCategory = 'categories';
        let urlRoutePosts = 'posts';
        let urlRouteCategoryParameter = '?include=9';


        // Container
        let sideNavigationContainer = document.querySelector(".js_side_navigation");

        // Templates
        // Link
        let sideNavigationLinkTemplate = document.querySelector(".js_side_navigation_link_template").content;
        // List
        let sideNavigationListTemplate = document.querySelector(".js_side_navigation_list_template").content;
        // List item
        let sideNavigationListItemTemplate = document.querySelector(".js_side_navigation_list_item_template").content;


        document.addEventListener("DOMContentLoaded", start);

        function start() {
            createVerticalMenu(urlRouteCategory, urlRouteCategoryParameter);
        }





        async function getData(urlRoute, urlParameter) {
            console.log('getData');

            if (urlRoute === 'category') {
                urlRoute = 'categories';
            }

            let response = await fetch(`${baseUrl}${urlRoute}${urlParameter}`);

            let data = await response.json();

            return data;
        }





        async function createVerticalMenu(urlRoute, urlParameter) {
            let mainCategory = await getData(urlRoute, urlParameter);
            console.log('mainCategory', mainCategory);

            // Hent templaten til links og klon den
            let templateLink = sideNavigationLinkTemplate.cloneNode(true);

            // Indsæt data i templaten
            templateLink.querySelector(".js_side_navigation_link").href = `${mainCategory[0].slug}.html`;
            templateLink.querySelector(".js_side_navigation_link").textContent = mainCategory[0].name;

            sideNavigationContainer.appendChild(templateLink);

            // Hvis kategorien indeholder posts
            if (mainCategory[0].count === 0) {
                console.log('ingen posts!');
            } else {
                console.log(`der er ${mainCategory[0].count} posts!`);
            }

            // Hent data  ned i en array
            let childs = await getData(mainCategory[0].taxonomy, `?parent=${mainCategory[0].id}`);
            console.log(childs);
            console.log(childs.length);

            // Hvis der er 1 underkategori eller flere
            if (childs.length > 0) {
                console.log('Der er underkategorier!');

                let templateList = sideNavigationListTemplate.cloneNode(true);

                // For hver underkategori
                for (const child of childs) {

                    let templateListItem = sideNavigationListItemTemplate.cloneNode(true);

                    templateListItem.querySelector(".js_side_navigation_list_item").textContent = child.name;

                    // Hvis der er posts
                    if (child.count > 0) {
                        let childs = await getData(urlRouteFag, `?${urlRouteCategory}=${child.id}`);

                        for (const child of childs) {

                            console.log(child);

                            let templateLink = sideNavigationLinkTemplate.cloneNode(true);

                            templateLink.querySelector(".js_side_navigation_link").href = `${child.slug}.html`;
                            templateLink.querySelector(".js_side_navigation_link").textContent = child.title.rendered;

                            templateListItem.appendChild(templateLink);

                        }
                    }

                    templateList.querySelector(".js_side_navigation_list").appendChild(templateListItem);
                }

                sideNavigationContainer.appendChild(templateList);
            }
        }
