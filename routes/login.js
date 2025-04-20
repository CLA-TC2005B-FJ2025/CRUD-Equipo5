import DBconfig from "../src/index.js";
import express from "express";
import sql from "mssql";

const router = express.Router();

router.post("/", async (req,res,) =>{
    const {email, password} = req.body;
    let transaction;
    try{
        await sql.connect(DBconfig);
        transaction = new sql.Transaction();
        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input("mailMaestro", sql.VarChar, email);

        const result = await request.query(
            "SELECT * FROM profesor WHERE mailMaestro = @mailMaestro"
        )
        if (result.recordset.length) {
            res.send(result.recordset);
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