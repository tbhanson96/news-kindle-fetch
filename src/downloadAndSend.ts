import { Calibre } from 'node-calibre';
import nodemailer from 'nodemailer';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
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
    const fileDate = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;
    const labelDate = today.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const outputFile = path.join('out', `${fileDate}-nytimes.epub`);
    try {
        console.log('Creating cover image...');
        await createCoverImage();
        console.log(`Starting fetch of latest ${fileDate} NY times article...`);
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
        console.log('Error occured:', err);
    }
    console.log('Finished creating epub file');

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
                    console.log('Failed to send book to kindle:', err);
                    rej(err);
                } else {
                    console.log('Successfully sent book to kindle!');
                    res();
                }
            });
        } else {
            console.log('"send" option set to false, skipping email');
            res();
        }
    }); 
};

const createCoverImage = async () => {
    const today = new Date();
    let labelDate = today.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const execAsync = util.promisify(exec);
    try {
        const { stdout, stderr } = await execAsync(`sh convert.sh \"${labelDate}\" ${path.join('out', 'date.png')} ${path.join('out', 'cover.png')}`);
        console.log('imagemagick:', stdout);
        console.error('imagemagick:', stderr);
    } catch (e) {
        console.error('Could not create cover image: ', e);
    }
};

export { downloadAndSend };