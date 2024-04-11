<template>
  <div
    v-if="visible"
    class="modal-overlay"
  >
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button
        v-if="confirmShow"
        class="modal-button"
        @click="confirm"
      >
        Confirm
      </button>
      <button
        class="modal-button"
        @click="cancel"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const props = defineProps({
  visible: Boolean,
  title: String,
  message: String,
  confirmShow: Boolean
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.modal-button {
    background-color: #6320EE;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 15px 30px;
    font-family: 'Karla', sans-serif;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 1; 
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 0 5px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.modal-button:hover {
    background-color: darken(#6320EE, 10%);
}
</style>
