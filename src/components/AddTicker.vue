<template>
  <div>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add"
            @input="searchingCoins"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <ticker-helper
          @add-coin="add"
          :helper="helper"
          :alreadyAdd="alreadyAdd"
        />
      </div>
    </div>

    <add-button type="button" @click="add" />
  </div>
</template>
<script>
import AddButton from "./AddButton.vue";
import TickerHelper from "./TickerHelper.vue";
export default {
  props: {
    helper: {
      type: Array,
      required: false
    },
    alreadyAdd: {
      type: Boolean,
      required: false
    }
  },
  components: {
    AddButton,
    TickerHelper
  },
  emits: {
    "add-ticker": coinName => {
      if (typeof coinName === "string") {
        return true;
      } else {
        console.warn(`Invalid submit event payload on AddTicker!`);
        return false;
      }
    },
    "search-coin": tickerName => {
      if (typeof tickerName === "string") {
        return true;
      } else {
        console.warn(`Invalid submit event payload on AddTicker!`);
        return false;
      }
    }
  },
  data() {
    return {
      ticker: ""
    };
  },
  methods: {
    add(coinName) {
      if (this.ticker == "") {
        return;
      }
      if (typeof coinName === "string") {
        this.ticker = coinName;
      }
      this.$emit("add-ticker", this.ticker);
      this.$nextTick().then(() => {
        if (!this.alreadyAdd) {
          this.ticker = "";
        }
      });
    },

    searchingCoins() {
      this.$emit("search-coin", this.ticker);
    }
  }
};
</script>
