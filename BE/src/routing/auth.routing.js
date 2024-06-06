import prisma from "../../db/prisma.js"
import jwt from 'jsonwebtoken'


export default function authRouting(app) {
    app.post('/login', async (req, res) => {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            const credential = await prisma.credential.findUnique({
                where: {
                    userId: user.id,
                    password: req.body.password
                }
            })
            if (credential) {
                const token = jwt.sign(
                    user,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1y',
                    }
                );
                res.json({
                    user,
                    token,
                });
            } else {
                res.status = 422;
                res.json({ message: 'Credenziali errate' })
                return
            }
        }  else {
            res.status = 422;
            res.json({ message: 'Utente non registrato' })
            return
        }

    })
}