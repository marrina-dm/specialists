'use strict'

let cities = [];
let person = [];
let specializations = [];

Promise.all(
    [
        fetch('json/cities.json'),
        fetch('json/person.json'),
        fetch('json/specializations.json')
    ]
).then(async ([citiesResponse, personResponse, specializationsResponse]) => {
    const citiesJson = await citiesResponse.json();
    const personJson = await personResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [citiesJson, personJson, specializationsJson];
}).then(response => {
    cities = response[0];
    person = response[1];
    specializations = response[2];

    processData();
});

function processData() {
    let result1 = person.filter(item => {
        let designer = specializations.find(item => item.name === 'designer');
        if (designer && designer.id) {
            return item.personal.specializationId === designer.id &&
                item.skills.some(itemSkill => itemSkill.name.toLowerCase() === 'figma');
        }
    });

    result1.map(function (item) {
        getInfo.call(item)
    });
    console.log('---------------------------------------------');

    let result2 = person.find(item => {
        return item.skills.some(itemSkill => itemSkill.name.toLowerCase() === 'react');
    });

    getInfo.call(result2);
    console.log('---------------------------------------------');

    let result3 = person.every(item => {
        let birthday = item.personal.birthday;
        if (birthday) {
            let date = birthday.split(".");
            let dateFormat = new Date(date[2], date[1] - 1, date[0]);
            return ((new Date() - dateFormat) / (1000 * 60 * 60 * 24 * 365)).toFixed(0) >= 18;
        }
    });
    console.log(result3 ? 'Все пользователи старше 18 лет' : 'Есть несовершеннолетние пользователи');
    console.log('---------------------------------------------');

    let preResult4 = person.filter(item => {
        let backend = specializations.find(itemBack => itemBack.name === 'backend');
        let city = cities.find(itemCity => itemCity.name === 'Москва');
        let request = item.request.find(busy => busy.name.toLowerCase() === 'тип занятости');
        if (backend && backend.id && city && city.id && request && request.value) {
            return item.personal.specializationId === backend.id
                && item.personal.locationId === city.id
                && request.value.toLowerCase() === 'полная';
        }
    });

    let result4 = preResult4.sort((a, b) => {
        let priceA = a.request.find(busy => busy.name.toLowerCase() === 'зарплата');
        let priceB = b.request.find(busy => busy.name.toLowerCase() === 'зарплата');
        if (priceA && priceA.value && priceB && priceB.value) {
            return priceA.value - priceB.value;
        }
    });

    console.log(result4);
    console.log('---------------------------------------------');

    let result5 = person.filter(item => {
        let designer = specializations.find(item => item.name === 'designer');
        let figma = item.skills.find(skill => skill.name.toLowerCase() === 'figma');
        let photoshop = item.skills.find(skill => skill.name.toLowerCase() === 'photoshop');
        if (designer && designer.id && figma && figma.level && photoshop && photoshop.level) {
            return item.personal.specializationId === designer.id &&
                figma.level >= 6 && photoshop.level >= 6;
        }
    });

    console.log(result5);
    console.log('---------------------------------------------');

    let designerFigma = getBestSpecialist('figma', 'designer');
    let frontendAngular = getBestSpecialist('angular', 'frontend');
    let backendGo = getBestSpecialist('go', 'backend');

    [designerFigma, frontendAngular, backendGo].map(function (item) {
        getInfo.call(item)
    });
}

function getInfo() {
    let personal = this.personal;
    let city = cities.find(item => {
        return personal.locationId === item.id;
    })
    console.log(`${personal.firstName} ${personal.lastName}, ${city.name}`);
}

function getBestSpecialist(skill, specialization) {
    let maxLevel = 0;
    let maxSkillPerson = null;
    let people = person.filter(item => {
        let specialist = specializations.find(item => item.name === specialization);
        if (specialist && specialist.id) {
            return item.personal.specializationId === specialist.id;
        }
    });

    people.forEach(item => {
        let language = item.skills.find(itemSkill => itemSkill.name.toLowerCase() === skill);
        if (language && language.level) {
            if (language.level > maxLevel) {
                maxLevel = language.level;
                maxSkillPerson = item;
            }
        }
    });

    return maxSkillPerson;
}