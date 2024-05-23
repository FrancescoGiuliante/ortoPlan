import validate from "validate.js";
import prisma from "../../db/prisma.js";

validate.validators.userExists = function (value, options, key, attributes) {
    return new Promise(async(resolve, reject) => {
        const user = await prisma.user.findFirst( {
            where: {
                email: value,
                id: {
                    not: options?.id
                }
            }
        })
        if (user) {
            resolve("l'utente esiste già")
        } else {
            resolve()
        }
    })
}


export function createUserValidation(req, res, next){
    validate.async(req.body, {
        firstName:{
            presence: {allowEmpty: false},
            length: {minimum: 5}
        },
        lastName:{
            presence: {allowEmpty: false},
            length: {minimum: 5}
        },
        email:{
            // email: true,
            userExists: {}
        },
        password:{
            presence: {allowEmpty: false},
        },
        convalidaPassword:{
            equality: {
                attribute: "password",
                message: "Password non corrisponde!"
            }
        },
    }).then(
        () => {
            // on success
            next();
        },
        (errors) => {
            // on error
            res.status(403)
            res.json({isError: true, error: errors})
        }
    )
}

export function updateUserValidation(req, res, next){
    validate.async(req.body, {
        firstName:{
            presence: {allowEmpty: true},
            length: {minimum: 5}
        },
        lastName:{
            presence: {allowEmpty: true},
            length: {minimum: 5}
        },
        email:{
            presence: {allowEmpty: true},
            userExists: {
                id: +req.params.id
            }
        },
        password:{
            presence: {allowEmpty: false},
        },
        convalidaPassword:{
            equality: {
                attribute: "password",
                message: "Password non corrisponde!"
            }
        },
    }).then(
        () => {
            // on success
            next();
        },
        (errors) => {
            // on error
            res.status(403)
            res.json({isError: true, error: errors})
        }
    )      
}