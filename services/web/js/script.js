(() => {
    fetch("/data")
        .then(resp => resp.json())
        .then(lots => {
            const renderService = new RenderService();
            let result = "";

            lots.forEach(lot => {
                lot.title = lot.title || "Лот";
                const view = renderService.render("card-template", lot);

                result += view;
            })

            renderService.updateElement('.data', result);

            const imagesToLoad = Array.from(document.querySelectorAll(".card-img-top"));
            const cards = Array.from(document.querySelectorAll(".card"));

            imagesToLoad.forEach(image => {
                const fileId = image.dataset.fileid;

                fetch(`/image?id=${fileId}`)
                    .then(resp => resp.json())
                    .then(x => {
                        image.src = x.url;
                    });
            });

            cards.forEach(card => {
                const lastBetElem = card.querySelector(".last-bet");
                const lotId = lastBetElem.dataset.id;

                fetch(`/bet?id=${lotId}`)
                    .then(resp => resp.json())
                    .then(x => {
                        lastBetElem.innerHTML = x.value;
                    });
            })
        });
})();