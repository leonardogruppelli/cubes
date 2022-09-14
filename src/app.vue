<script setup lang="ts">
import { ref, onMounted, render } from 'vue';
import { Renderer, Camera, Scene, Group, Box, MatcapMaterial } from 'troisjs';
import anime from 'animejs';

const size = 1;
const spacing = 0.25;
const increment = size + spacing;
const quantity = 3;
const position = spacing * 2 - quantity;

const renderer = ref<InstanceType<typeof Renderer>>(null!);
const group = ref<InstanceType<typeof Group>>(null!);
const boxes = ref<InstanceType<typeof Box>[]>(null!);

function animate() {
  const scales = boxes.value.map((box) => ({
    x: box.mesh.scale.x,
    y: box.mesh.scale.y,
    z: box.mesh.scale.z,
  }));

  anime({
    targets: scales,
    x: 1.25,
    y: 1.25,
    z: 1.25,
    direction: 'alternate',
    easing: 'cubicBezier(1, -.6, .25, 1)',
    loop: true,
    delay: anime.stagger(15),
    update() {
      scales.forEach((scale, index) => {
        if (!boxes.value[index]) return;

        boxes.value[index].mesh.scale.x = scale.x;
        boxes.value[index].mesh.scale.y = scale.y;
        boxes.value[index].mesh.scale.z = scale.z;
      });
    },
  });
}

function init() {
  window.addEventListener('load', animate);
}

onMounted(init);
</script>

<template>
  <Renderer
    ref="renderer"
    :orbit-ctrl="{
      autoRotate: true,
      enableDamping: true,
      dampingFactor: 0.05,
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
                <MatcapMaterial name="2E763A_78A0B7_B3D1CF_14F209" />
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
