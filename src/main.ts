import { Calibre } from 'node-calibre';
import nodemailer from 'nodemailer';

// const mailer = nodemailer.createTransport({
//     host: this.configService.env.EMAIL_HOST,
//     port: this.configService.env.EMAIL_PORT,
//     secure: true,
//     auth: {
//         type: 'OAuth2',
//         user: this.configService.env.EMAIL_ADDRESS,
//         clientId: this.configService.env.EMAIL_CLIENT_OAUTH_ID,
//         clientSecret: this.configService.env.EMAIL_CLIENT_OAUTH_SECRET,
//         refreshToken: this.configService.env.EMAIL_CLIENT_OAUTH_REFRESH_TOKEN,
//     },
// });

const calibre = new Calibre();

const today = new Date();
const run = async () => {
    try {
        await calibre.run("ebook-convert",
            [
                'nytimes.recipe',
                `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}-nytimes.mobi`,
            ],
            {
                'output-profile': 'kindle'
            }
        );
        console.log('finisehd');
    } catch (err) {
        console.log(`Error occured: ${err}`);
    }
};
run();