<script setup lang="ts">
import { ref } from 'vue';
import { Renderer, Camera, Scene, Group, Box, MatcapMaterial } from 'troisjs';
import { DefaultLoadingManager } from 'three';
import anime from 'animejs';

const size = 1;
const spacing = 0.25;
const increment = size + spacing;
const quantity = 3;
const position = spacing * 2 - quantity;

const renderer = ref<InstanceType<typeof Renderer>>(null!);
const camera = ref<InstanceType<typeof Camera>>(null!);
const scene = ref<InstanceType<typeof Scene>>(null!);
const group = ref<InstanceType<typeof Group>>(null!);
const boxes = ref<InstanceType<typeof Box>[]>(null!);
const material = ref<InstanceType<typeof MatcapMaterial>>(null!);

function animate() {
  const scales = boxes.value.map((box) => ({
    x: box.mesh?.scale.x || 0,
    y: box.mesh?.scale.y || 0,
    z: box.mesh?.scale.z || 0,
  }));

  anime({
    targets: scales,
    x: [
      { value: 1.25, duration: 250 },
      { value: 1, duration: 250 },
    ],
    y: [
      { value: 1.25, duration: 250 },
      { value: 1, duration: 250 },
    ],
    z: [
      { value: 1.25, duration: 250 },
      { value: 1, duration: 250 },
    ],
    easing: 'cubicBezier(1, -.6, .25, 1)',
    loop: true,
    delay: anime.stagger(50, { grid: [3, 9], from: 'last' }),
    update() {
      scales.forEach((scale, index) => {
        const mesh = boxes.value[index]?.mesh;

        if (!mesh) return;

        mesh.scale.x = scale.x;
        mesh.scale.y = scale.y;
        mesh.scale.z = scale.z;
      });
    },
  });
}

function init() {
  animate();
}

DefaultLoadingManager.onLoad = init;
</script>

<template>
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
      <Group
        ref="group"
        :position="{
          x: position,
          y: position,
          z: position,
        }"
      >
        <template v-for="i in quantity">
          <template v-for="j in quantity">
            <template v-for="k in quantity">
              <Box
                ref="boxes"
                :width-segments="10"
                :height-segments="10"
                :depth-segments="10"
                :size="size"
                :position="{
                  x: i * increment,
                  y: j * increment,
                  z: k * increment,
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
</template>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
