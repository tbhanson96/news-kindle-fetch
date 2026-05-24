import { readFile } from 'fs/promises';
import { uploadEpubs } from '../src/book-utils';

jest.mock('fs/promises', () => ({
    readFile: jest.fn(),
}));

const readFileMock = readFile as jest.MockedFunction<typeof readFile>;
const fetchMock = jest.fn();

describe('uploadEpubs', () => {
    const originalApiKey = process.env.HOMESERVER_API_KEY;
    const originalUploadUrl = process.env.NEWSPAPER_UPLOAD_URL;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.HOMESERVER_API_KEY = 'api-key';
        delete process.env.NEWSPAPER_UPLOAD_URL;
        global.fetch = fetchMock as typeof fetch;
        readFileMock.mockResolvedValue(Buffer.from('epub'));
        fetchMock.mockResolvedValue({
            status: 201,
            text: jest.fn(),
        });
    });

    afterAll(() => {
        if (originalApiKey === undefined) {
            delete process.env.HOMESERVER_API_KEY;
        } else {
            process.env.HOMESERVER_API_KEY = originalApiKey;
        }
        if (originalUploadUrl === undefined) {
            delete process.env.NEWSPAPER_UPLOAD_URL;
        } else {
            process.env.NEWSPAPER_UPLOAD_URL = originalUploadUrl;
        }
    });

    it('uploads generated EPUBs with API authentication and Kindle delivery enabled', async () => {
        await uploadEpubs(['out/today-nytimes.epub'], { sendToKindle: true });

        expect(readFileMock).toHaveBeenCalledWith('out/today-nytimes.epub');
        expect(fetchMock).toHaveBeenCalledWith(
            new URL('https://files.timbhanson.com/api/ebooks/newspapers?sendToKindle=true'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'x-api-key': 'api-key' },
                body: expect.any(FormData),
            }),
        );
    });

    it('requires an API key before uploading', async () => {
        delete process.env.HOMESERVER_API_KEY;

        await expect(uploadEpubs(['out/today-nytimes.epub']))
            .rejects.toThrow('Missing HOMESERVER_API_KEY');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects files that are not EPUB newspapers', async () => {
        await expect(uploadEpubs(['out/today-nytimes.mobi']))
            .rejects.toThrow('Only EPUB newspapers may be uploaded');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects responses other than Created', async () => {
        fetchMock.mockResolvedValue({
            status: 403,
            text: jest.fn().mockResolvedValue('forbidden'),
        });

        await expect(uploadEpubs(['out/today-nytimes.epub']))
            .rejects.toThrow('Newspaper upload failed: 403 forbidden');
    });
});
