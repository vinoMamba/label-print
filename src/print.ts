import Handlebars from "handlebars"

//判断两个值是否相等
Handlebars.registerHelper("if_eq", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

import { toDataURL } from "qrcode";

export type RenderData = {
  labelType: 1 | 2 | 3 | 4;
  labelHeight: number;
  labelWidth: number;
  fontSize: number;
  logoUrl: string;
  blocks: any;
  labelList: LabelData[];
};
type LabelData = {
  logoUrl: string;
  qrCode: string;
  fieldList: { fieldName: string; fieldValue: string }[];
};
export type GenerateParams = {
  assetLabel: {
    labelHeight: number;
    labelWidth: number;
    fontSize: number;
    labelField: string;
    labelType: 1 | 2 | 3 | 4;
  };
  assetInfoList: [];
  logoUrl: string;
};

export async function generatePrintList(
  params: GenerateParams
): Promise<RenderData | null> {
  const { assetLabel, assetInfoList, logoUrl } = params;
  if (assetInfoList.length === 0) return null;
  const { labelHeight, labelWidth, fontSize, labelType } = assetLabel;
  if (labelType === 4) {
    return generateCustom(params)
  } else {
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
}

async function generateCustom(params: GenerateParams) {
  const { assetLabel, assetInfoList, logoUrl } = params;
  const { labelHeight, labelWidth, fontSize, labelType, labelField: labelFieldStr } = assetLabel;
  const labelField = JSON.parse(labelFieldStr)
  const blockList = labelField.block
  const blocks = blockList.map((item: any) => {
    return {
      type: item.type,
      ...item.options,
      ...item.selfOptions,
    }
  })
  if (assetInfoList.length === 0) return null
  const labelList = assetInfoList.map(async (item: any) => {
    const qrCode = await createQrCode(item.qrCodeUrl);
    blocks.forEach((block: any) => {
      if (block.type === 'qrCode') {
        block.fieldValue = qrCode
      }
      else if (block.type === 'logo') {
        block.fieldValue = logoUrl
      } else {
        console.log(block.fieldName)
        console.log(item.assetLabelFieldList)
        item.assetLabelFieldList.forEach((field: any) => {
          if (field.fieldName === block.fieldName) {
            block.fieldValue = field.fieldValue
          }
        })
      }
    })
    return {
      qrCode,
      logoUrl,
      fieldList: blocks
    }
  });
  try {
    const list = await Promise.all(labelList);
    const renderData = {
      labelType,
      labelHeight,
      labelWidth,
      fontSize,
      labelList: list,
    } as RenderData;
    return renderData;
  } catch (error) {
    console.log(error);
    return null
  }
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


const customLabel = `
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
          border: 1px solid black;
          background-color: white;
          width: var(--labelWidth);
          height: var(--labelHeight);
          overflow: hidden;
          position: relative; 
          page-break-after: always;
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
          {{#each fieldList}}
            {{#if_eq type 'qrCode'}}
              <img src="{{fieldValue}}" alt="" style="
                display: block;
                position:absolute;
                top:{{top}}px;
                left:{{left}}px;
                width:{{width}}px;
                height:{{height}}px;
              "/>
            {{/if_eq}}
          {{#if_eq type 'field'}}
           <span style="
                position:absolute; 
                top:{{top}}px;
                left:{{left}}px;
                font-weight:{{fontWeight}};
                font-size:{{fontSize}}px;">
                {{#if hideTitle}}
                  {{fieldValue}}
                {{else}}
                  {{fieldName}}{{fieldValue}}
                {{/if}}
          </span>
          {{/if_eq}}
          {{#if_eq type 'customText'}}
            <span style="
              position:absolute; 
              top:{{top}}px;
              left:{{left}}px;
              font-weight:{{fontWeight}};
              font-size:{{fontSize}}px;">
              {{fieldValue}}
            </span>
          {{/if_eq}}
          {{#if_eq type 'logo'}}
            <img src="{{fieldValue}}" alt="" style="
                  position:absolute;
                  top:{{top}}px;
                  left:{{left}}px;
                  width:{{width}}px;
                  height:{{height}}px;
            "/>
          {{/if_eq}}
          {{/each}}
      </section>
     {{/each}}
  </body>
</html>
`;



export const createHtml = async (data: RenderData | null) => {
  if (!data) return;
  function getLabelStrByType(type: number) {
    switch (type) {
      case 1:
        return labelOne;
      case 2:
        return labelTwo;
      case 3:
        return labelThree;
      case 4:
        return customLabel;
      default:
        return labelOne;
    }
  }
  const template = Handlebars.compile(getLabelStrByType(data.labelType));
  const html = template(data);
  return html;
};
