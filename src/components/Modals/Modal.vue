<template>
  <div
    @click="closeModal"
    class="overflow fixed z-50 modal-overflow flex justify-center"
  >
    <div class="relative mt-16 p-4 w-full max-w-2xl h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex justify-between items-start p-4 rounded-t border-b">
          <h3 class="text-xl font-semibold text-gray-900 ">
            {{ title }}
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center close-modal"
            data-modal-toggle="defaultModal"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <slot name="body"></slot>
        </div>
        <!-- Modal footer -->
        <div
          v-if="showModalSecond"
          class="flex p-6 space-x-2 rounded-b border-t border-gray-200 justify-end"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: "Default Modal Text"
    },
    showModalSecond: {
      type: Boolean,
      required: false
    }
  },
  mounted() {
    document.body.addEventListener("keyup", e => {
      if (e.code == "Escape" || !this.showModalSecond) {
        this.$emit("close-modal");
      }
    });
  },
  methods: {
    closeModal(event) {
      let target = event.target;
      if (!this.showModalSecond) {
        if (
          target.classList.contains("modal-overflow") ||
          target.closest("button")
        ) {
          this.$emit("close-modal");
        }
      }
    }
  }
};
</script>
<style scoped>
.overflow {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: #00000073;
  width: 100%;
  height: 100%;
}
</style>
