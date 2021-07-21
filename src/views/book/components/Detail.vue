<template>
  <el-form
    ref="postForm"
    :model="postForm"
    :rules="rules"
  >
    <sticky :class-name="'sub-navbar'">
      <el-button
        v-if="!isEdit"
        @click="showGuide"
      >显示帮助</el-button>
      <el-button
        v-loading="loading"
        type="success"
        style="margin-left: 10px"
        @click="submitForm"
      >
        {{ isEdit ? '编辑电子书' : '新增电子书' }}
      </el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <warning />
        <el-col :span="24">
          <!-- 电子书上传区域 -->
          <ebook-upload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <!-- 电子书信息表格 -->
          <el-form-item prop="title">
            <MdInput
              v-model="postForm.title"
              :maxlength="100"
              name="name"
              required
            >
              书名
            </MdInput>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="author"
                label="作者："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.author"
                  placeholder="作者"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="publisher"
                label="出版社："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.publisher"
                  placeholder="出版社"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="language"
                label="语言："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.language"
                  placeholder="语言"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="rootFile"
                label="根文件："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="filePath"
                label="文件路径："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="unzipPath"
                label="解压路径："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="coverPath"
                label="封面路径："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="originalName"
                label="文件名称："
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.originalName"
                  placeholder="文件名称"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="coverUrl"
                label="封面："
                :label-width="labelWidth"
              >
                <!-- 点击看大图 -->
                <a
                  v-if="postForm.coverUrl"
                  :href="postForm.coverUrl"
                  target="_blank"
                >
                  <img
                    :src="postForm.coverUrl"
                    class="preview-img"
                  >
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="contents"
                label="目录："
                :label-width="labelWidth"
              >
                <div
                  v-if="postForm.contents && postForm.contents.length > 0"
                  class="contents-wrapper"
                >
                  <el-tree
                    :data="contentsTree"
                    @node-click="onContentClick"
                  />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '../../../components/Sticky'
import Warning from './Warning'
import EbookUpload from '../../../components/EbookUpload'
import MdInput from '../../../components/MDinput'
import createBook from '../../../api/book'

export default {
  components: { MdInput, Sticky, Warning, EbookUpload },
  props: {
    isEdit: Boolean
  },
  data() {
    // 字段映射
    const fields = {
      title: '标题',
      author: '作者',
      publisher: '出版社',
      language: '语言'
    }
    // 校验规则
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {
        ebook_uri: ''
      },
      fileList: [],
      labelWidth: '120px',
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      }
    }
  },
  methods: {
    // 点击目录跳转到对应文件
    onContentClick(data) {
      if (data.text) {
        window.open(data.text)
      }
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalName,
        url,
        contents,
        contentsTree,
        fileName,
        coverUrl,
        filePath,
        unzipPath
      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        originalName,
        url,
        contents,
        contentsTree,
        fileName,
        coverUrl,
        filePath,
        unzipPath
      }
      this.fileList = [{ name: originalName, url }]
      this.contentsTree = contentsTree
    },
    setDefaultData() {
      /* this.postForm = {
        title: '',
        author: '',
        publisher: '',
        language: '',
        rootFile: '',
        cover: '',
        originalName: '',
        url: '',
        contents: '',
        contentsTree: '',
        fileName: '',
        coverUrl: '',
        filePath: '',
        unzipPath: ''
      } */
      this.fileList = []
      this.contentsTree = []
      this.$refs.postForm.resetFields()
      // location.reload()
    },
    // 读取上传的图书信息
    onUploadSuccess(data) {
      // console.log('上传成功')
      this.setData(data)
    },
    // 移除上传的图书信息
    onUploadRemove() {
      // console.log('移除成功')
      this.setDefaultData()
    },
    // 提交表单
    submitForm() {
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
            // 正常提交
            const book = Object.assign({}, this.postForm)
            delete book.contents
            delete book.contentsTree
            if (!this.isEdit) {
              // 创建图书模式
              createBook(book).then(res => {
                const { msg } = res
                this.$notify({
                  title: '上传成功',
                  message: msg,
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
                // this.setDefaultData()
              })
                .catch(() => {
                  this.loading = false
                })
            } else {
              // 更新图书模式
              // updateBook(book)
            }
          } else {
            // 不符合校验规则时提示
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    showGuide() {
      console.log('show guide...')
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 40px 50px 20px;
  .preview-img {
    width: 200px;
    height: 270px;
  }
}
</style>
