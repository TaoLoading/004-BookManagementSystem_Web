<template>
  <div class="upload-container">
    <!-- 上传文件框 -->
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :on-exceed="onExceed"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-upload"
    >
      <i class="el-icon-upload" />
      <div
        v-if="fileList.length === 0"
        class="el-upload__text"
      >
        请将电子书拖入或 <em>点击上传</em>
      </div>
      <div
        v-else
        class="el-upload__text"
      >图书已上传</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: '',
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 上传图书接口地址
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    // 修改请求头，加入token验证
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    beforeUpload(file) {
      // file为文件信息
      this.$emit('beforeUpload', file)
    },
    // 成功信息提示框
    onSuccess(response, file) {
      const { code, msg } = response
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$emit('onSuccess', file)
      } else {
        this.$message({
          message: (msg && `上传失败，失败原因：${msg}`) || '上传失败',
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },
    // 错误信息提示框
    onError(err) {
      const errMsg = err.message && JSON.parse(err.message)
      this.$message({
        message: (errMsg && errMsg.msg && `上传失败，失败原因：${errMsg.msg}`) || '上传失败',
        type: 'error'
      })
      this.$emit('onError', err)
    },
    onRemove() {
      this.$message({
        message: '电子书删除成功',
        type: 'success'
      })
      this.$emit('onRemove')
    },
    // 传入超过超过限制数量电子书时调用，限制条件通过limit控制
    onExceed() {
      this.$message({
        message: '每次只能上传一本电子书',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
</style>
