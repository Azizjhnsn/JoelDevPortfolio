const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
require('dotenv').config()
const nodemailler = require('nodemailer')


app.use(express.urlencoded({extended:false}))

const transporter = nodemailler.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})
const Port = process.env.Port || 6004


app.use(express.static(__dirname+'/public'))

app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/senMessage', async (req,res)=>{
    try{
        const name =await req.body.name
        const email =await req.body.email
        const message =await req.body.message

    
        const mailOptions = {
            from: email,
            to: process.env.USER,
            subject: 'New Message',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };
        transporter.sendMail(mailOptions)

        console.log('Email sent');
        res.redirect('/')}
        catch(error){
            console.error(error)
            res.status(500).send('Error sending Email')
        }

})

app.listen(Port,()=>{
    console.log(`App listening on port:http://localhost:${Port}`);
})