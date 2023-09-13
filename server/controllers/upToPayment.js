const crypto = require('crypto');
const moment = require('moment-timezone')

const upToPayment = async (req, res) => {
    const hMacSecretKey = 'A0C8BED06D8DBE746B5EE3317B7A1ED510CBEEF58A1180C3C460454F1872E521B3BE168CE2FE27DD68DA711AC4147209AAA26B1BAD66D592F476D36DA37003E1'
    const { email, price } = req.body

    // time en ISO8601
    var pbx_time = moment.tz(new Date(), "Europe/Paris").format()
    // var pbx_time = '2023-08-31T15:49:28+02:00'

    console.log(pbx_time);

    // passage de la clé HMAC en binaire
    const text2Binary= (string) => {
        return string.split('').map(function (char) {
            return hex2bin(char)
        }).join(' ');
    }

    const hex2bin = (hex) => {
        return (parseInt(hex, 16).toString(2)).padStart(8, '0');
    }

    // calcul de l'empreinte avec la clé HMAC en SHA512
    const hashWithHMAC = (data, key) => {
        let binKey = text2Binary(key)
        console.log(binKey);
        return crypto.createHmac('sha512', binKey)
            .update(data)
            .digest('hex')
            .toUpperCase()
      }

    const escapeHtml = (text) => {
        var map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      }

    // paramètres transmis dans le même ordre avec les variables non url-encodés 
    // (seul le PBX_TIME est urlencodé lors de la transmission en clair comme dit dans la doc)
    var paramsToHash = `PBX_SITE=3266954&PBX_RANG=01&PBX_IDENTIFIANT=38023293&PBX_SOURCE=RWD&PBX_TOTAL=${(price*100)}&PBX_DEVISE=978&PBX_CMD=Ref_Cmd_001&PBX_PORTEUR=${email}&PBX_RETOUR=Mt:M;Ref:R;Auto:A;Erreur:E&PBX_HASH=SHA512&PBX_TIME=${pbx_time}&PBX_SHOPPINGCART=${escapeHtml('<?xml version="1.0" encoding="utf-8"?><shoppingcart><total><totalQuantity>1</totalQuantity></total></shoppingcart>')}&PBX_BILLING=${escapeHtml('<?xml version="1.0" encoding="utf-8"?><Billing><Address><FirstName>Jean</FirstName><LastName>Dupont</LastName><Address1>12 rue Test</Address1><ZipCode>75001</ZipCode><City>Paris</City><CountryCode>250</CountryCode></Address></Billing>')}`

    // var params = `PBX_SITE=3266954&PBX_RANG=01&PBX_IDENTIFIANT=38023293&PBX_SOURCE=RWD&PBX_TOTAL=${(price*100)}&PBX_DEVISE=978&PBX_CMD=Ref_Cmd_001&PBX_PORTEUR=${email}&PBX_RETOUR=Mt:M;Ref:R;Auto:A;Erreur:E&PBX_HASH=SHA512&PBX_TIME=${pbx_time}&PBX_SHOPPINGCART=${escapeHtml('<?xml version="1.0" encoding="utf-8"?><shoppingcart><total><totalQuantity>1</totalQuantity></total></shoppingcart>')}&PBX_BILLING=${escapeHtml('<?xml version="1.0" encoding="utf-8"?><Billing><Address><FirstName>Jean</FirstName><LastName>Dupont</LastName><Address1>12 rue Test</Address1><ZipCode>75001</ZipCode><City>Paris</City><CountryCode>250</CountryCode></Address></Billing>')}&PBX_HMAC=${hashWithHMAC(paramsToHash, hMacSecretKey)}`

    console.log(paramsToHash);

    const map = new Map();

    map.set('PBX_SITE', '3266954')
    map.set('PBX_RANG', '01')
    map.set('PBX_IDENTIFIANT', '38023293')
    map.set('PBX_SOURCE', 'RWD')
    map.set('PBX_TOTAL', (price*100))
    map.set('PBX_DEVISE', '978')
    map.set('PBX_CMD', 'Ref_Cmd_001')
    map.set('PBX_PORTEUR', email)
    map.set('PBX_RETOUR', 'Mt:M;Ref:R;Auto:A;Erreur:E&')
    map.set('PBX_HASH', 'SHA512')
    map.set('PBX_TIME', pbx_time)
    map.set('PBX_BILLING', escapeHtml('<?xml version="1.0" encoding="utf-8"?><Billing><Address><FirstName>Jean</FirstName><LastName>Dupont</LastName><Address1>12 rue Test</Address1><ZipCode>75001</ZipCode><City>Paris</City><CountryCode>250</CountryCode></Address></Billing>'))
    map.set('PBX_SHOPPINGCART', escapeHtml('<?xml version="1.0" encoding="utf-8"?><shoppingcart><total><totalQuantity>1</totalQuantity></total></shoppingcart>'))
    map.set('PBX_HMAC', hashWithHMAC(paramsToHash, hMacSecretKey))

    const urlSearchParams = new URLSearchParams(map);

    console.log(urlSearchParams.toString());

    await fetch("https://recette-tpeweb.e-transactions.fr/php/"  , {
        method: 'POST',
        body: JSON.stringify(urlSearchParams),

    })
    .then( response => response.text())
    .then( result => {
        console.log('result', result);
        res.status(201).json({success: true, result})
    })
    .catch( error => {
        console.log('error', error)
        res.status(401).json({success: false, error})
    });
}

module.exports = {
    upToPayment
}