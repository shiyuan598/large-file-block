<template>
  <div class="login-container">
      <main>
        <aside>
          <img
            src="../../assets/images/logo-b.png"
            alt="logo"
            title="logo"
            class="logo"
          />

          <div class="title">
            <div class="title__main">挚途云端智能调度系统</div>
          <div class="title__sub">Zhito Cloud Based Intelligent Scheduling System</div>
          </div>
        </aside>
        <div class="card">
          <p>用户登录</p>
          <el-divider />
          <el-form
            ref="loginFormRef"
            :model="loginData"
            class="login-form"
          >
            <el-form-item prop="username">
              <div class="p-2 text-black">
                <svg-icon icon-class="user" />
              </div>
              <el-input
                ref="username"
                v-model="loginData.username"
                class="flex-1"
                size="large"
                :placeholder="$t('login.username')"
                name="username"
              />
            </el-form-item>
            <el-form-item prop="password">
              <span class="p-2 text-black">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                v-model="loginData.password"
                class="flex-1"
                placeholder="密码"
                :type="passwordVisible === false ? 'password' : 'input'"
                size="large"
                name="password"
                @keyup="checkCapslock"
                @keyup.enter="handleLogin"
              />
              <span class="mr-2" @click="passwordVisible = !passwordVisible">
                <svg-icon
                  :icon-class="passwordVisible === false ? 'eye' : 'eye-open'"
                  class="text-black cursor-pointer"
                />
              </span>
            </el-form-item>
            <el-button
              size="default"
              :loading="loading"
              type="primary"
              class="w-full"
              @click.prevent="handleLogin"
              >{{ $t("login.login") }}
            </el-button>
          </el-form>
        </div>
      </main>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import LangSelect from "@/components/LangSelect/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

// 状态管理依赖
import { useUserStore } from "@/store/modules/user";

// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { getCaptchaApi } from "@/api/auth";
import { LoginData } from "@/api/auth/types";

const userStore = useUserStore();
const route = useRoute();

/**
 * 按钮loading
 */
const loading = ref(false);
/**
 * 是否大写锁定
 */
const isCapslock = ref(false);
/**
 * 密码是否可见
 */
const passwordVisible = ref(false);
/**
 * 验证码图片Base64字符串
 */
const captchaBase64 = ref();

/**
 * 登录表单引用
 */
const loginFormRef = ref(ElForm);

const loginData = ref<LoginData>({
  username: "",
  password: "",
});


/**
 * 密码校验器
 */
function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error("The password can not be less than 6 digits"));
  } else {
    callback();
  }
}

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

/**
 * 获取验证码
 */
function getCaptcha() {
  getCaptchaApi().then(({ data }) => {
    const { verifyCodeBase64, verifyCodeKey } = data;
    loginData.value.verifyCodeKey = verifyCodeKey;
    captchaBase64.value = verifyCodeBase64;
  });
}

/**
 * 登录
 */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          const query: LocationQuery = route.query;

          const redirect = (query.redirect as LocationQueryValue) ?? "/";

          const otherQueryParams = Object.keys(query).reduce(
            (acc: any, cur: string) => {
              if (cur !== "redirect") {
                acc[cur] = query[cur];
              }
              return acc;
            },
            {}
          );

          router.push({ path: redirect, query: otherQueryParams });
        })
        .catch(() => {
          // 验证失败，重新生成验证码
          // getCaptcha();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

onMounted(() => {
  // getCaptcha();
});
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  min-width: 1140px;
  height: 100%;
  min-height: 700px;
  align-items: center;
  justify-content: center;
  background-image: url(../../assets/images/login_truck.png);
  background-position: 0 100%, 100%;
  background-repeat: no-repeat;
  background-size: 70.83% auto, 29.17% 100%;
  background-color: #f5f8fa;

  .card {
    width: 420px;
    padding: 30px 30px 35px;
    background: #feffff;
    border-radius: 8px;
    box-shadow: 0 4px 10px 0 rgb(0 0 0 / 10%);
    position: absolute;
    right: 15%;
    top: 43%;
    transform: translateY(-50%);
    z-index: 2;

    p {
      height: 33px;
      margin-bottom: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 24px;
      font-weight: 500;
      line-height: 33px;
    }
  }

  .login__button {
    margin-top: 20px;
    margin-bottom: 0;
    width: 100%;
    height: 44px;
    border-radius: 20px;
  }

  aside {
    .logo {
      width: 200px;
      position: absolute;
      left: 264px;
      top: 80px;
      z-index: 2;
    }

    .title {
      position: absolute;
      left: 280px;
      top: 220px;
      z-index: 2;

      .title__main {
        color: #000;
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 46px;
        font-weight: 700;
        line-height: 48px;
      }

      .title__sub {
        height: 32px;
        color: #666;
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 22px;
        font-weight: lighter;
        line-height: 32px;
        margin-top: 16px;
      }
    }
  }

  .title-wrap {
    filter: contrast(30);

    .title {
      letter-spacing: 4px;
      animation: showup 3s forwards;
    }

    @keyframes showup {
      0% {
        letter-spacing: -20px;
      }

      100% {
        letter-spacing: 4px;
      }
    }
  }

  .login-form {
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    margin-bottom: 30px;
    .captcha {
      position: absolute;
      top: 0;
      right: 0;

      img {
        width: 120px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
}

.el-form-item {
  background: #fff;
  border: 1px solid #dedede;
  border-radius: 5px;
}

.el-input {
  background: transparent;

  // 子组件 scoped 无效，使用 :deep
  :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;

    .el-input__inner {
      color: #000;
      background: transparent;
      border: 0;
      border-radius: 0;
      caret-color: #000;
      letter-spacing: .1rem;
      padding-left: 6px;
      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: #000 !important;
      }

      // 设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition: color 99999s ease-out, background-color 99999s ease-out;
        transition-delay: 99999s;
      }
    }
  }
}
:deep(.el-form-item--large .el-form-item__content){
  line-height: 0px;
}
</style>
