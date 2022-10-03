<script setup lang="ts">
import { onMounted } from 'vue';
import anime from 'animejs';

import { TimerEnum } from '@/types/timer';

function animate() {
  const targets = document.querySelectorAll('[class*=loader-]');

  anime({
    targets,
    rotate(_el: HTMLElement, index: number) {
      const even = index % 2 === 0;

      return even ? 360 : -360;
    },
    duration: TimerEnum.FADE,
    easing: 'linear',
    loop: true,
  });
}

onMounted(animate);
</script>

<template>
  <div class="loader">
    <div class="loader-large center"></div>

    <div class="loader-medium center"></div>

    <div class="loader-small center"></div>

    <div class="loader-tiny center"></div>

    <h1 class="title">Cubes</h1>
  </div>
</template>

<style>
.loader {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #111111;
  color: #ffffff;
}

.loader-large,
.loader-medium,
.loader-small,
.loader-tiny {
  aspect-ratio: 1;
  margin: auto;
  border: 4px solid #333333;
  border-radius: 50%;
}

.loader-large {
  width: min(50vw, 50vh);
  border-top-color: #3de068;
}

.loader-medium {
  width: min(45vw, 45vh);
  border-right-color: #3d84e0;
}

.loader-small {
  width: min(40vw, 40vh);
  border-bottom-color: #6b3de0;
}

.loader-tiny {
  width: min(35vw, 35vh);
  border-left-color: #e6702c;
}

.title {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: min(7vw, 7vh);
  font-weight: 100;
  text-transform: uppercase;
  transform: translate(-50%, -50%);
}
</style>
