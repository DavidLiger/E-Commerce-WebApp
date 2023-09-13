const xmlParser = require('xml2json');

const transferFile = async (req, res) => {
    const { first_name, last_name, adress, zipcode, city_name, name, comment, subcategory, email, id,
        issue, article_code, serial_number, phone_number, price
    } = req.body
    // auth B2B -> user = IMB2B, pw = ec<tB3U#!.@Uz82# (encodé en base64)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/xml");
    myHeaders.append("Authorization", "Basic SU1CMkI6ZWM8dEIzVSMhLkBVejgyIw==");
    myHeaders.append("Cookie", "PHPSESSID=687fcteenj2pp9ee3qmmlm1df9; userID=IMB2B");

    // values required = codeArticle, commentairePanne, typeEntree, nom, rue, CP, ville, pays
    // /!\ codeArticle peut être remplacé par vrai code article à récupérer dans l'API B2B avec le path 
    // /getArticlesListe -> renvoie 5000 refs à découper pour avoir les marques (peuple le select marque 
    // dans repairFileDevice.js) puis filtrent les refs de la marque sélectionné pour les proposés dans un select dans 
    // repairFileData. Ainsi le client sélectionne une ref de codeArticle existante sinon B2B renvoie une erreur
    // ou sinon ................... -> DIVERS REF
    var raw = `<?xml version="1.0" encoding="utf-8"?>
            <message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <body>
                    <createDossierRequest>
                        <codeArticle>DIVERS REF</codeArticle>
                        <numSerie>${serial_number}</numSerie>
                        <commentairePanne>${name} ${subcategory} ${issue} ${comment}</commentairePanne>
                        <dateAchat></dateAchat>
                        <numFactureAchat></numFactureAchat>
                        <acompte>${price}</acompte>
                        <remise></remise>
                        <modeReglement>CB</modeReglement>
                        <garantie>HG</garantie>
                        <typeEntree>I3</typeEntree>
                        <numCommande>xxxxx</numCommande>
                        <client>
                            <tel>${phone_number}</tel>
                            <email>${email}</email>
                                <adresse>
                                    <nom>${first_name} ${last_name}</nom>
                                    <rue>${adress}</rue>
                                    <ville>${city_name}</ville>
                                    <codePostal>${zipcode}</codePostal>
                                    <pays>FR</pays>
                                </adresse>
                        </client>
                    </createDossierRequest>
                </body>
            </message>`;

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://backofficerepair-test.itancia.com/indexFile.php?action=B2b.createDossier", requestOptions)
        .then( response => response.text())
        .then( result => {
            const resultToJson = xmlParser.toJson(result)
            res.status(201).json({success: true, resultToJson})
        })
        .catch( error => console.log('error', error));
}

module.exports = {
    transferFile
}