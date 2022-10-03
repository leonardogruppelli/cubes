<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Renderer, Camera, Scene, Group, Box, MatcapMaterial } from 'troisjs';
import { Vector3, Object3D, Box3, Group as Pivot, Mesh } from 'three';
import anime from 'animejs';

import { TimerEnum } from './types/timer';
import { DirectionType, AxisType } from './types/direction';

const size = 1;
const spacing = 0.25;
const quantity = 3;
const increment = size + spacing;

const cube = ref<InstanceType<typeof Group>>(null!);
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
    animate();

    loading.value = false;
  }, TimerEnum.TIMEOUT);
}

function nearby(current: number, value: number) {
  return Math.abs(current - value) <= 0.001;
}

function wrapper(axis: AxisType) {
  const index = Math.floor(Math.random() * boxes.value.length);
  const mesh = boxes.value[index].mesh;
  const meshes: Mesh[] = [];

  boxes.value.forEach((box) => {
    if (nearby(box.mesh?.position[axis]!, mesh?.position[axis]!)) {
      meshes.push(box.mesh!);
    }
  });

  const object = new Object3D();

  meshes.forEach((mesh) => object.add(mesh!));

  const box = new Box3().setFromObject(object);

  box.getCenter(object.position);

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

function clear(pivot: Pivot) {
  pivot.rotation.x = 0;
  pivot.rotation.y = 0;

  animate();
}

function animate() {
  const direction: DirectionType = Math.round(Math.random())
    ? 'forwards'
    : 'backwards';
  const axis: AxisType = Math.round(Math.random()) ? 'x' : 'y';
  const pivot = wrapper(axis);
  const value = direction === 'forwards' ? Math.PI / 2 : -Math.abs(Math.PI / 2);

  anime({
    targets: pivot.rotation,
    [axis]: value,
    duration: TimerEnum.ROTATE,
    easing: 'easeOutQuint',
    complete: () => clear(pivot),
  });
}

function start() {
  center();
  load();
  presentate();
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
      :orbit-ctrl="{
        autoRotate: true,
        enableZoom: false,
      }"
      antialias
      resize
      shadow
    >
      <Camera
        :position="{
          z: 10,
        }"
      />

      <Scene background="#111111">
        <Group ref="cube">
          <template v-for="row in quantity">
            <template v-for="line in quantity">
              <template v-for="column in quantity">
                <Box
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
            </template>
          </template>
        </Group>
      </Scene>
    </Renderer>
  </div>
</template>
