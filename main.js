

function prevItem(){
    hideItem();
    options.cat = options.prev[options.prev.length -1].cat;
    options.item = options.prev[options.prev.length -1].item;
    options.res = options.prev[options.prev.length -1].res;
    options.prev.pop();
    showItem();
}

function nextItem(){
    let waarde = itemValue();
    options.prev.push({cat: options.cat, item: options.item, res: options.res});
    hideItem();

    if (options.cat == 0){
        options.cat = waarde; //veranderen na json versie..
    } else {
        options.item += waarde + 1;
        options.res += waarde;   
    }
    updateResult();
    showItem();
}

function hideItem(){
    let item = options.catItems[options.cat][options.item];
    if (!item) item = "einde";
    select('#' + item).classList.add("hidden");
}

function showItem(){
    let item = options.catItems[options.cat][options.item];
    if (!item) item = "einde";
    select('#' + item).classList.remove("hidden");
    showButtons();
}

function showButtons(){
    if (options.cat == 0){
        select('#btnVorige').classList.add('hidden');
    } else {
        select('#btnVorige').classList.remove('hidden');
    }
    if (!options.catItems[options.cat][options.item]){
        select('#btnVolgende').classList.add('hidden')
    } else {
        select('#btnVolgende').classList.remove('hidden')
    }
}

function itemValue(){
    let item = options.catItems[options.cat][options.item];
    let itemOutput = select('#' + item + " input");
    if (itemOutput.type == 'range') return options.catSliderValue[options.cat -1][ Number(select('#keuzeform').elements[ itemOutput.name ].value) ]
    return Number(select('#keuzeform').elements[ itemOutput.name ].value);
}

function updateSliderLabel(slider){
    let aantal = slider.value;
    let label = slider.labels[0];
    switch(aantal){
        case '0':
            label.textContent = "Ik reis alleen.";
            break;
        case '4': 
            label.textContent = "Ik reis met meer dan 4 personen.";
            break;
        default:
            label.textContent = "Ik reis met " + (Number(aantal) + 1) + " personen.";
            break;
    }
}

function updateResult(){
    if (options.res == 0) return;
    select('#resultaat').textContent = "Reizen per " + options.catResults[options.cat - 1][options.res -1].type;
    select('#resComment').textContent = options.catResults[options.cat - 1][options.res -1].comment;
}

function select(elt){
    return document.querySelector(elt);
}

function elt(type, options){
    let element = document.createElement(type);
    if (options){
        for(let option in options){
            element[option] = options[option];
        }
    }
}

function addData(data){
    select('#title').textContent = data.title;
    select('#comment').textContent = data.comment;

    data.catDefiningVragen.forEach( vraag =>{
        let d = elt('div');
        let inp = elt(vraag.type, vraag.options);
        //etc
    })
}

window.onload = function(){
    select('#btnVorige').onclick = prevItem;
    select('#btnVolgende').onclick = nextItem;

    options = {
        catItems: [
            ['start'],
            ['tijd', 'aantal'],
            ['aantal', 'activiteit']
        ],
        catResults: [
            [
                {type: 'voet.', comment: 'Je omgeving in je op kunnen nemen terwijl je wandelt.'}, 
                {type: 'fiets.', comment: 'Je kunt je snel verplaatsen en bent actief bezig.'}, 
                {type: 'tandem.', comment: 'Samen op de tandem. Efficient lange afstanden afleggen.'}, 
                {type: 'groepsfiets.', comment: 'Gezellig met een groep om tafel en trappen tot je niet meer kunt.'}
            ],
            [
                {type: 'auto.', comment: 'Gemakkelijk voor kleinere groepen of alleen. Relaxed en snel ergens komen.'}, 
                {type: 'trein.', comment: 'Reizen met de trein geeft je tijd om met anderen te praten of tijdens het reizen ergens aan te kunnen werken.'}
            ]
        ],
        catSliderValue:[
            [2,3,4,4,4],
            [0,0,0,0,2]
        ],
        cat: 0,
        item: 0,
        res: 0,
        prev: [{cat: 0, item: 0, res: 0}]
    }

    return;
    // Buiten de scope van deze case, modulair/herbruikbaar maken? met aparte app er naast waar je met een makkelijk ui die json files kunt genereren bv.
    // Dit heeft een iets andere flow dan hoe de huidige code werkt. Genereerd de vragen.
    fetch("./data.json").then(jsn=>{
        jsn.json().then(data =>{
            addData(data);
        })
    })
}