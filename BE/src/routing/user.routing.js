import { createUserValidation } from '../validations/usersValidations.js'
import { updateUserValidation } from '../validations/usersValidations.js'
import prisma from '../../db/prisma.js'
import isLoggedIn from '../middleware/isLoggedIn.js'



export default function userRouting(app) {
    const DB_PATH = './db/users.json'

    // users list
    app.get('/users', isLoggedIn, async (req, res) => {
        const users = await prisma.user.findMany()
        res.json(users);
    })

    app.get('/ortaggi', async (req, res) => {
        const ortaggi = await prisma.ortaggi.findMany()
        res.json(ortaggi);
    })

    app.get('/glossario', async (req, res) => {
        const vocabolo = await prisma.glossario.findMany()
        res.json(vocabolo);
    })

    // home
    app.get('/home', isLoggedIn, (req, res) => {
        res.json({ message: 'Welcome to the home page', user: req.user });
    });

    // profilo
    app.get('/profilo', isLoggedIn, (req, res) => {
        res.json({ message: 'Questo è il profilo di:', user: req.user });
    });

    app.get('/users/:id', async (req, res) => {
        const userId = +req.params.id;
        const user = await prisma.user.findUnique({ where: { id: userId } })
        res.json(user);
    })

    // metodo http DELETE
    app.delete('/users/:id', async (req, res) => {
        const userId = +req.params.id;
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user) {
            const userDelete = await prisma.user.delete({ where: { id: userId } })
            // rimando al FE il record cancellato o l'intera collezzione
            res.json(user)
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    })

    // metodo http DELETE ALL
    app.delete('/usersDeleteAll/', async (req, res) => {
        const userDeleteAll = await prisma.user.deleteMany()
        // rimando al FE il 
        res.json({ message: 'Tutti gli utenti sono stati eliminati' });

    })

    // metodo http POST creazione orto
    app.post('/orto', async (req, res) => {
        const newOrto = await prisma.myOrto.create({
            data: {
                nome: req.body.nome,
                citta: req.body.citta,
                tipoPiantagione: req.body.tipoPiantagione,
                numeroPiante: req.body.numeroPiante,
                dataSemina: req.body.dataSemina,
                sistemazione: req.body.sistemazione,
                userId: req.body.userId,

            }
        })
        res.status(201);
        res.json(newOrto);

    })

    // metodo http POST creazione pianificazione
    app.post('/pianificazione', isLoggedIn, async (req, res) => {
        const newPianificazione = await prisma.pianificazioni.create({
            data: {
                data: req.body.data,
                attivita: req.body.attivita,
                completata: req.body.completata,
                myOrtoId: req.body.myOrtoId,
            }
        })
        res.status(201);
        res.json(newPianificazione);

    })

    app.delete('/pianificazione/:id', isLoggedIn, async (req, res) => {
        const pianificazioneId = +req.params.id;
        const pianificazione = await prisma.pianificazioni.findUnique({ where: { id: pianificazioneId } })
        if (pianificazione) {
            const pianificazioneDelete = await prisma.pianificazioni.delete({ where: { id: pianificazioneId } })
            // rimando al FE il record cancellato o l'intera collezzione
            res.json(pianificazione)
        } else {
            res.status(404).json({ message: 'Pianificazione not found' })
        }
    })

    // Get find per id
    app.get('/pianificazione/:id', isLoggedIn, async (req, res) => {
        const pianificazioneId = +req.params.id;
        const pianificazione = await prisma.pianificazioni.findUnique({
            where: { id: pianificazioneId },
            include: { myOrto: true } // Includi l'oggetto orto correlato
        });
        if (pianificazione) {
            res.json(pianificazione);
        } else {
            res.status(404).json({ message: 'Pianificazione not found' });
        }
    })

    app.put('/pianificazione/:id', isLoggedIn, async (req, res) => {
        const pianificazioneId = +req.params.id;
        const { completata } = req.body;

        const updatedPianificazione = await prisma.pianificazioni.update({
            where: { id: pianificazioneId },
            data: { completata }
        });

        res.json(updatedPianificazione);
    });

    app.post('/myorto', isLoggedIn, async (req, res) => {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }
        const orto = await prisma.myOrto.findMany({
            where: {
                userId: userId
            }
        });
        res.json(orto);
    });

    app.post('/mypianificazioni', isLoggedIn, async (req, res) => {
        const userId = req.body.userId;
        const data = req.body.data;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }
        const orto = await prisma.myOrto.findMany({
            where: {
                userId: userId
            }
        });

        const pianificazioni = await prisma.pianificazioni.findMany({
            where: {
                myOrto: {
                    userId: userId
                },
                data: data
            },
            include: {
                myOrto: true
            }
        });

        res.json({ pianificazioni, orto });
    });

    app.post('/mypianificazioniAll', isLoggedIn, async (req, res) => {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }
        const orto = await prisma.myOrto.findMany({
            where: {
                userId: userId
            }
        });

        const pianificazioni = await prisma.pianificazioni.findMany({
            where: {
                myOrto: {
                    userId: userId
                },
            },
            include: {
                myOrto: true
            }
        });

        res.json({ pianificazioni, orto });
    });

    app.post('/mypianificazioniNext', isLoggedIn, async (req, res) => {
        const ortoId = req.body.id;

        if (!ortoId) {
            return res.status(400).json({ error: 'Manca ortoId' });
        }

        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];

        const pianificazione = await prisma.pianificazioni.findFirst({
            where: {
                myOrtoId: ortoId,
                data: {
                    gte: formattedToday
                }
            },
            orderBy: {
                data: 'asc'
            },
            include: {
                myOrto: true
            }
        });

        if (pianificazione) {
            return res.status(200).json(pianificazione);
        } else {
            return res.status(200).json({ message: 'Nessun evento pianificato' });
        }
    });


    // metodo http POST
    app.post('/users', createUserValidation, async (req, res) => {
        const newUser = await prisma.user.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            }
        })
        const newUserCredential = await prisma.credential.create({
            data: {
                userId: newUser.id,
                password: req.body.password,
            }
        })

        res.status(201);
        res.json({ newUser, newUserCredential });

    })

    // metodo http PUT
    app.put('/users/:id', updateUserValidation, async (req, res) => {
        const userId = +req.params.id;
        let user = await prisma.user.findUnique({ where: { id: userId } })
        let userCredential = await prisma.credential.findUnique({ where: { userId: userId } })

        if (user) {
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.email = req.body.email
            userCredential.password = req.body.password

            const userUpdate = await prisma.user.update({
                where: { id: userId },
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }
            })
            const credentialUpdate = await prisma.credential.update({
                where: { userId: userId },
                data: {
                    password: userCredential.password
                }
            })
            res.json(user)
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    })

    // metodo http PUT
    app.put('/updatePianificazione/:id', isLoggedIn, async (req, res) => {
        const pianificazioneId = +req.params.id;
        const { data, attivita, myOrtoId } = req.body;
        const myOrtoIdInt = parseInt(myOrtoId);
        

        const pianificazioneAttuale = await prisma.pianificazioni.findUnique({
            where: { id: pianificazioneId },
            select: { completata: true }
        });
        const updatedPianificazione = await prisma.pianificazioni.update({
            where: { id: pianificazioneId },
            data: { data, attivita, completata: pianificazioneAttuale.completata, myOrtoId: myOrtoIdInt }
        });

        res.json(updatedPianificazione);

    });


    // Get find per email
    app.get('/userByEmail/:email', async (req, res) => {
        const userEmail = req.params.email;
        const user = await prisma.user.findUnique({ where: { email: userEmail } })
        res.json(user);

    })
}
