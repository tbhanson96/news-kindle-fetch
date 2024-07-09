import { Calibre } from 'node-calibre';
import nodemailer from 'nodemailer';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


const getFileInfo = (bookName: string) => {
    const today = new Date();
    const fileDate = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;
    const outputFile = path.join('out', `${fileDate}-${bookName}.epub`);

    return { fileDate, outputFile };
}
/**
 * Run the economist recipe.
 */
const economist = async () => {
    const calibre = new Calibre();
    const { outputFile, fileDate } = getFileInfo('economist');
    try {
        console.log(`Starting fetch of latest ${fileDate} economist article...`);
        await calibre.run("ebook-convert",
            [
                'economist.recipe',
                outputFile,
            ],
        );
    } catch (err) {
        console.log('Error occured:', err);
    }
    return outputFile;
}

/**
 * Run the NYTimes calibre recipe.
 */
const nyTimes = async () => {
    const calibre = new Calibre();

    const { outputFile, fileDate } = getFileInfo('nytimes');
    try {
        console.log('Creating cover image...');
        await createNyTimesCover();
        console.log(`Starting fetch of latest ${fileDate} NY times article...`);
        await calibre.run("ebook-convert",
            [
                'nytimes.recipe',
                outputFile,
            ],
        );
    } catch (err) {
        console.log('Error occured:', err);
    }
    return outputFile;
}

const sendEpubs = async (files: string[]) => {
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

    for (const file of files) {
        let options: SMTPTransport.Options = {
            from: senderEmail,
            to: recipientEmail,
            attachments: [
                {
                    path: file,
                },
            ],
        };
        await new Promise<void>((res, rej) => {
            mailer.sendMail(options, (err, info) => {
                if (err) {
                    console.log('Failed to send book to kindle:', err);
                    rej(err);
                } else {
                    console.log('Successfully sent book to kindle!');
                    res();
                }
            });
        }); 
    }
};

const createNyTimesCover = async () => {
    const today = new Date();
    let labelDate = today.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const execAsync = util.promisify(exec);
    try {
        const { stdout, stderr } = await execAsync(`sh create-nytimes-cover.sh \"${labelDate}\" ${path.join('out', 'date.png')} ${path.join('out', 'ny-times-cover.png')}`);
        console.log('imagemagick:', stdout);
        console.error('imagemagick:', stderr);
    } catch (e) {
        console.error('Could not create NY Times cover image: ', e);
    }
};

export { sendEpubs, nyTimes, economist };