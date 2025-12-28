<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'

const tabIndex = ref('1')
const cmcSwitch: Ref<boolean> = ref(false)
const idevSwitch: Ref<boolean> = ref(false)
const finishedReset: Ref<boolean> = ref(false)
// const devSwitch: Ref<boolean> = ref(false)
// const devInfo: Reactive<{ userCode: string; userID: string }> = reactive({
//   userCode: '',
//   userID: '',
// })
const version = chrome.runtime.getManifest().version
// const version = '0.1.0'
onBeforeMount(() => {
  chrome.storage.local.get(
    ['cmcSwitch', 'idevSwitch'],
    (res: { cmcSwitch?: boolean; idevSwitch?: boolean }) => {
      if (res.cmcSwitch !== undefined) {
        cmcSwitch.value = res.cmcSwitch
      }
      if (res.idevSwitch !== undefined) {
        idevSwitch.value = res.idevSwitch
      }
    },
  )
})
function handleSwitchChange(switchRef: boolean, key: string) {
  console.log(`${key} sending:`, switchRef)
  chrome.storage.local.set({ [key]: switchRef }, () => {
    console.log(`${key} saved:`, switchRef)
  })
}
function resetExtension() {
  chrome.storage.local.clear(() => {
    console.log('Extension settings have been reset.')
    finishedReset.value = true
    cmcSwitch.value = false
    idevSwitch.value = false
  })
}
</script>

<template>
  <div style="width: 300px; font-size: 18px; font-weight: 600; margin: 10px">
    <div class="bocomatic-header">
      <span class="title">Bocomatic</span>
      <span class="version">v{{ version }}</span>
    </div>
    <a-tabs v-model:activeKey="tabIndex" centered>
      <a-tab-pane key="1" tab="设置">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <div>开启CMC快捷操作</div>
          <a-switch
            v-model:checked="cmcSwitch"
            checked-children="开"
            un-checked-children="关"
            @change="(checked: boolean) => handleSwitchChange(checked, 'cmcSwitch')"
          />
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <div>开启idev快捷操作<a-tag color="warning">暂不开放</a-tag></div>
          <a-switch
            v-model:checked="idevSwitch"
            checked-children="开"
            un-checked-children="关"
            @change="(checked: boolean) => handleSwitchChange(checked, 'idevSwitch')"
            disabled
          />
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <div>重置插件</div>
          <a-button danger @click="resetExtension" :disabled="finishedReset" size="small">{{
            finishedReset ? '已重置' : '重置'
          }}</a-button>
        </div>

        <!-- <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <div>自定义参数<a-tag color="error">谨慎开启</a-tag></div>
          <a-switch v-model:checked="devSwitch" checked-children="开" un-checked-children="关" />
        </div>
        <a-input-search
          v-if="devSwitch"
          v-model:value="devInfo.userCode"
          placeholder="变更userCode"
          size="large"
          @search="console.log(devInfo.userCode)"
          style="margin-bottom: 10px"
        >
          <template #addonBefore>
            <div style="width: 50px">urCode</div>
          </template>
          <template #enterButton>
            <a-button>确认</a-button>
          </template>
        </a-input-search>
        <a-input-search
          v-if="devSwitch"
          v-model:value="devInfo.userID"
          placeholder="变更userID"
          size="large"
          @search="console.log(devInfo.userID)"
        >
          <template #addonBefore>
            <div style="width: 50px">userID</div>
          </template>
          <template #enterButton>
            <a-button>确认</a-button>
          </template>
        </a-input-search> -->
        <div
          style="
            font-size: 10px;
            line-height: 12px;
            font-weight: 400;
            color: gray;
            text-align: center;
          "
        >
          变更后刷新页面生效
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="关于" force-render>
        <div style="margin-bottom: 10px; font-size: 14px; line-height: 20px; font-weight: 400">
          为相应平台增加快捷操作以简化流程，请提交前仔细检查对应内容，确保无误。<br />
          所有操作默认以登录用户为执行角色。<br />
          本插件所有结果仅供参考，实际以平台展示为准。<br />
        </div>
        <div
          style="
            font-size: 10px;
            line-height: 12px;
            font-weight: 400;
            color: gray;
            text-align: center;
          "
        >
          2025 | By cosz
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style scoped lang="less">
.bocomatic-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: left; /* 标题居中 */
  height: 22px;
  color: black;
  font-weight: 900;
  font-size: 20px;
  border-radius: 8px;
  .version {
    position: absolute;
    right: 10px;
    bottom: 5px;
    font-size: 12px;
    font-weight: normal;
    opacity: 0.7;
  }
  .title {
    z-index: 1; /* 确保在 version 之上 */
    overflow: hidden;
    animation: reveal 1s ease forwards;
    @keyframes reveal {
      from {
        clip-path: inset(0 100% 0 0);
      }
      to {
        clip-path: inset(0 0 0 0);
      }
    }
  }
}

:deep(.ant-tabs-nav-list) {
  display: flex; /* tab 容器用 flex */
  width: 100%; /* 宽度 100% */
}
:deep(.ant-tabs-tab) {
  flex: 1; /* 平分宽度 */
  text-align: center; /* 文字居中 */
}
</style>
