import { defineComponent } from "vue";
interface Block {
  id: number;
  type: "field" | "qrCode" | "logo" | "customText";
  focus: boolean;
  options: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  selfOptions: Recordable;
}
interface LabelData {
  container: {
    width: number;
    height: number;
  };
  block: Array<Block>;
}

export const CustomLabel = defineComponent({
  name: "CustomLabel",
  props: {
    json: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const str =
      '{"block": [{"id": 1678352597829, "type": "qrCode", "focus": false, "options": {"top": 34, "left": 11, "width": 116, "height": 116}, "selfOptions": {}}, {"id": 1678352614756, "type": "qrCode", "focus": false, "options": {"top": 34, "left": 127, "width": 116, "height": 122}, "selfOptions": {}}, {"id": 1678352624115, "type": "field", "focus": true, "options": {"top": 34, "left": 263, "width": 109, "height": 22}, "selfOptions": {"bold": false, "fontSize": 14, "fieldName": "资产分类", "hideTitle": false, "fieldValue": "classification"}}], "container": {"width": 400, "height": 200}}';
    const labelData: LabelData = JSON.parse(str);
    return () => (
      <div
        class="relative overflow-hidden"
        style={{
          border: "1px solid #000",
          height: labelData.container.height + "px",
          width: labelData.container.width + "px",
        }}
      >
        {labelData.block.map((item) => {
          return <div class="">{item.type}</div>;
        })}
      </div>
    );
  },
});
