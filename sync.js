let _ = require('lodash');
let fs = require('fs');
let minimist = require('minimist');

let defaultApp = 'zapf-connect';
let defaultOutputDir = './i18n';

let argv = minimist(process.argv.slice(2));

let outputDir = argv['output'] || defaultOutputDir;
let app = argv['app'] || defaultApp;

console.log('\nSyncing translation tokens for app '+ app + '\n');

function getTranslationJSON(lang) {
    let langPath = '../'+app+'/src/assets/i18n/'+lang+'.json';
    return JSON.parse(fs.readFileSync(langPath, 'utf8'));
}
let baseLang = 'en_US';
let availableLanguages = [
    'de_DE',
    // 'en_US',
    'it',
    'fr',
    'nl',
    'es',
    'cs',
    'da',
    'pt'
];

let baseTranslation = getTranslationJSON(baseLang);


function customizer(objValue, sourceValue, key) {
    if(!key) {
        console.log('\n\n', sourceValue);
    }
    if(typeof objValue == 'string') {
        if(objValue.indexOf('**') === 0) {
            return "";
        } else {
            return objValue;
        }
    } else if(typeof sourceValue == 'string') {
        return "";
    }
    return undefined;
}


if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

availableLanguages.forEach((newLang) => {

    let newTranslation = getTranslationJSON(newLang);
    let mergedTranslation = _.mergeWith(newTranslation, baseTranslation, customizer);
    let content = JSON.stringify(mergedTranslation, null, 4);

    let path = outputDir+'/'+newLang+'.json';
    fs.writeFileSync(path, content, 'utf-8');

    console.log('Merged "' + baseLang + '" -> "' + newLang + '" in file ' + path);
});






