import { compile } from "handlebars";
import { apiData } from "./apiData";

async function generateLabelList(): Promise<RenderData | null> {
  const { assetLabel, assetInfoList, logoUrl } = apiData;
  if (assetInfoList.length === 0) return null;
  const { labelHeight, labelWidth, fontSize } = assetLabel;
  const labelList = (await createLabelList(assetInfoList)) as LabelData[];
  return {
    labelHeight,
    labelWidth,
    fontSize,
    labelList,
    logoUrl,
  } as RenderData;
}
async function createLabelList(assetInfoList: any) {
  const labelList = assetInfoList.map(async (item: any) => {
    const qrCode = await createQrCode(item.qrCodeUrl);
    return {
      qrCode,
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
  //TODO: create qrCode
  const str = await Promise.resolve(qrCode);
  return str;
}

type RenderData = {
  labelHeight: number;
  labelWidth: number;
  fontSize: number;
  logoUrl: string;
  labelList: LabelData[];
};
type LabelData = {
  qrCode: string;
  fieldList: { fieldName: string; fieldValue: string }[];
};
const labelList = Array.from({ length: 10 }).map(() => ({
  qrCode:
    "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
  fieldList: [
    { fieldName: "资产名称", fieldValue: "测试资产" },
    { fieldName: "资产分类", fieldValue: "测试分类" },
  ],
}));

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
          border: 1px solid black;
          background-color: white;
          width: var(--labelWidth);
          height: var(--labelHeight);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--fontSizes);
          page-break-after: always;
        }
        img {
          border: 1px solid black;
          width: calc(var(--labelHeight) - 2mm);
          height: calc(var(--labelHeight) - 2mm);
        }
        img.logo {
          width: calc(var(--labelHeight) - 2mm);
          height: calc(var(--labelHeight) / 2);
        }
        div {
          border: 1px solid black;
          height:var(--labelHeight);
          margin-left: 4mm;
          display: flex;
          flex-direction: column;
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
       <section id="label-1">
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
const template = compile(labelOne);

export const createHtml = async () => {
  const data = await generateLabelList();
  if (!data) return;
  const html = template(data);
  return html;
};
