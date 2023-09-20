
const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

// GET user stats

router.get("/stats", isAdmin, async (req, res) => {
    const previusMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

    try {
        const users = await User.aggregate([
            {
                $match: { createdAt: { $gte: new Date(previusMonth)}},
            },
            {
                $project:{
                    month: {$month: "$createdAt"}
                }
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).send(users)
    } catch (err) {
        console.log(err);
        res.status(500).sendStatus(err);
    }

    // res.send(previusMonth);
});

module.exports = router;




// //BUONO CON DUE MESI 
// const express = require("express");
// const { User } = require("../models/user"); // Importa il modello User
// const router = express.Router();

// // // Esempio di route per ottenere le statistiche delle iscrizioni utenti per mese
// router.get("/stats", async (req, res) => {
//     try {
//         const stats = await User.aggregate([
//             {
//                 $project: {
//                     month: { $month: "$createdAt" }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$month", // L'ID contiene solo il numero del mese
//                     total: { $sum:  1 }
//                 }
//             },
//             {
//                 $sort: {
//                     "_id": 1 // Ordina per mese in ordine crescente
//                 }
//             }
//         ]);

//         const monthlyStats = [];

//         for (let i = 1; i <= 12; i++) {
//             const stat = stats.find(item => item._id === i);
//             if (stat) {
//                 monthlyStats.push({
//                     month: i,
//                     users: stat.total
//                 });
//             }
//         }

//         res.status(200).json(stats);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Errore nel recupero delle statistiche delle iscrizioni utenti per mese" });
//     }
// });

// module.exports = router;





// con un mese indietro un risultato solo

// const express = require("express");
// const { User } = require("../models/user"); // Importa il modello User
// const { isAdmin } = require("../middleware/auth");
// const router = express.Router();

// // Esempio di route per ottenere le statistiche delle iscrizioni utenti per il mese precedente
// router.get("/stats", isAdmin, async (req, res) => {
//     try {
//         const currentDate = new Date();
//         const previousMonth = new Date(currentDate);
//         previousMonth.setMonth(currentDate.getMonth() - 1); // Imposta il mese al mese precedente

//         const stats = await User.aggregate([
//             {
//                 $match: {
//                     createdAt: {
//                         $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
//                         $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     month: { $month: "$createdAt" }
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$month", // L'ID contiene solo il numero del mese
//                     total: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: {
//                     "_id": 1 // Ordina per mese in ordine crescente
//                 }
//             }
//         ]);

//         const monthlyStats = [];

//         for (let i = 1; i <= 12; i++) {
//             const stat = stats.find(item => item._id === i);
//             if (stat) {
//                 monthlyStats.push({
//                     month: i,
//                     users: stat.total
//                 });
//             }
//         }

//         res.status(200).json(stats);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Errore nel recupero delle statistiche delle iscrizioni utenti per il mese precedente" });
//     }
// });

// module.exports = router;
