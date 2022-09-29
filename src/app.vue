<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Renderer, Camera, Scene, Group, Box, MatcapMaterial } from 'troisjs';
import { Vector3, Object3D, Box3, Group as Pivot } from 'three';
import anime from 'animejs';

import { TimerEnum } from './types/timer';
import { DirectionType } from './types/direction';

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
    duration: TimerEnum.FADE,
    complete,
  });
}

function leave(element: HTMLElement, complete: () => void) {
  anime({
    targets: element,
    opacity: [1, 0],
    easing: 'linear',
    duration: TimerEnum.FADE,
    complete,
  });
}

function center() {
  const center = new Vector3();
  const count = boxes.value.length;

  boxes.value.forEach((box) => {
    center.add(box.position as Vector3);
  });

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
    duration: TimerEnum.FADE,
    easing: 'linear',
    loop: true,
  });
}

function presentate() {
  setTimeout(() => {
    loading.value = false;
  }, TimerEnum.TIMEOUT);
}

function createPivot() {
  const index = Math.floor(Math.random() * rows);

  const object = new Object3D();

  object.add(groups.value[index].group);

  const box = new Box3().setFromObject(object);

  box.center(object.position);

  object.position.multiplyScalar(-1);

  const pivot = new Pivot();

  pivot.add(object);

  const center = new Vector3();

  pivot.children.forEach((box) => {
    center.add(box.position as Vector3);
  });

  const x = Math.abs(center.x);
  const y = Math.abs(center.y);
  const z = Math.abs(center.z);

  pivot.position.set(x, y, z);

  cube.value.add(pivot);

  return pivot;
}

function animate() {
  const direction: DirectionType = Math.round(Math.random())
    ? 'forwards'
    : 'backwards';
  const pivot = createPivot();
  const value = direction === 'forwards' ? Math.PI / 2 : -Math.abs(Math.PI / 2);

  anime({
    targets: pivot.rotation,
    x: value,
    duration: TimerEnum.ROTATE,
    easing: 'easeOutQuint',
    complete: animate,
  });
}

function start() {
  center();
  load();
  presentate();
  animate();
}

function init() {
  start();
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
            <template v-for="line in lines">
              <Box
                v-for="column in columns"
                ref="boxes"
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
            </template>
          </Group>
        </Group>
      </Scene>
    </Renderer>
  </div>
</template>
