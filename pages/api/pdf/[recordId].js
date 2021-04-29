// pages/api/user.js
import { use } from 'next-api-middleware';
import db from '../../../models';
import authorize from '../../../middleware/authorize';
import _ from 'lodash';
import * as puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

db.sequelize.sync();

const Record = db.Record;
const User = db.User;

const withMiddleware = use(authorize);

const readFile = async (filename) =>
  new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });

const generatePdf = async (user, record) => {
  const templateHTMLPath = path.join(
    process.cwd(),
    '/templates/record/template.html'
  );
  const templateCSSPath = path.join(
    process.cwd(),
    '/templates/record/template.css'
  );

  const template = await readFile(templateHTMLPath);
  const css = await readFile(templateCSSPath);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--fast-start', '--ignore-certificate-errors'],
  });
  const page = await browser.newPage();

  const dateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const beginOfWeek = new Date(record.beginOfWeek).toLocaleDateString(
    'de-DE',
    dateOptions
  );
  const endOfWeek = new Date(record.endOfWeek).toLocaleDateString(
    'de-DE',
    dateOptions
  );
  const dateOfBirth = new Date(user.dateofbirth).toLocaleDateString(
    'de-DE',
    dateOptions
  );

  const compiled = _.template(template);
  const html = compiled({
    beginOfWeek,
    endOfWeek,
    dateOfBirth,
    user,
    record,
    css,
  });

  await page.setContent(html);
  const pdfBuffer = await page.pdf({
    path: './pdf.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      right: '2cm',
      left: '2cm',
      top: '3cm',
      bottom: '3cm',
    },
  });
  await browser.close();

  return pdfBuffer;
};

const apiRouteHandler = async (req, res) => {
  const { identnumber } = req.body;
  try {
    const record = await Record.findOne({
      where: { identnumber, id: req.query.recordId },
    });
    const user = await User.findOne({
      where: { identnumber },
    });
    if (record && user) {
      const buffer = await generatePdf(user, record);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=record.pdf');
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', 0);

      res.status(200).send(buffer);
    } else {
      return res
        .status(404)
        .json({ error: 'No record found for this identnumber and recordId.' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error when generating pdf for single record.' });
  }
};

export default withMiddleware(apiRouteHandler);
