var texts = [
    'С тобой хорошо кусаться.',
    'Ты всегда рядом, и я тоже всегда рядом.',
    'Ты мягкая и тёплая и уруру!',
    'Sssssneeeeek!',
    'Ты вкусно готовишь.',
    'Ты всегда стараешься меня понять :з',
    'Ты лучшая пони!',
    'Ты любишь рисовать, это замечательно.',
    'Ты умняша, поэтому я иногда объясняю больше необходимого и кажусь нудным.',
    'У тебя красивое всё.',
    'A very laaarge beauuutiful sssneeeek',
    'Тебя всегда приятно обнимать.'
];

var months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
];

function differenceInDays(dateA, dateB) {
    return (dateA - dateB) / (1000 * 60 * 60 * 24);
}

function getAvailableEntries(startDate, currentDate) {
    console.log(startDate, currentDate, differenceInDays(currentDate, startDate));
    var amount = Math.floor(differenceInDays(currentDate, startDate)) + 1;
    if (amount < 1) {
        console.log('Warning! Amount is less than 1, equal to ' + amount);
        amount = 1;
    }
    return texts.slice(0, amount);
}

function outputEntries(entries, outputEl) {
    for (var i = entries.length - 1; i >= 0; --i) {
        var entry = entries[i];
        var entryEl = document.createElement('div');
        
        entryEl.innerHTML = entry;
        entryEl.className = 'entry';
        if (i === entries.length - 1) {
            entryEl.className += ' entry--today';
        }
        outputEl.appendChild(entryEl);
    }
}

function pad(s, symbol, places) {
    if (places <= s.length) {
        return s;
    }
    while (places--) {
        s = symbol + s;
    }
    return s;
}

var START_DATE = new Date(2016, 8, 30);
var CURRENT_DATE = new Date();
function main() {
    var entries = getAvailableEntries(START_DATE, CURRENT_DATE);
    var outputEl = document.getElementById('output');
    outputEntries(entries, outputEl);
    document.getElementById('date').innerHTML = 
        CURRENT_DATE.getDate().toString() + ' ' + 
        months[CURRENT_DATE.getMonth()] + ' ' +
        CURRENT_DATE.getFullYear();
}

main();