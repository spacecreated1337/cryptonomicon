<template>
  <div
    v-if="helper.length > 0"
    class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
  >
    <span
      v-for="coin in helper"
      :key="coin.id"
      @click="add(coin)"
      class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
    >
      {{ coin }}
    </span>
  </div>
  <div v-if="alreadyAdd" class="text-sm text-red-600">
    Такой тикер уже добавлен
  </div>
</template>
<script>
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
  data() {
    return {
      ticker: ""
    };
  },
  emits: {
    "add-coin": coinName => {
      if (typeof coinName === "string") {
        return true;
      } else {
        console.warn(`Invalid submit event payload on TickersHelper!`);
        return false;
      }
    }
  },
  methods: {
    add(coin) {
      this.ticker = coin;
      this.$emit("add-coin", this.ticker);
    }
  }
};
</script>
