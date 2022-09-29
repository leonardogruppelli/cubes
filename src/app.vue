<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Renderer, Camera, Scene, Group, Box, MatcapMaterial } from 'troisjs';
import { Vector3 } from 'three';
import anime from 'animejs';

import { DurationsEnum } from './types';

const size = 1;
const spacing = 0.25;
const increment = size + spacing;
const rows = 3;
const lines = 3;
const columns = 3;

const renderer = ref<InstanceType<typeof Renderer>>(null!);
const camera = ref<InstanceType<typeof Camera>>(null!);
const scene = ref<InstanceType<typeof Scene>>(null!);
const cube = ref<InstanceType<typeof Group>>(null!);
const groups = ref<InstanceType<typeof Group>[]>(null!);
const boxes = ref<InstanceType<typeof Box>[]>(null!);
const material = ref<InstanceType<typeof MatcapMaterial>>(null!);
const loading = ref<boolean>(true);

function enter(element: HTMLElement, complete: () => void) {
  anime({
    targets: element,
    opacity: [0, 1],
    easing: 'linear',
    duration: DurationsEnum.ANIMATION,
    complete,
  });
}

function leave(element: HTMLElement, complete: () => void) {
  anime({
    targets: element,
    opacity: [1, 0],
    easing: 'linear',
    duration: DurationsEnum.ANIMATION,
    complete,
  });
}

function center() {
  const center = new Vector3();
  const children = boxes.value;
  const count = children.length;

  for (let index = 0; index < count; index++) {
    center.add(children[index].position as Vector3);
  }

  center.divideScalar(count);

  cube.value.group.position.x = -center.x;
  cube.value.group.position.y = -center.y;
  cube.value.group.position.z = -center.z;
}

function load() {
  const targets = document.querySelectorAll('[class*=loader-]');

  anime({
    targets,
    rotate(_el: HTMLElement, index: number) {
      const even = index % 2 === 0;

      return even ? 360 : -360;
    },
    duration: DurationsEnum.ANIMATION,
    easing: 'linear',
    loop: true,
  });
}

function presentate() {
  setTimeout(() => {
    loading.value = false;
  }, DurationsEnum.TIMEOUT);
}

function animate() {
  // anime({
  //   targets: groups.value[2].group.rotation,
  //   z: 2,
  // });
  // const targets = groups.value.map((group) => ({
  //   x: group.group.rotation?.x || 0,
  //   y: group.group?.rotation?.y || 0,
  //   z: group.group?.rotation?.z || 0,
  // }));
  // anime({
  //   targets,
  //   x: [
  //     { value: 1.15, duration: 250 },
  //     { value: 1, duration: 250 },
  //   ],
  //   y: [
  //     { value: 1.15, duration: 250 },
  //     { value: 1, duration: 250 },
  //   ],
  //   z: [
  //     { value: 1.15, duration: 250 },
  //     { value: 1, duration: 250 },
  //   ],
  //   easing: 'cubicBezier(1, -.6, .25, 1)',
  //   loop: true,
  //   delay: anime.stagger(50, { grid: [3, 9], from: 'last' }),
  //   update() {
  //     scales.forEach((scale, index) => {
  //       const mesh = boxes.value[index]?.mesh;
  //       if (!mesh) return;
  //       mesh.scale.x = scale.x;
  //       mesh.scale.y = scale.y;
  //       mesh.scale.z = scale.z;
  //     });
  //   },
  // });
}

function start() {
  center();
  load();
  presentate();
}

function init() {
  start();

  renderer.value.onAfterRender(animate);
}

onMounted(init);
</script>

<template>
  <transition
    appear
    @enter="enter"
    @leave="leave"
  >
    <div
      v-if="loading"
      class="loader"
    >
      <div class="loader-large center"></div>

      <div class="loader-medium center"></div>

      <div class="loader-small center"></div>

      <div class="loader-tiny center"></div>

      <h1 class="title">Cubes</h1>
    </div>
  </transition>

  <div
    class="renderer"
    :class="{
      hidden: loading,
    }"
  >
    <Renderer
      ref="renderer"
      :orbit-ctrl="{
        autoRotate: true,
        enableZoom: false,
      }"
      antialias
      resize
      shadow
    >
      <Camera
        ref="camera"
        :position="{
          z: 10,
        }"
      />

      <Scene
        ref="scene"
        background="#111111"
      >
        <Group ref="cube">
          <Group
            v-for="row in rows"
            ref="groups"
          >
            <Group
              v-for="line in lines"
              ref="groups"
            >
              <Box
                v-for="column in columns"
                ref="boxes"
                :width-segments="10"
                :height-segments="10"
                :depth-segments="10"
                :size="size"
                :position="{
                  x: row * increment,
                  y: line * increment,
                  z: column * increment,
                }"
                receive-shadow
                cast-shadow
              >
                <MatcapMaterial
                  ref="material"
                  name="2E763A_78A0B7_B3D1CF_14F209"
                />
              </Box>
            </Group>
          </Group>
        </Group>
      </Scene>
    </Renderer>
  </div>
</template>
