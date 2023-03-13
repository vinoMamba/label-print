import { defineComponent, ref } from "vue";
import imgUrl from "./assets/print.png";
import { createHtml } from "./print";

export const App = defineComponent({
  name: "App",
  setup() {
    const printLabel = async () => {
      const result = await createHtml();
      if (!result) return;
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.contentWindow?.document.write(result);
      iframe.contentWindow?.document.close();
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    };
    return () => (
      <main>
        <img src={imgUrl} />
        <p>请使用Chrome浏览器，以获得最佳打印效果</p>
        {/* <iframe srcdoc={result.value}></iframe> */}
        <div class="button-wrapper">
          <button onClick={printLabel}>打印</button>
          <button>关闭</button>
        </div>
      </main>
    );
  },
});
