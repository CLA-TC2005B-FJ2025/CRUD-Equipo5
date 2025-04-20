import DBconfig from "../src/index.js";
import express from "express";
import sql from "mssql";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req,res,) =>{
    const {email, password} = req.body;

    let transaction;
    try{
        //devolver de la base de datos el hash con la contraseña
        await sql.connect(DBconfig);
        transaction = new sql.Transaction();
        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input("mailMaestro", sql.VarChar, email);
        const result = await request.query(
            "SELECT * FROM profesor WHERE mailMaestro = @mailMaestro"
        )

        //si llego algo de la base de datos(existe el usuario) comparar el hash con la contraseña dada
        if (result.recordset.length) {
            const response = bcrypt.compare(password, result.recordset[0].contraHash, (err, contra) => {
                result ? res.send(contra) : res.send("contraseña incorrecta", err);
            })
        } else {
            res.send("EL ID NO EXISTE");
        }
        await transaction.commit();
    } catch(err){
        console.error(err);
        await transaction.rollback();
    } finally{
        sql.close();
    }
})

export default router;