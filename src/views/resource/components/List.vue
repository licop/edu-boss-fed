<template>
  <div class="resource-list">
    <el-card class="box-form">
      <div slot="header" class="clearfix">
        <div>
          <el-button
            style="float: right;"
            size="small"
            type="primary"
            @click="onSubmit"
            :disabled="isLoading"
          >查询搜索</el-button>
          <el-button
            style="float: right; margin-right: 15px"
            size="small"
            @click="onReset"
            :disabled="isLoading"
          >重置</el-button>
        </div>
        <el-form
          ref="form"
          :model="form"
          :inline="true"
          size="small"
          label-width="80px"
        >
          <el-form-item prop="name" label="资源名称:">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径:">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类:">
            <el-select
              v-model="form.categoryId"
              placeholder="请选择资源分类"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in resourceCategories"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd" size="small">添加资源</el-button>
    </el-card>
    <el-card class="box-table">
      <el-table
        :data="resources"
        size="medium"
        border
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          label="编号"
          align='center'
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          align='center'
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          min-width="200"
          align='center'
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          min-width="180"
          align='center'
          label="描述">
        </el-table-column>
        <el-table-column
          min-width="180"
          prop="createdTime"
          align='center'
          label="添加时间">
        </el-table-column>
        <el-table-column
          min-width="180"
          align='center'
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--
        total 总记录数
        page-size 每页大小
        分页组件会自动根据 total 和 page-size 计算出一共分多少页
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
    <el-dialog
      :title="isEdit ? '编辑资源' : '添加资源'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <create-or-edit
        v-if="dialogVisible"
        :resource-id="resourceId"
        :resourceCategories='resourceCategories'
        :is-edit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, deleteResource } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'
import moment from 'moment'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'ResourceList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      resources: [], // 资源列表
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 10, // 每页大小
        categoryId: null // 资源分类
      },
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: true, // 加载状态
      resourceId: null, // 编辑资源的 ID
      dialogVisible: false, // 控制添加/编辑角色的对话框显示和隐藏
      isEdit: false
    }
  },

  created () {
    this.loadResources()
    this.loadResourceCategories()
  },

  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
      console.log(this.resourceCategories, 179)
    },

    async loadResources () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.resources.forEach((item: any) => {
        item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:MM:SS')
      })
      console.log(this.resources, 181)
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },

    onSubmit () {
      this.form.current = 1 // 筛选查询从第 1 页开始
      this.loadResources()
    },

    handleEdit (resource: any) {
      this.dialogVisible = true
      this.resourceId = resource.id
      this.isEdit = true
    },

    async handleDelete (resource: any) {
      try {
        await this.$confirm(`确认删除角色：${resource.name}？`, '删除提示')
        await deleteResource(resource.id)
        this.$message.success('删除成功')
        this.loadResources()
      } catch (err) {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadResources()
    },

    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的页码
      this.loadResources()
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1 // 重置回到第1页
      this.loadResources()
    },

    onSuccess () {
      this.dialogVisible = false // 关闭对话框
      this.loadResources() // 重新加载数据列表
    },

    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    }
  }
})
</script>

<style lang="scss" scoped></style>
