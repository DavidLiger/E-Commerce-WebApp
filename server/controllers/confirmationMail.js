
const mailer = require('../utils/mailer')


const sendConfirmationMail = async (req, res) => {
    const infos = req.body
    console.log(infos);
    try {
        const mailSent = await sendMail(infos)
        res.status(200).json({success: mailSent, message: 'Mail de confirmation envoyé'})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const sendMail = async (infos) => {
    let message
    if(infos.type == 'Atelier'){
        message = `
        <table align="center" width="75%">
            <tr>
                <th>
                    <div style="margin: 0 auto; text-align: center;">
                        <img align="center" src="cid:909header" alt="" width="204" height="140" border="0"/>
                    </div>
                </th>
            </tr>
            <tr>
                <td align="center" style="color: #3d2663; font-weight: bold; font-size: 1.2em; font-style: italic;">
                    <div>Faites du neuf sans neuf, réparez !</div>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50;">
                    <h3>Bonjour ${infos.prenom},</h3> 
                    <span>Merci d’avoir choisi 909 pour une intervention en atelier.</span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50;">
                    <span>Nous vous attendons à l’agence 909 de <b style="font-size: 1.2em;">${infos.agence.name}</b> pour la prise en charge de votre appareil.</span>
                    <span>Pour plus de facilité, pensez à vous munir de ce mail ou de votre numéro de dossier 909.</span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; text-decoration: underline; padding:25px;">
                    <span>Bon à savoir : </span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50;">
                    <span>Vous pouvez dès à présent retrouver vos informations et documents (facture, prise en
                        charge, devis…) sur votre espace personnel 909. Pour y accéder c’est par ici : </span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; text-decoration: underline; font-weight: bold;">
                    <a href="${process.env.BASE_URL}account">Mon compte</a>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; text-decoration: underline; font-weight: bold; padding:25px;">
                    <span>Un mail vous sera envoyé dès que votre appareil sera réparé.
                    En cas de pièces nécessaires à la réparation, un devis vous sera adressé par mail pour
                    acceptation et règlement. Pensez à bien vérifier vos nouveaux messages !</span<
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; padding:25px;">
                    <span>Pour plus d'infos, n'hésitez pas à contacter votre agence : </span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; font-weight: bold; font-size:1.1em;">
                    <span>Agence de ${infos.agence.name}</span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; font-weight: bold;">
                    <span>${infos.agence.address}</span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; font-weight: bold;">
                    <span>${infos.agence.zipcode}</span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; font-weight: bold;">
                    <span>${infos.agence.city}</span>
                </td>
            </tr>
            <tr style="color: #368f50; margin: 25px; font-weight: bold;">
                <td align="center"  style="color: #368f50; font-weight: bold; padding:25px;">
                    <span>Ouvert : ${infos.agence.schedules}</span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; font-weight: bold; font-size:1.1em;">
                    <span>Téléphone : ${infos.agence.phone}</span>
                </td>
            </tr>
            <tr>
                <td align="center"  style="color: #368f50; padding:25px;">
                    <span>Soyez fiers de vous, vous avez adopté le réflexe neuf sans neuf !
                    Ne partagez plus seulement les photos de vos plats préférés ou de vos dernières vacances,
                    parlez aussi de vos bonnes actions : utilisez notre <b style="color: #3d2663;">#faisonsdu909</b> !
                    </span>
                </td>
            </tr>
            <tr style="background-color: #3d2663;">
                <th>
                    <div style="margin: 0 auto; text-align: center; padding:25px;">
                        <img align="center" src="cid:909footer" alt="" width="102" height="90" border="0"/>
                        <div style="color: #fff; padding:15px;">
                            <a href="preprod.909services.com" style="color: #fff; padding:15px; font-size: 1.3em;">909services.com</a>
                            <span style="color: #fff; padding:15px; font-size: 1.3em;">0 800 999 909</span>
                        </div>
                        <div style="color: #fff; padding:5px;">
                            <a href="preprod.909services.com/cgv" style="color: #fff; padding:15px; font-size: 1.1em;">Conditions Générales de Ventes</a>
                        </div>
                        <div style="color: #fff; padding:15px;">
                            <span style="color: #fff; padding:5px; font-size: 1.3em;">Suivez-nous sur : </span>
                            <a href="https://www.facebook.com/909-102618342183903/?ref=pages_you_manage" style="padding:5px;">
                                <img align="center" src="cid:FBBtn" alt="" width="28" height="28" border="0"/>
                            </a>
                            <a href="https://www.instagram.com/909_fr/" style="padding:5px;">
                                <img align="center" src="cid:IGBtn" alt="" width="28" height="28" border="0"/>
                            </a>
                            <a href="https://www.linkedin.com/company/909services" style="padding:5px;">
                                <img align="center" src="cid:LIBtn" alt="" width="28" height="28" border="0"/>
                            </a>
                            <a href="https://www.youtube.com/channel/UC4Rx6WWi4uG3y7vK2-syOBg" style="padding:5px;">
                                <img align="center" src="cid:YTBtn" alt="" width="28" height="28" border="0"/>
                            </a>
                        </div>
                    </div>
                </th>
            </tr>
        </table>
        `
    }
    if(infos.type == 'Domicile'){
        message = `
        <table align="center" width="75%">
        <tr>
            <th>
                <div style="margin: 0 auto; text-align: center;">
                    <img align="center" src="cid:909header" alt="" width="204" height="140" border="0"/>
                </div>
            </th>
        </tr>
        <tr>
            <td align="center" style="color: #3d2663; font-weight: bold; font-size: 1.2em; font-style: italic;">
                <div>Faites du neuf sans neuf, réparez !</div>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50;">
                <h3>Bonjour ${infos.prenom},</h3> 
                <span>Merci d’avoir choisi 909 pour une intervention à domicile.</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50;">
                <span>Préalablement à cette intervention, vous avez RDV avec un expert 909 par téléphone le : </span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline; padding:25px;">
            <span>${infos.phoneAppointment} ${infos.timeSlot == 12 ? `entre ${infos.timeSlot}h et ${Number(infos.timeSlot)+2}h` : `entre ${infos.timeSlot}h et ${Number(infos.timeSlot)+1}h`}</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50;">
                <span>Vous serez contacté sur le numéro suivant : ${infos.phoneNumber}</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; padding:25px;">
                <span>Soyez prêt !</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline;">
                <span>Bon à savoir : </span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline; font-weight: bold;">
                <span>Suite à la confirmation du diagnostique et en cas de pièces nécessaires à la réparation, un devis vous sera adressé
                par mail pour acceptation et règlement. Pensez à bien vérifier vos nouveaux messages!</span<
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #3d2663; font-size:1.2em; font-weight:bold; padding:25px;">
                <span>MA COMMANDE</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; font-size:1.1em;">
                <span>Diagnostique à distance & Intervention à domicile………………………………${infos.price} €</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; font-size:1.1em;">
                <span>Mon N° de dossier 909 : ${infos.id}</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; padding:25px;">
                <span>Vous pouvez dès à présent retrouver vos informations et documents (facture, prise en
                    charge, devis…) sur votre espace personnel 909. Pour y accéder c’est par ici : </span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline; font-weight: bold;">
                <a href="${process.env.BASE_URL}account">Mon compte</a>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; padding:25px;">
                <span>Soyez fiers de vous, vous avez adopté le réflexe neuf sans neuf !
                Ne partagez plus seulement les photos de vos plats préférés ou de vos dernières vacances,
                parlez aussi de vos bonnes actions : utilisez notre <b style="color: #3d2663;">#faisonsdu909</b> !
                </span>
            </td>
        </tr>
        <tr style="background-color: #3d2663;">
            <th>
                <div style="margin: 0 auto; text-align: center; padding:25px;">
                    <img align="center" src="cid:909footer" alt="" width="102" height="90" border="0"/>
                    <div style="color: #fff; padding:15px;">
                        <a href="preprod.909services.com" style="color: #fff; padding:15px; font-size: 1.3em;">909services.com</a>
                        <span style="color: #fff; padding:15px; font-size: 1.3em;">0 800 999 909</span>
                    </div>
                    <div style="color: #fff; padding:5px;">
                        <a href="preprod.909services.com/cgv" style="color: #fff; padding:15px; font-size: 1.1em;">Conditions Générales de Ventes</a>
                    </div>
                    <div style="color: #fff; padding:15px;">
                        <span style="color: #fff; padding:5px; font-size: 1.3em;">Suivez-nous sur : </span>
                        <a href="https://www.facebook.com/909-102618342183903/?ref=pages_you_manage" style="padding:5px;">
                            <img align="center" src="cid:FBBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                        <a href="https://www.instagram.com/909_fr/" style="padding:5px;">
                            <img align="center" src="cid:IGBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                        <a href="https://www.linkedin.com/company/909services" style="padding:5px;">
                            <img align="center" src="cid:LIBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                        <a href="https://www.youtube.com/channel/UC4Rx6WWi4uG3y7vK2-syOBg" style="padding:5px;">
                            <img align="center" src="cid:YTBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                    </div>
                </div>
            </th>
        </tr>
    </table>
        `
    }
    //faire message pour remote
    if(infos.type == 'remote'){
        message = `
        <table align="center" width="75%">
        <tr>
            <th>
                <div style="margin: 0 auto; text-align: center;">
                    <img align="center" src="cid:909header" alt="" width="204" height="140" border="0"/>
                </div>
            </th>
        </tr>
        <tr>
            <td align="center" style="color: #3d2663; font-weight: bold; font-size: 1.2em; font-style: italic;">
                <div>Faites du neuf sans neuf, réparez !</div>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50;">
                <h3>Bonjour ${infos.prenom},</h3> 
                <span>Merci d’avoir choisi 909 pour un diagnostic à distance.</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50;">
                <span>Préalablement à cette intervention, vous avez RDV avec un expert 909 par téléphone le : </span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline; padding:25px;">
            <span>${infos.phoneAppointment} ${infos.timeSlot == 12 ? `entre ${infos.timeSlot}h et ${Number(infos.timeSlot)+2}h` : `entre ${infos.timeSlot}h et ${Number(infos.timeSlot)+1}h`}</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50;">
                <span>Vous serez contacté sur le numéro suivant : ${infos.phoneNumber}</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; padding:25px;">
                <span>Soyez prêt !</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline;">
                <span>Bon à savoir : </span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline; font-weight: bold;">
                <span>Suite à la confirmation du diagnostique et en cas de pièces nécessaires à la réparation, un devis vous sera adressé
                par mail pour acceptation et règlement. Pensez à bien vérifier vos nouveaux messages!</span<
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #3d2663; font-size:1.2em; font-weight:bold; padding:25px;">
                <span>MA COMMANDE</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; font-size:1.1em;">
                <span>Diagnostique à distance & Intervention à domicile………………………………${infos.price} €</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; font-size:1.1em;">
                <span>Mon N° de dossier 909 : ${infos.id}</span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; padding:25px;">
                <span>Vous pouvez dès à présent retrouver vos informations et documents (facture, prise en
                    charge, devis…) sur votre espace personnel 909. Pour y accéder c’est par ici : </span>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; text-decoration: underline; font-weight: bold;">
                <a href="${process.env.BASE_URL}account">Mon compte</a>
            </td>
        </tr>
        <tr>
            <td align="center"  style="color: #368f50; padding:25px;">
                <span>Soyez fiers de vous, vous avez adopté le réflexe neuf sans neuf !
                Ne partagez plus seulement les photos de vos plats préférés ou de vos dernières vacances,
                parlez aussi de vos bonnes actions : utilisez notre <b style="color: #3d2663;">#faisonsdu909</b> !
                </span>
            </td>
        </tr>
        <tr style="background-color: #3d2663;">
            <th>
                <div style="margin: 0 auto; text-align: center; padding:25px;">
                    <img align="center" src="cid:909footer" alt="" width="102" height="90" border="0"/>
                    <div style="color: #fff; padding:15px;">
                        <a href="preprod.909services.com" style="color: #fff; padding:15px; font-size: 1.3em;">909services.com</a>
                        <span style="color: #fff; padding:15px; font-size: 1.3em;">0 800 999 909</span>
                    </div>
                    <div style="color: #fff; padding:5px;">
                        <a href="preprod.909services.com/cgv" style="color: #fff; padding:15px; font-size: 1.1em;">Conditions Générales de Ventes</a>
                    </div>
                    <div style="color: #fff; padding:15px;">
                        <span style="color: #fff; padding:5px; font-size: 1.3em;">Suivez-nous sur : </span>
                        <a href="https://www.facebook.com/909-102618342183903/?ref=pages_you_manage" style="padding:5px;">
                            <img align="center" src="cid:FBBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                        <a href="https://www.instagram.com/909_fr/" style="padding:5px;">
                            <img align="center" src="cid:IGBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                        <a href="https://www.linkedin.com/company/909services" style="padding:5px;">
                            <img align="center" src="cid:LIBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                        <a href="https://www.youtube.com/channel/UC4Rx6WWi4uG3y7vK2-syOBg" style="padding:5px;">
                            <img align="center" src="cid:YTBtn" alt="" width="28" height="28" border="0"/>
                        </a>
                    </div>
                </div>
            </th>
        </tr>
    </table>
        `
    }
    try {
        await mailer(infos.email, "Confirmation Commande 909", `${message}` )
        .then(()=>{
            return true
        })
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    sendConfirmationMail
}