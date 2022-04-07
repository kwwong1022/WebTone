let linkInput = document.querySelector('#web-link');
let buttonSubmit = document.querySelector('#btn-submit');
let fetchHtmlContainer = document.querySelector('#fetch-html-container');
let resultCardContainer = document.querySelector('#result-card-container');


let toneTable = {
    0: ["awesome", "amazing", "ambitious", "calm", "charming", "nice"],    // POSITIVE
    1: ["sad", "boring", "bossy", "cruel", "aggressive", "lousy"],         // NEGATIVE
    2: ["death", "outbreak", "infect", "tragic", "die", "dangerous"]       //DANGEROUS
}

let url;
let html, paragraphs = [];
let record = [];
let result = {};  // in json
let tone = -1;
let isLoaded = false;

// get html if user click the submit button
buttonSubmit.addEventListener('click', async () => {
    // if no valid input
    if (linkInput.value) {
        loadHTML(linkInput.value);

        // extract paragraphs from raw html code -> innerText
        setTimeout(() => {
            let paragraphs = Array.from(document.querySelectorAll('p'));

            // search for intersected word in the DB
            paragraphs.forEach((p, i) => {
                let sentence = p.innerText.toLocaleLowerCase();

                toneTable[0].forEach(keyword => {
                    if (sentence.includes(keyword)) saveRecord(0, keyword, i);
                });
                toneTable[1].forEach(keyword => {
                    if (sentence.includes(keyword)) saveRecord(1, keyword, i);
                });
                toneTable[2].forEach(keyword => {
                    if (sentence.includes(keyword)) saveRecord(2, keyword, i);
                });
            });
    
            // analysis word percentage
            tone = 0;
            let count = [0, 0, 0];
            record.forEach(data => {
                switch (data.tone) {
                    case 0:
                        count[0]++;
                        break;
                    case 1:
                        count[1]++;
                        break;
                    case 2:
                        count[2]++;
                        break;
                }
            });
            for (let i=0; i<count.length; i++) {
                if (count[i] > count[tone]) tone = i;
                console.log(`tone: ${tone}`);
            }

            // sorting data into result
            for (let i=0; i<record.length; i++) {
                if (record[i].tone == tone) {
                    // keyword
                    if (!result[record[i].keyword]) {
                        result[record[i].keyword] = { times: 0, paragraph: [] };
                    }
                    result[record[i].keyword].times++;
                    result[record[i].keyword].paragraph.push(record[i].paragraph);
                }
            }

            console.log(result);

            // update web title & sub title
            let keys = Object.keys(result);
            if (isLoaded) {
                let title = "";
                switch (tone) {
                    case 0:
                        title = "Positive";
                        break;
                    case 1:
                        title = "Negative";
                        break;
                    case 2: 
                        title = "Dangerous"
                        break;
                }
                document.querySelector('.main-body .title').innerText = title;
                let subT = "Keywords: ";
                keys.forEach((k, i) => {
                    if (i == 0) {
                        subT += " " + k;
                    } else {
                        subT += ", " + k;
                    }
                });
                document.querySelector('.main-body .sub-title').innerText = subT;
            }

            // create card element to show the result in the web
            for (let i=0; i<keys.length; i++) {
                console.log(`${keys[i]}: ${result[keys[i]]}`);
                // create card
                let card = document.createElement('div');
                card.classList.add('card');
                // keyword
                let keywordP = document.createElement('p');
                keywordP.classList.add('keyword');
                keywordP.innerText = keys[i] + " - " + result[keys[i]].times + " times";
                card.appendChild(keywordP);
                // append paras
                console.log(result[keys[i]].paragraph);
                for (let j=0; j<result[keys[i]].paragraph.length; j++) {
                    let para = document.createElement('p');
                    para.classList.add('paras');
                    para.innerText = paragraphs[result[keys[i]].paragraph[j]].innerText;
                    card.appendChild(document.createElement('br'));
                    card.appendChild(para);
                }
                // paragraphs loop -> br if more than 1

                resultCardContainer.appendChild(card);
            }
        }, 100)

    } else {
        alert('Please provide a valid url');
    }
});

let saveRecord = (tone, keyword, i) => {
    record.push({
        tone: tone,
        keyword: keyword,
        paragraph: i
    });
}

let loadHTML = async (_url) => {
    url = _url;

    fetch(_url)
        .then(res => {
            console.log('wait to parse', res);
            return res.text();
        })
        .then(data => {
            html = data;
            fetchHtmlContainer.innerHTML = html;
            isLoaded = true;
            console.log('data parsed', data);
        })
        .catch(e => {
            console.log('error', e);
            alert('Failed to load the webpage, please provide a valid url');
        })
}