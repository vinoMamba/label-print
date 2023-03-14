import { compile } from "handlebars";
import { apiData } from "./apiData";
import { toDataURL } from "qrcode";

type RenderData = {
  labelType: 1 | 2 | 3 | 4;
  labelHeight: number;
  labelWidth: number;
  fontSize: number;
  logoUrl: string;
  labelList: LabelData[];
};
type LabelData = {
  logoUrl: string;
  qrCode: string;
  fieldList: { fieldName: string; fieldValue: string }[];
};

async function generatePrintList(): Promise<RenderData | null> {
  const { assetLabel, assetInfoList, logoUrl } = apiData;
  if (assetInfoList.length === 0) return null;
  const { labelHeight, labelWidth, fontSize, labelType } = assetLabel;
  const labelList = (await createLabelList(
    assetInfoList,
    logoUrl
  )) as LabelData[];
  return {
    labelType,
    labelHeight,
    labelWidth,
    fontSize,
    labelList,
  } as RenderData;
}

async function createLabelList(assetInfoList: any, logoUrl: string) {
  const labelList = assetInfoList.map(async (item: any) => {
    const qrCode = await createQrCode(item.qrCodeUrl);
    return {
      qrCode,
      logoUrl,
      fieldList: item.assetLabelFieldList,
    };
  });
  try {
    const list = await Promise.all(labelList);
    return list;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function createQrCode(qrCode: string) {
  const str = await toDataURL(qrCode);
  return str;
}
const labelOne = `
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>圆资产-打印模板</title>
    <style>
      @media print {
        :root{
          --labelWidth: {{labelWidth}}mm;
          --labelHeight: {{labelHeight}}mm;
          --fontSizes: {{fontSizes}}pt;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: rgb(176, 173, 173);
          height: var(--labelHeight);
        }
        section {
          background-color: white;
          width: var(--labelWidth);
          height: var(--labelHeight);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content:space-between;
          font-size: var(--fontSizes);
          page-break-after: always;
        }
        img {
          width: calc(var(--labelHeight) - 2mm);
          height: calc(var(--labelHeight) - 2mm);
        }
        img.logo {
          margin-top: 2mm;
          width: calc(var(--labelHeight) - 10mm);
          height: calc(var(--labelHeight)/ 3);
        }
        div {
          flex-grow: 1;
          height:var(--labelHeight);
          display: flex;
          flex-direction: column;
          padding:8px
        }
        span {
          white-space: nowrap;
        }
      }
      @page {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    {{#each labelList}}
       <section>
          <img src="{{qrCode}}" alt="" />
          <div>
            {{#if logoUrl}}
              <img class="logo" src="{{logoUrl}}" alt="" />
            {{/if}}
            {{#each fieldList}}
              <p>{{fieldName}}：<span>{{fieldValue}}</span></p>
            {{/each}}
          </div>
      </section>
    {{/each}}
  </body>
</html>
`;

const labelTwo = `
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>圆资产-打印模板</title>
    <style>
      @media print {
        :root{
          --labelWidth: {{labelWidth}}mm;
          --labelHeight: {{labelHeight}}mm;
          --fontSizes: {{fontSizes}}pt;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: rgb(176, 173, 173);
          height: var(--labelHeight);
        }
        section {
          background-color: white;
          width: var(--labelWidth);
          height: var(--labelHeight);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content:center;
          font-size: var(--fontSizes);
          page-break-after: always;
        }
        img {
          width: calc(var(--labelHeight) - 10mm);
          height: calc(var(--labelHeight) - 10mm);
        }
        div {
          display: flex;
          align-items: center;
          justify-content:flex-end;
        }
        span {
          white-space: nowrap;
        }
      }
      @page {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    {{#each labelList}}
       <section>
          <div>
            {{#each fieldList}}
              <span>{{fieldValue}}</span>
            {{/each}}
          </div>
          <img src="{{qrCode}}" alt="" />
      </section>
    {{/each}}
  </body>
</html>
`;
const labelThree = `
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>圆资产-打印模板</title>
    <style>
      @media print {
        :root{
          --labelWidth: {{labelWidth}}mm;
          --labelHeight: {{labelHeight}}mm;
          --fontSizes: {{fontSizes}}pt;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background-color: rgb(176, 173, 173);
          height: var(--labelHeight);
        }
        section {
          background-color: white;
          width: var(--labelWidth);
          height: var(--labelHeight);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content:center;
          font-size: var(--fontSizes);
          page-break-after: always;
        }
        img {
          width: calc(var(--labelHeight) - 10mm);
          height: calc(var(--labelHeight) - 10mm);
        }
        div {
          display: flex;
          align-items: center;
        }
        span {
          white-space: nowrap;
        }
      }
      @page {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    {{#each labelList}}
       <section>
          <img src="{{qrCode}}" alt="" />
          <div>
            {{#each fieldList}}
              <span>{{fieldValue}}</span>
            {{/each}}
          </div>
      </section>
    {{/each}}
  </body>
</html>
`;

export const createHtml = async () => {
  const data = await generatePrintList();
  if (!data) return;
  function getLabelStrByType(type: number) {
    switch (type) {
      case 1:
        return labelOne;
      case 2:
        return labelTwo;
      case 3:
        return labelThree;
      default:
        return labelOne;
    }
  }
  const template = compile(getLabelStrByType(data.labelType));
  const html = template(data);
  return html;
};
