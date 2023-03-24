import { defineComponent, ref, onMounted } from "vue";
import imgUrl from "./assets/print.png";
import { createHtml, generatePrintList, type RenderData } from "./print";
import axios from "axios";

export const App = defineComponent({
  name: "App",
  setup() {
    const disabled = ref(0);
    const printList = ref<RenderData | null>(null);
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("auth");
      const downloadLogoIds = urlParams.get("ids");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      axios
        .get(`${import.meta.env.VITE_API_URL}/asset/label/export`, {
          params: {
            downloadLogoIds,
            downloadType: 1,
          },
        })
        .then(async function (response) {
          const { assetLabel, assetInfoList, logoUrl } = response.data.data;
          printList.value = await generatePrintList({
            assetLabel,
            assetInfoList,
            logoUrl,
          });
          disabled.value = 1;
        })
        .catch(function (error) {
          console.log(error);
          disabled.value = -1;
        })
        .then(function () {
          // always executed
        });
    });

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
      console.log("print");
      console.log(printList.value);
      result.value = await createHtml(printList.value);
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
        <iframe srcdoc={result.value}></iframe>
        <div class="mt-4">
          {disabled.value === 0 ? (
            <button disabled class="cursor-not-allowed">
              正在加载标签...
            </button>
          ) : disabled.value === 1 ? (
            <button onClick={printLabel}>打印</button>
          ) : (
            <button disabled class="cursor-not-allowed">
              标签加载失败
            </button>
          )}
          <button onClick={() => window.close()}>关闭</button>
        </div>
      </main>
    );
  },
});
