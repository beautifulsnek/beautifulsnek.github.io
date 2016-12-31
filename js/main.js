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
    'Тебя всегда приятно обнимать.',
    'С тобой всегда тепло, даже зимой.',
    'Мой любимый цвет это снек.',
    'Благодаря тебе я много узнаю о людях, лучше понимаю тебя саму и других.',
    'Ты самый верный и надёжный снек.',
    'У тебя очень приятный и красивый голос.',
    'Ты бываешь занятой или ленивой, но тебе на самом деле всё интересно.',
    'Ты очень-очень важна. И для меня, и вообще.',
    'Когда я обнимаю тебя, всё сразу становится лучше.',
    'У тебя есть красивые разноцветные узоры.',
    'Обычные змеи могут раскрывать пасть примерно до 150 градусов. Ты можешь вообще всё.',
    'Ты очень нужна мне.',
    'С тобой интересно разговаривать, потому что ты очень умная змея.',
    'Жамк-жамк-жамк-жамк. Мяк-мяк. Мяк. Sss.',
    'Всегда выращивай свою внутреннюю снек! Она может перерасти и Великого Полоза, и мирового змея Йормунганда.',
    'Ты можешь заползать под кофту, чтобы тебя грели.',
    'Ты самая уруру!',
    'Ты счастье, ты снек.',
    'Такая замечательная змея, как ты, никогда не должна грустить!',
    'Я люблю тебя.',
    'Все снеки завидуют твоему кусь.'
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

var START_DATE = new Date(2016, 10, 11);
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