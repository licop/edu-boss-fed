<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="资源名称:">
        <el-input v-model="resource.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径:">
        <el-input v-model="resource.url"></el-input>
      </el-form-item>
      <el-form-item label="资源分类:">
        <el-select
          v-model="resource.categoryId"
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
      <el-form-item label="资源描述:">
        <el-input type="textarea" v-model="resource.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getResourceById } from '@/services/resource'

export default Vue.extend({
  name: 'CreateOrEditResource',
  props: {
    resourceCategories: {
      type: Array
    },
    resourceId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      resource: {
        name: '',
        url: '',
        categoryId: '',
        description: ''
      }
    }
  },

  created () {
    // 如果是编辑操作，则根据角色 ID 加载展示角色信息
    if (this.isEdit) {
      this.loadResource()
    }
  },

  methods: {
    async loadResource () {
      const { data } = await getResourceById(this.resourceId)
      this.resource = data.data
    },

    async onSubmit () {
      await createOrUpdate(this.resource)
      this.$message.success('操作成功')
      this.$emit('success')
    }
  }
})
</script>

<style lang="scss" scoped></style>
