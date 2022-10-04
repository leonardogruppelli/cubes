<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Renderer,
  Camera,
  Scene,
  PointLight,
  Group,
  Box,
  PhongMaterial,
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  HalftonePass,
} from 'troisjs';
import {
  Vector3,
  Object3D,
  Box3,
  Group as Pivot,
  Mesh,
  Color,
  MeshPhongMaterial,
} from 'three';
import anime from 'animejs';

import Loader from '@/components/loader.vue';

import { TimerEnum } from '@/types/timer';
import { DirectionType, AxisType } from '@/types/direction';

const size = 1;
const spacing = 0.25;
const quantity = 3;
const increment = size + spacing;
const colors = [
  new Color(0x3de068),
  new Color(0x3d84e0),
  new Color(0x6b3de0),
  new Color(0xe6702c),
];
const [color] = colors;

const cube = ref<InstanceType<typeof Group>>(null!);
const front = ref<InstanceType<typeof PointLight>>(null!);
const back = ref<InstanceType<typeof PointLight>>(null!);
const boxes = ref<InstanceType<typeof Box>[]>(null!);
const loading = ref<boolean>(true);

function wrapper(axis: AxisType) {
  const index = Math.floor(Math.random() * boxes.value.length);
  const mesh = boxes.value[index].mesh;
  const meshes: Mesh[] = [];

  boxes.value.forEach((box) => {
    if (box.mesh?.position[axis] === mesh?.position[axis]) {
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

  setTimeout(lighting, TimerEnum.FADE);
}

function lighting() {
  const position = new Vector3();

  position.setFromMatrixPosition(front.value.light?.matrixWorld!);

  back.value.light?.position.set(
    Math.abs(position.x) * 2,
    Math.abs(position.y) * 2,
    Math.abs(position.z) * 2
  );
}

function coloring() {
  const [green, blue, purple, orange] = colors;

  boxes.value.forEach((box) => {
    anime({
      targets: [(box.mesh?.material as MeshPhongMaterial).color],
      r: [
        { value: green.r },
        { value: blue.r },
        { value: purple.r },
        { value: orange.r },
      ],
      g: [
        { value: green.g },
        { value: blue.g },
        { value: purple.g },
        { value: orange.g },
      ],
      b: [
        { value: green.b },
        { value: blue.b },
        { value: purple.b },
        { value: orange.b },
      ],
      easing: 'linear',
      direction: 'alternate',
      duration: TimerEnum.COLORING,
      loop: true,
    });
  });
}

function rotate() {
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

function presentate() {
  setTimeout(() => {
    coloring();
    rotate();

    loading.value = false;
  }, TimerEnum.TIMEOUT);
}

function clear(pivot: Pivot) {
  pivot.rotation.x = 0;
  pivot.rotation.y = 0;

  rotate();
}

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

function start() {
  center();
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
    <Loader v-if="loading" />
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

      <Scene background="#000000">
        <Group ref="cube">
          <PointLight ref="front" />

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
                  <PhongMaterial :color="'#' + color.getHexString()" />
                </Box>
              </template>
            </template>
          </template>

          <PointLight ref="back" />
        </Group>
      </Scene>

      <EffectComposer>
        <RenderPass />

        <UnrealBloomPass
          :strength="0.75"
          :radius="0.5"
        />

        <HalftonePass :radius="1" />
      </EffectComposer>
    </Renderer>
  </div>
</template>

<style>
@font-face {
  font-family: 'Montserrat';
  src: url('./assets/fonts/montserrat/thin.woff2') format('woff2'),
    url('./assets/fonts/montserrat/thin.woff') format('woff');
  font-weight: 100;
  font-style: normal;
}

body {
  margin: 0;
  padding: 0;
  background-color: #000000;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.renderer {
  width: 100%;
  height: 100%;
}

.hidden {
  visibility: hidden;
}

.center {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
