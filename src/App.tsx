import { defineComponent } from "vue";
import imgUrl from "./assets/print.png";

export const App = defineComponent({
  name: "App",
  setup() {
    return () => (
      <main>
        <img src={imgUrl} />
        <p>请使用Chrome浏览器，以获得最佳打印效果</p>
        <div class="button-wrapper">
          <button>打印</button>
          <button>关闭</button>
        </div>
      </main>
    );
  },
});
