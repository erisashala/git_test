const { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } = require('fs')  //metoda 
const { getMissing, getDifferent, getSpecialCharDifference } = require('./methods')

const process = (lang) => {  // process esht funksion i ruajtur ne nje variabel konstant ndersa lang esht parameter
    const genericKeysStr = readFileSync(`./generic/lang_${lang}.json`, { encoding: 'utf-8' })
     // => This is an arrow function
     //genericKeysStr eshte nje objekt, qe lexon ne file generic te gjitha atributet globale te lang, qe i kemi dhene vlerat e key dhe value. 
     // ${lang} te con direkt tek vlera ne string e funksionit, ${} is used to insert a variable to a string.
    // readFileSync() është një ndërfaqe programimi e integruar e aplikacionit të modulit fs e cila përdoret për të lexuar skedarin dhe për të kthyer përmbajtjen e tij.  
     // encoding translate the binary string back to a Unicode character. 
    const genericKeys = JSON.parse(genericKeysStr)  
     //The JSON.parse() static method parses, analizon  a JSON string, qe eshte genericKeysStr, constructing the JavaScript value or object described by the string, p
    const cengageKeysStr = readFileSync(`./cengage/lang_${lang}.json`, { encoding: 'utf-8' })
    const cengageKeys = JSON.parse(cengageKeysStr)
    //same thing as generic

    const missing = getMissing(genericKeys, cengageKeys)  
    // objekti missing permban metoden getMissing me 2 variabla te krijuar me lart
    writeFileSync(`./output/missing/lang_${lang}.json`, JSON.stringify(missing, null, 4)) 
    // metode qe mer 3 parametra: file, data si string dhe nje parameter, ndersa stringify mer vleren(value, replacer, space), null dmth all 
    //string-keyed properties of the object are included in the resulting JSON string, 4 means  it indicates the number of space characters to be used as indentation


    const different = getDifferent(genericKeys, cengageKeys) // 
    writeFileSync(`./output/different/lang_${lang}.json`, JSON.stringify(different, null, 4))

    const specialChar = getSpecialCharDifference(genericKeys, cengageKeys)
    writeFileSync(`./output/special_char/lang_${lang}.json`, JSON.stringify(specialChar, null, 4))
}

const readyToCopy = (lang) => {  //funksion readyToCopy
    const directories = ['different', 'missing', 'special_char'] // array data type 
    //metode  qe mer 3 objekte si parametra
    directories.forEach(directory => { //funksion tjeter i quajtur directory, qe iteron ne array directories
        const inputStr = readFileSync(`./output/${directory}/lang_${lang}.json`, { encoding: 'utf-8' }) // variabel 
        const input = JSON.parse(inputStr) 
        const keys = Object.keys(input)
        if (!existsSync(`./ready_to_copy/${directory}/lang_${lang}`)) {
            mkdirSync(`./ready_to_copy/${directory}/lang_${lang}`)
        }
        if (directory == 'missing') {
            const values = Object.values(input)
            writeFileSync(`./ready_to_copy/${directory}/lang_${lang}/keys.txt`, JSON.stringify(keys, null, 4).replace(/,\n/g, "\n"))
            writeFileSync(`./ready_to_copy/${directory}/lang_${lang}/values.txt`, JSON.stringify(values, null, 4).replace(/,\n/g, "\n"))
        } else {
            const genericValues = {}
            const cengageValues = {}
            Object.entries(input).forEach(([key, value]) => {
                genericValues[key] = value.generic
                cengageValues[key] = value.cengage
            })
            writeFileSync(`./ready_to_copy/${directory}/lang_${lang}/keys.txt`, JSON.stringify(keys, null, 4).replace(/,\n/g, "\n"))
            writeFileSync(`./ready_to_copy/${directory}/lang_${lang}/genericValues.txt`, JSON.stringify(Object.values(genericValues), null, 4).replace(/,\n/g, "\n"))
            writeFileSync(`./ready_to_copy/${directory}/lang_${lang}/cengageValues.txt`, JSON.stringify(Object.values(cengageValues), null, 4).replace(/,\n/g, "\n"))
        }
    })
}

const main = () => {
    const languages = ['de', 'en', 'es', 'fr', 'ja', 'pt']
    languages.forEach(lang => {
        // process(lang)
        readyToCopy(lang)
    })
}

main()