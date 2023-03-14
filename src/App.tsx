import { defineComponent, ref } from "vue";
import imgUrl from "./assets/print.png";
import { createHtml } from "./print";

export const App = defineComponent({
  name: "App",
  setup() {
    const result = ref();
    //图片全部加载完成后再打印
    function getLoadPromise(iframe: HTMLIFrameElement) {
      const imgList = iframe.contentWindow?.document.querySelectorAll("img");
      if (!imgList) return Promise.resolve();
      if (imgList.length === 0) {
        return Promise.resolve();
      }
      let finishedCount = 0;
      return new Promise<void>((resolve) => {
        function check() {
          finishedCount++;
          if (finishedCount === imgList!.length) {
            resolve();
          }
        }
        imgList.forEach((img) => {
          img.addEventListener("load", check);
          img.addEventListener("error", check);
        });
      });
    }
    const printLabel = async () => {
      result.value = await createHtml();
      if (!result.value) return;
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.contentWindow?.document.write(result.value);
      await getLoadPromise(iframe);
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
