class RenderService{
    constructor(){
        this.cache = {};
    }

    render(template, values){
        const templateKey = `script#${template}`;

        let renderedHtml = 
            this.cache[templateKey] || document.querySelector(templateKey).innerHTML;

        let keys = Object.keys(values);

        keys.forEach(key => {
            var value = values[key];
            var replacementRegEx = new RegExp(`{${key.toString().toLowerCase()}}`, 'gi');

            renderedHtml = renderedHtml.replace(replacementRegEx, value);
        });

        return renderedHtml;
    }

    updateElement(target, html){
        let element = document.querySelector(target);

        element.innerHTML = html;
    }

    dropCache(){
        this.cache = {};
    }
}