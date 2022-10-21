<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!-- <div
      class="fixed w-100 h-100 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div> -->
    <div class="container">
      <section>
        <div class="mb-8">
          <button
            @click="showModalFirst = true"
            class="mr-1.5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition duration-500 ease-in-out hover:bg-red-500 transform"
          >
            First modal
          </button>
          <modal
            :showModalFirst="showModalFirst"
            @close="showModalFirst = false"
            v-show="showModalFirst"
          >
            <template v-slot:body>
              <h2>First Modal</h2>
              <p class="text-base leading-relaxed text-gray-500">
                With less than a month to go before the European Union enacts
                new consumer privacy laws for its citizens, companies around the
                world are updating their terms of service agreements to comply.
              </p>
              <p class="text-base leading-relaxed text-gray-500 ">
                The European Union’s General Data Protection Regulation
                (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                common set of data rights in the European Union. It requires
                organizations to notify users as soon as possible of high-risk
                data breaches that could personally affect them.
              </p>
            </template>
          </modal>
          <button
            @click="showModalSecond = true"
            class="mr-1.5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition duration-500 ease-in-out hover:bg-red-500 transform"
          >
            Second modal
          </button>
          <modal
            v-show="showModalSecond"
            @close="showModalSecond = false"
            title="Second Modal Title"
            :showModalSecond="showModalSecond"
            @ok="modalConfirmed"
          >
            <template v-slot:body>
              <h2>
                Введите слово <strong>'Закрыть'</strong>, чтобы закрыть
                модальное окно
              </h2>
            </template>
            <template #footer="{confirm}">
              <input
                type="text"
                v-model="access"
                :placeholder="$options.CONFIRMATION__TEXT"
              />
              <button
                :disabled="!isConfirmationText"
                @click="confirm"
                href="#"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800  cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center "
                :class="{ 'opacity-25': !isConfirmationText }"
              >
                Ok
              </button>
            </template>
          </modal>
        </div>

        <add-ticker
          @add-ticker="add"
          :helper="helper"
          :alreadyAdd="alreadyAdd"
          @search-coin="searchingCoins"
        />
        <div class="mb-3">
          <button
            v-if="page > 1"
            @click="page -= 1"
            class="bg-indigo-300 pb-2 pl-7 pr-7 pt-2 rounded-2xl"
          >
            Назад
          </button>
          <button
            v-if="page * 6 < tickers.length"
            @click="page += 1"
            class="ml-5 bg-indigo-300 pb-2 pl-7 pr-7 pt-2 rounded-2xl"
          >
            Вперед
          </button>
          <p>Страница: {{ page }}</p>
        </div>
        <label class="mt-2">Фильтр:</label>
        <input
          v-model="filter"
          @input="page = 1"
          class="placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm w-1/4"
          placeholder="Найти..."
        />
      </section>
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in filteredTickers"
            :key="t.name"
            @click="selectTicker(t)"
            :class="{
              'border-4': selectedTicker === t
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div
              class="px-4 py-5 sm:p-6 text-center"
              :class="{ 'bg-red-100': t.notExist }"
            >
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="handleDelete(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
        <ticker-graph
          :selectedTicker="selectedTicker"
          :normalizedGraph="normalizedGraph"
          :graph="graph"
          @changeMaxGraphElements="calcMaxGraphElements"
          @close-graph="closeGraph"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "./api";
import AddTicker from "./components/AddTicker.vue";
import TickerGraph from "./components/TickerGraph.vue";
import Modal from "./components/Modals/Modal.vue";
export default {
  name: "App",

  components: {
    AddTicker,
    TickerGraph,
    Modal
  },

  data() {
    return {
      filter: "",
      tickers: [],
      allCoins: [],
      helper: [],
      graph: [],
      selectedTicker: null,
      alreadyAdd: false,
      page: 1,
      maxGraphElements: 1,
      showModalFirst: false,
      showModalSecond: false,
      access: ""
    };
  },

  created() {
    this.loadCoinsList();
    const tickersData = localStorage.getItem("crypto-list");
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach(ticker => {
        subscribeToTicker(ticker.name, newPrice =>
          this.updateTicker(ticker.name, newPrice)
        );
      });
    }
    const windowData = Object.fromEntries([
      ...new URL(window.location).searchParams.entries()
    ]);

    if (windowData.page) {
      this.page = +windowData.page;
    }
    if (windowData.filter) {
      this.filter = windowData.filter;
    }
  },

  mounted() {
    window.addEventListener("storage", event => {
      if (event) {
        this.tickers = JSON.parse(window.localStorage.getItem("crypto-list"));
      }
    });
  },

  computed: {
    isConfirmationText() {
      return this.$options.CONFIRMATION__TEXT === this.access;
    },
    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      if (maxValue == minValue) {
        return this.graph.map(() => 50);
      }
      return this.graph.map(
        price => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },

    filteredTickers() {
      const start = (this.page - 1) * 6;
      const end = this.page * 6;
      return this.tickers
        .filter(ticker => {
          return ticker.name.includes(this.filter.toUpperCase());
        })
        .slice(start, end);
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },
  CONFIRMATION__TEXT: "Закрыть",
  methods: {
    modalConfirmed() {
      this.showModalSecond = false;
      this.access = "";
    },
    closeGraph() {
      this.selectedTicker = null;
    },
    calcMaxGraphElements(maxGraphElements) {
      this.maxGraphElements = maxGraphElements;
      if (this.graph.length > this.maxGraphElements) {
        this.graph.shift();
      }
    },
    updateTicker(tickerName, price) {
      if (localStorage.getItem("notExistingCoins")) {
        JSON.parse(localStorage.getItem("notExistingCoins")).forEach(coin => {
          this.tickers.forEach(ticker => {
            if (ticker.name === coin) {
              ticker.notExist = true;
            }
          });
        });
      }
      this.tickers
        .filter(t => t.name === tickerName)
        .forEach(t => {
          if (t === this.selectedTicker) {
            this.graph.push(price);
          }
          t.price = price;
        });
    },
    formatPrice(price) {
      if (price === "-" || !price) {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(4);
    },

    searchingCoins(ticker) {
      this.alreadyAdd = false;
      this.helper = [];
      if (ticker == "") {
        return;
      }
      this.allCoins.filter(coin => {
        if (
          this.helper.length < 4 &&
          coin.Symbol.includes(ticker.toUpperCase())
        ) {
          this.helper.push(coin.Symbol);
        }
      });
    },

    add(coinName) {
      const currentTicker = {
        name: coinName.toUpperCase(),
        price: "-"
      };
      const matchTicker = this.tickers.find(
        ticker => ticker.name.toUpperCase() == currentTicker.name.toUpperCase()
      );
      if (matchTicker) {
        this.alreadyAdd = true;
      } else {
        this.tickers.push(currentTicker);
        subscribeToTicker(currentTicker.name, newPrice => {
          this.updateTicker(currentTicker.name, newPrice);
        });
        this.helper = [];
        this.alreadyAdd = false;
      }
    },

    async loadCoinsList() {
      const coins = await fetch(
        "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
      ).then(responce => responce.json());
      for (let coin of Object.values(coins.Data)) {
        this.allCoins.push(coin);
      }
    },

    selectTicker(ticker) {
      this.selectedTicker = ticker;
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter(t => t !== tickerToRemove);
      this.selectedTicker = null;
      if (this.filteredTickers.length == 0 && this.page > 1) {
        this.page -= 1;
      }
      unsubscribeFromTicker(tickerToRemove.name);
      let notExistingCoins = JSON.parse(
        localStorage.getItem("notExistingCoins")
      );
      notExistingCoins = notExistingCoins.filter(coin => {
        return coin != tickerToRemove.name;
      });
      localStorage.setItem(
        "notExistingCoins",
        JSON.stringify(notExistingCoins)
      );
    }
  },
  watch: {
    filteredTickers() {
      if (this.filteredTickers.length == 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    selectedTicker() {
      this.graph = [];
    },

    tickers: {
      handler() {
        localStorage.setItem("crypto-list", JSON.stringify(this.tickers));
      },
      deep: true
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions(value) {
      history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    }
  }
};
</script>
