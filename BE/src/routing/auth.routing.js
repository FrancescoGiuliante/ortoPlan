import prisma from "../../db/prisma.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';


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
                }
            })
            if (credential) {
                const passwordValida = await bcrypt.compare(req.body.password, credential.password);

                if (!passwordValida) {
                    return res.status(401).json({ message: 'Credenziali errate' });
                } else {
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
                }
            } else {
                res.status = 422;
                res.json({ message: 'Credenziali errate' })
                return
            }
        } else {
            res.status = 422;
            res.json({ message: 'Utente non registrato' })
            return
        }
    })
}
