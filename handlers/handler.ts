import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import middy from 'middy';
import {
  cors,
  doNotWaitForEmptyEventLoop,
  httpHeaderNormalizer,
  httpErrorHandler,
} from 'middy/middlewares';

import { getRenderData } from 'utils/helper';


function renderHtml(data: any, htmlTemplateName: string) {
    const templateHtml = fs.readFileSync(`src/templates/${htmlTemplateName}.handlebars`, 'utf-8');
    const content = handlebars.compile(templateHtml); 
    return content(data);
};

const handler = async(event: {
    pathParameters: { pdfType: string };
    body: string;
}) => {
    const body = typeof event.body === 'object' ? event.body : JSON.parse(event.body);

    const data = { ...getRenderData(body, event.pathParameters.pdfType)};

    let browser = null;
    try {
        const htmlTemplateName = 'receipt-payment';
        const html = renderHtml(data, htmlTemplateName);
  
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
      
        const pdf = await page.pdf({
            path: 'receipt-payment.pdf',
            format: 'a4',
            printBackground: true,
            displayHeaderFooter: true,
            margin: {
                top: '1cm',
                right: '1cm',
                bottom: '100px',
                left: '1cm',
            },
            landscape: true,
        });

        return {
            statusCode: 200,
            body: pdf.toString('base64')
        }
    } catch(error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'error' })
        }
    } finally {
        if (browser != null) {
            await browser.close();
        }
    }
}; 

export const pdf = middy(handler)
  .use(httpHeaderNormalizer())
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());

