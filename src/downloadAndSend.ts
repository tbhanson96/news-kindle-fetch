import { Calibre } from 'node-calibre';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const downloadAndSend = async (send: boolean) => {
    const senderEmail = 'tbh20715@gmail.com';
    const recipientEmail = 'tbhanson96@kindle.com';
    const emailHost = 'smtp.gmail.com';
    const emailPort = 465;

    const clientId = process.env.OAUTH_ID;
    const clientSecret = process.env.OAUTH_SECRET;
    const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        console.log('Missing email OAUTH credentials, exiting..');
        process.exit(1);
    }

    const mailer = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: senderEmail,
            clientId,
            clientSecret,
            refreshToken,
        },
    });

    const calibre = new Calibre();

    const today = new Date();
    const outputFile = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}-nytimes.mobi`;
    try {
        await calibre.run("ebook-convert",
            [
                'nytimes.recipe',
                outputFile,
            ],
            {
                'output-profile': 'kindle',
            }
        );
    } catch (err) {
        console.log(`Error occured: ${err}`);
    }
    console.log('Finished creating mobi file');
    await fs.copyFile(outputFile, path.join('out', outputFile));

    let options: SMTPTransport.Options = {
        from: senderEmail,
        to: recipientEmail,
        attachments: [
            {
                path: outputFile,
            },
        ],
    };
    await new Promise<void>((res, rej) => {
        if (send) {
            mailer.sendMail(options, (err, info) => {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        } else {
            console.log('"send" option set to false, skipping email');
            res();
        }
    }); 
};

export default downloadAndSend;